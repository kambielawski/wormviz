import React, { Component, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

function processLifespanData(lifespanEntries) {
    let data = [];

    // TODO: process lifespan entries into chart-readable format
    console.log(lifespanEntries);

    return data;
}

function LifespanBoxplot(props) {

    const [loading, setLoading] = useState(true);
    const [boxplotData, setBoxplotData] = useState([]);

    // fetch lifespan data from database
    useEffect(() => {
        fetch('http://localhost:3001/lifespan_entries')
            .then((res) => res.json())
            .then((data) => {
                setBoxplotData(processLifespanData(data));
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            })
    }, [])

    const chart = {
        series: boxplotData,
        // [
        //   {
        //     type: 'boxPlot',
        //     data: [
        //       {
        //         x: 'Jan 2015',
        //         y: [54, 66, 69, 75, 88]
        //       },
        //       {
        //         x: 'Jan 2016',
        //         y: [43, 65, 69, 76, 81]
        //       },
        //       {
        //         x: 'Jan 2017',
        //         y: [31, 39, 45, 51, 59]
        //       },
        //       {
        //         x: 'Jan 2018',
        //         y: [39, 46, 55, 65, 71]
        //       },
        //       {
        //         x: 'Jan 2019',
        //         y: [29, 31, 35, 39, 44]
        //       },
        //       {
        //         x: 'Jan 2020',
        //         y: [41, 49, 58, 61, 67]
        //       },
        //       {
        //         x: 'Jan 2021',
        //         y: [54, 59, 66, 71, 88]
        //       }
        //     ]
        //   }
        // ],
        options: {
          chart: {
            type: 'boxPlot',
            height: 700,
            width: 200
          },
          title: {
            text: 'Lifespan Studies',
            align: 'center'
          },
          plotOptions: {
            boxPlot: {
              colors: {
                upper: '#5C4742',
                lower: '#A5978B'
              }
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
            <div id="chart">  
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