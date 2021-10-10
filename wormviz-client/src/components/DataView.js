// import './App.css';
import React, { useState } from 'react';

import SearchBar from './SearchBar';
import BarGraph from './BarGraph';
import GeneExpBarChart from './GeneExpBarChart';
import LifespanBoxplot from './LifespanBoxplot/LifespanBoxplot';

function DataView() {

    const [data, setData] = useState(null);
    const [geneExpData, setGeneExpData] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [lifespanData, setLifespanData] = useState(null);

    function queryGene(wormbaseid) {
        fetch(`http://localhost:3001/expression/${wormbaseid}`)
            .then((res) => {
              return res.json();
            })
            .then((data) => {
                if (data.error) {
                  setErrorMessage(data.error);
                } else {
                  setGeneExpData(data);
                }
            })
            .catch((e) => {
                setErrorMessage(e.message);
                console.error(e);
            });
    }

    return (
        <div style={styles.container}>
            <div style={styles.searchBar}>
                <SearchBar setGeneExp={queryGene} />
            </div>
            {/* <BarGraph data={data} /> */}
            {geneExpData ? <GeneExpBarChart data={geneExpData} /> 
                         : <p style={styles.error}>{errorMessage}</p>}
            <LifespanBoxplot rawData={lifespanData} />
        </div>
   );
}

const styles = {
    searchBar: {
        height: '10%',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    error: {
        color: 'red'
    }
}

export default DataView;

