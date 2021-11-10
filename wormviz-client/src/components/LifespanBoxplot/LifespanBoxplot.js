import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const BACKEND_HOST = 'ec2-3-14-80-149.us-east-2.compute.amazonaws.com:8000';

const median = arr => {
    const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

// https://stackoverflow.com/a/55297611
const quantile = (arr, q) => {
    const sorted = arr.sort((a,b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

function processLifespanData(lifespanEntries) {
    let data = [];
    let uniquePathogens = {};

    /* separate by pathogen */
    for (let entry of lifespanEntries) {
        if (!uniquePathogens[entry['pathogen']])
            uniquePathogens[entry['pathogen']] = [];
        uniquePathogens[entry.pathogen].push(entry);
    }

    /* Calculate min, 1st quartile, med, 3rd quartile, max */
    let lt50s, boxplotData;
    for (let pathogen in uniquePathogens) {
        lt50s = [];
        boxplotData = {};
        for (let entry of uniquePathogens[pathogen]) {
            lt50s.push(parseInt(entry.lt50));
        }
        boxplotData = {
            x: pathogen,
            y: [
                Math.min(...lt50s),
                quantile(lt50s, 0.25),
                median(lt50s),
                quantile(lt50s, 0.75),
                Math.max(...lt50s),
            ]
        }
        data.push(boxplotData);
    }

    return data;
}

function LifespanBoxplot(props) {

    const [loading, setLoading] = useState(true);
    const [boxplotData, setBoxplotData] = useState([]);

    // fetch lifespan data from database
    useEffect(() => {
        fetch(`http://${BACKEND_HOST}/lifespan_entries`)
            .then((res) => res.json())
            .then((data) => {
                setBoxplotData(processLifespanData(data));
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            })
    }, [])

    const chart = {
        series: [
          {
            type: 'boxPlot',
            data: boxplotData,
          }
        ],
        options: {
          chart: {
            type: 'boxPlot',
            height: 700,
            width: 200
          },
          title: {
            text: 'Various Pathogens LT50',
            align: 'center'
          },
          plotOptions: {
            boxPlot: {
              colors: {
                upper: '#5C4742',
                lower: '#A5978B'
              }
            }
          },
          yaxis: {
              type: 'numeric',
              min: 0,
              title: {
                  text: 'LT50',
              }
          },
          xaxis: {
              type: 'category',
              title: {
                  text: 'Pathogen'
              }
          }
        },
      };

      // TODO: use spinner or something
      if (loading) {
        return (
            <p>Loading...</p>
        );
      } else {
        return (
            <div style={{paddingLeft: '20%', paddingRight: '20%'}}>  
                <ReactApexChart
                    options={chart.options} 
                    series={chart.series} 
                    type="boxPlot" 
                    height={500}
                />
            </div>
        );
    }
}

export default LifespanBoxplot;