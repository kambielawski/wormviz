import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Label } from 'recharts';

function processExpData(queryResult) {
    /* Get pathogens and conditions */
    let allPathogens = [], allConditions = [];
    for (let row of queryResult) {
        allPathogens.push(row.pathogen);
        allConditions.push(row.condition);
    }
    const pathogens = new Set(allPathogens);
    const conditions = new Set(allConditions);

    let data = [];

    /* now iterate over pathogens and grab expression counts */
    let pData, d;
    for (let pathogen of pathogens) {
        pData = { pathogen };
        d = 1;
        for (let row of queryResult) {
            if (row.pathogen === pathogen) {
                pData.condition = row.condition;
                pData[`data${d}`] = row.expression;
                d += 1;
            }
        }
        data.push(pData);
    }

    console.log(data);
    return data;
}

/* TODO: switch to Apex Charts */
function GeneExpBarChart(props)
{
    if (!props.data) return null;

    const data = processExpData(props.data);

    return (
        <div style={styles.container}>
            <h3>
                Gene Expression for { props.data[0].wbgene }
            </h3>
            <BarChart 
                width={700} 
                height={300} 
                margin={{ top: 10, bottom: 10 }} 
                data={data}
            >
                <XAxis dataKey="pathogen" height={40} minTickGap={10}>
                    <Label value="Pathogen" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis label={{ value: 'Expression count', angle:-90, position: 'insideLeft' }} />
                <Bar dataKey="data1" barSize={30} fill="blue" />
                <Bar dataKey="data2" barSize={30} fill="blue" />
                <Bar dataKey="data3" barSize={30} fill="blue" />
            </BarChart>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 100,
    }
}

export default GeneExpBarChart;