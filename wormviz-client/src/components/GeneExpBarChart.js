import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Label } from 'recharts';

function GeneExpBarChart(props)
{
    if (!props.data) return null;
    
    const {
        egl19_1, egl19_2, egl19_3,
        zf35_1, zf35_2, zf35_3,
        wormbaseid,
    } = props.data;

    const data = [
        { gene: 'egl19', data1: egl19_1, data2: egl19_2, data3: egl19_3 },
        { gene: 'zf35', data1: zf35_1, data2: zf35_2, data3: zf35_3 }
    ]

    return (
        <div style={styles.container}>
            <h3>
                Gene Expression for { wormbaseid }
            </h3>
            <BarChart 
                width={500} 
                height={300} 
                margin={{ top: 10, bottom: 10 }} 
                data={data}
            >
                <XAxis dataKey="gene" height={40} minTickGap={10}>
                    <Label value="Gene" offset={0} position="insideBottom" />
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
    }
}

export default GeneExpBarChart;