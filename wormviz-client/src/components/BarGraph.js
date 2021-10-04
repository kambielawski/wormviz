import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Label } from 'recharts';

function BarGraph(props)
{
    return (
        <div style={styles.container}>
            <h3>
                Pathogens v Lifespan for gene x
            </h3>
            <BarChart 
                width={700} 
                height={300} 
                margin={{ top: 10, bottom: 10 }} 
                data={props.data}
            >
                <XAxis dataKey="pathogen" height={40} minTickGap={10}>
                    <Label value="Pathogens" offset={0} position="insideBottom" />
                </XAxis>
                <YAxis label={{ value: 'LT50 (days)', angle:-90, position: 'insideLeft' }} />
                <Bar dataKey="lt50" barSize={30} fill="blue" />
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

export default BarGraph;
