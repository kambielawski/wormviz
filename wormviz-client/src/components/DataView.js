// import './App.css';
import React, { useState } from 'react';

import SearchBar from './SearchBar';
import BarGraph from './BarGraph';
import GeneExpBarChart from './GeneExpBarChart';
import LifespanBoxplot from './LifespanBoxplot/LifespanBoxplot';

function DataView({ history }) {

    const [geneExpData, setGeneExpData] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

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
            {history.location?.state?.loginError ? <p style={styles.error}>{history.location?.state?.loginError}</p> : null}
            <div style={styles.searchBar}>
                <SearchBar setGeneExp={queryGene} />
            </div>
            {/* <BarGraph data={data} /> */}
            {geneExpData ? <GeneExpBarChart data={geneExpData} /> 
                         : <p style={styles.error}>{errorMessage}</p>}
            <LifespanBoxplot />
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

