// import './App.css';
import React, { useState } from 'react';

import SearchBar from './SearchBar';
import GeneExpBarChart from './GeneExpBarChart';
import LifespanBoxplot from './LifespanBoxplot/LifespanBoxplot';
import WBGeneOverview from './WBGeneOverview';

const BACKEND_HOST = 'ec2-3-129-98-89.us-east-2.compute.amazonaws.com:8000';

function DataView({ history }) {

    const [geneExpData, setGeneExpData] = useState('');
    const [wbWidget, setWbWidget] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    function queryGene(wormbaseid) {
        setErrorMessage(null);
        fetch(`http://${BACKEND_HOST}/expression/${wormbaseid}`)
            .then((res) => {
              return res.json();
            })
            .then((data) => {
                if (data.error) {
                  setErrorMessage(data.error);
                } else {
                    setGeneExpData(data);
                    fetch(`https://wormbase.org//rest/widget/gene/${wormbaseid}/overview`)
                        .then(res => res.json())
                        .then((d) => {
                            setWbWidget(d);
                        })
                        .catch(e => console.error(e.message));
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
            {errorMessage ? <p style={styles.error}>{errorMessage}</p> : null}
            {geneExpData ? <GeneExpBarChart data={geneExpData} /> : null}
            {wbWidget ? <WBGeneOverview overview={wbWidget} /> : null}
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

