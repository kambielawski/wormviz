import './App.css';
import React, { useState } from 'react';

import SearchBar from './components/SearchBar';
import BarGraph from './components/BarGraph';
import GeneExpBarChart from './components/GeneExpBarChart';
import LifespanBoxplot from './components/LifespanBoxplot/LifespanBoxplot';

function App() {

    const [geneExpData, setGeneExpData] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    console.log(geneExpData);

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
        <div className="App">
            <div style={styles.searchBar}>
                <SearchBar setGeneExp={queryGene} />
            </div>
            {/* <BarGraph data={data} /> */}
            {geneExpData ? <GeneExpBarChart data={geneExpData} /> : errorMessage}
            <LifespanBoxplot />
        </div>
   );
}

const styles = {
    searchBar: {
        height: '10%',
    }
}

export default App;

