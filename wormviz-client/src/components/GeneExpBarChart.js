import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { BarChart, Bar, XAxis, YAxis, Label } from 'recharts';

function fieldGetAll(queryResult, field) {
    if (!queryResult) return [];
    let all = [];
    for (let row of queryResult)
        all.push(row[field]);
    return all;
}

function processExpData(queryResult, filteredConditions=[]) {
    /* Get pathogens and conditions */
    const pathogens = new Set(fieldGetAll(queryResult, 'pathogen'));
    const conditions = new Set(fieldGetAll(queryResult, 'condition'));

    let data = [];

    /* now iterate over pathogens and grab expression counts */
    let pData, d;
    for (let pathogen of pathogens) {
        pData = { pathogen };
        d = 1;
        for (let row of queryResult) {
            if (filteredConditions.includes(row.condition))
                continue;
            if (row.pathogen === pathogen) {
                pData.condition = row.condition;
                pData[`data${d}`] = row.expression;
                d += 1;
            }
        }
        console.log('PDATA: ', pData);
        if (pData.condition)
            data.push(pData);
    }

    return data;
}

const initialCheckboxes = (conditions) => {
    let checkboxes = {};
    for (const c of conditions) 
        checkboxes[c] = true;

    return checkboxes;
}

/* TODO: switch to Apex Charts */
function GeneExpBarChart(props)
{
    const conditions = fieldGetAll(props.data, 'condition');
    const [checkboxes, setCheckboxes] = useState(initialCheckboxes(conditions));
    const [filteredData, setFilteredData] = useState([])

    /* Load all data into filteredData */
    useEffect(() => setFilteredData(processExpData(props.data)), [props.data]);

    /* Update data whenever checkboxes are checked/unchecked */
    useEffect((a) => {
        const excludedConditions = Object.keys(checkboxes).filter((cond) => !checkboxes[cond]);
        console.log('excluded: ', excludedConditions);
        setFilteredData(processExpData(props.data, excludedConditions));
    }, [checkboxes]);

    const chartConfig = {
        series: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
            name: 'Free Cash Flow',
            data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
        yaxis: {
            title: {
                text: '$ (thousands)'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "$ " + val + " thousands"
                }
            }
        }
    };

    if (!props.data) return null;

    return (
        <div style={styles.container}>
            <h3>
                Gene Expression for { props.data[0].wbgene }
            </h3>
            {/* <ReactApexChart
                options={chartConfig}
                series={chartConfig.series}
                type="bar"
                height="500"
            /> */}
            <div style={styles.chartContainer}>
                <BarChart 
                    width={700} 
                    height={300} 
                    margin={{ top: 10, bottom: 10 }} 
                    data={filteredData}
                >
                    <XAxis dataKey="pathogen" height={40} minTickGap={10}>
                        <Label value="Pathogen" offset={0} position="insideBottom" />
                    </XAxis>
                    <YAxis label={{ value: 'Expression count', angle:-90, position: 'insideLeft' }} />
                    <Bar dataKey="data1" barSize={30} fill="blue" />
                    <Bar dataKey="data2" barSize={30} fill="blue" />
                    <Bar dataKey="data3" barSize={30} fill="blue" />
                </BarChart>
                <div>
                    {Object.keys(checkboxes).map((cond) => {
                        return (
                            <p key={cond}>
                                <input
                                    type="checkbox"
                                    id={cond}
                                    checked={checkboxes[cond]}
                                    onChange={(e) => setCheckboxes({...checkboxes, [cond]: e.target.checked})}
                                />
                                <label for={cond}>{cond}</label>
                            </p>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 100,
    },
    chartContainer: {
        display: 'flex'
    }
}

export default GeneExpBarChart;