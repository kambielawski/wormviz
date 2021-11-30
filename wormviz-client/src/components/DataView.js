// import './App.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import SearchBar from './SearchBar';
import GeneExpBarChart from './GeneExpBarChart';
// import LifespanBoxplot from './LifespanBoxplot/LifespanBoxplot';
import WBGeneOverview from './WBGeneOverview';

const BACKEND_HOST = 'ec2-3-129-98-89.us-east-2.compute.amazonaws.com:8000';

function DataView({ history }) {

    const [geneExpData, setGeneExpData] = useState('');
    const [wbWidget, setWbWidget] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    async function queryGene(search) {
        setErrorMessage(null);
        let wbgene = search;
        if (wbgene.slice(0,6) !== 'WBGene') {
            /* Search for alias */
            console.log('searching for alias' + `http://${BACKEND_HOST}/getbyalias/${search}`);
            await fetch(`http://${BACKEND_HOST}/getbyalias/${search}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.error) {
                        setErrorMessage(data.error);
                        return;
                    } else {
                        wbgene = data.wbgene;
                    }
                })
                .catch((e) => console.error(e.message));
        }

        console.log(wbgene);
        
        fetch(`http://${BACKEND_HOST}/expression/${wbgene}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                  setErrorMessage(data.error + ` (${search} not found)`);
                } else {
                    setGeneExpData(data);
                    /* Grab WB widget */
                    fetch(`https://wormbase.org//rest/widget/gene/${wbgene}/overview`)
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
        <>
            <div style={styles.header}>
                <Link to={{
                    pathname: '/upload',
                    state: history.location?.state,
                }}>Upload Data</Link>
            </div>
            <div style={styles.container}>
                {history.location?.state?.loginError ? <p style={styles.error}>{history.location?.state?.loginError}</p> : null}
                <div style={styles.searchBar}>
                    <SearchBar setGeneExp={queryGene} />
                </div>
                {errorMessage ? <p style={styles.error}>{errorMessage}</p> : null}
                {geneExpData ? <GeneExpBarChart data={geneExpData} /> : null}
                {wbWidget ? <WBGeneOverview overview={wbWidget} /> : null}
                {/* <LifespanBoxplot /> */}
            </div>
        </>
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
    },
    header: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: 10, 
        backgroundColor: '#EAEAEA',
    }
}

export default DataView;

