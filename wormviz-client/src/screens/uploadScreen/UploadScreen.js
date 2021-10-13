import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

import csvToJson from './csvtojson';

const UPLOAD_BATCH_LIMIT = 10000;

const UploadScreen = (props) => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState({ uploading: false, total: 0 });

    const [numUploaded, setNumUploaded] = useState(0);

    function fileChangeHandler(event) {
        setFileList([]);
        setErrorMessage(null);
        for (let f of event.target.files) {
            if (f.type !== 'text/csv') {
                setErrorMessage('Uploads must be CSV files');
            } else {
                setFileList(fileList => [...fileList, f]);
                    setLoading({ ...loading, total: 0 });
            }
        }
    }

    async function postToDatabase(items) {
        setLoading({...loading, uploading: true, total: items.length});

        let count = 0;
        let totalCount = 0;

        let i=0, j=UPLOAD_BATCH_LIMIT;
        while (i < items.length) {
            await fetch('http://localhost:3001/test_post', 
                { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: items.slice(i, j) })
                })
                .then((res) => res.json())
                .then((data) => {
                    count = data.length;
                })
                .catch((err) => setErrorMessage(err.message));
            i += UPLOAD_BATCH_LIMIT;
            j += UPLOAD_BATCH_LIMIT;
            totalCount += count;
            setNumUploaded(totalCount);

            /* done uploading if all items uploaded */
            if (numUploaded === items.length)
                setLoading({ ...loading, uploading: false, total: totalCount });
        }

        console.log(fileList);
    }

    function onUpload() {

        const reader = new FileReader();
        reader.onload = (e) => {
            const items = csvToJson(e.target.result);
            console.log(items[0]);

            /* Check if it has the required columns */
            const requiredCols = ['wbgene', 'pathogen', 'expression'];
            let missingCols = [];
            for (const reqCol of requiredCols) {
                if (!Object.keys(items[0]).includes(reqCol))
                    missingCols.push(reqCol);
            }

            if (missingCols.length) {
                setErrorMessage('The following columns are missing or mis-named: ' + missingCols.join(', '));
            } else {
                postToDatabase(items);
            }
        }
        /* Check if it is a CSV file */
        setErrorMessage(null);  
        if (fileList[0].type === 'text/csv') {
            reader.readAsText(fileList[0]);
        } else {
            setErrorMessage('Uploads must be CSV files');
        }
    }

    return(
        <div style={styles.container}>
            <div style={styles.subContainer}>
                <h3 style={styles.bold}>Upload</h3>
                <input type="file" onChange={fileChangeHandler} />
                <p style={styles.error}>{errorMessage}</p>
                {fileList.length ? <table style={styles.table}>
                    <tbody>
                    {fileList.map((file, i) => (
                        <tr style={styles.tableRow} key={i}>
                            <td style={styles.tableText}>{file.name}</td>
                            <td style={styles.tableText}>{loading.total ? numUploaded + ' / ' + loading.total + ' uploaded' : '-'}</td>
                        </tr>
                        ))}
                    </tbody>
                </table> : null}
                <Button onClick={onUpload}>Upload</Button>
            </div>
            <div style={styles.subContainer}>
                <h3 style={styles.bold}>Directions</h3>
                <p>
                    1. Upload a comma separated variable (.csv) file with the following columns: 
                    <strong> wbgene</strong> containing the Wormbase Gene ID (e.g. 'WBGene00007194'),
                    <strong> expression</strong> containing an integer expression-count for the experiment, and
                    <strong> pathogen</strong> containing the experiment's relevant pathogen 
                </p>
                <p>
                    2. Optionally, you can add an <strong>extended_pathogen</strong> column to specify exactly 
                    the relevant pathogen; or you can add a <strong>condition</strong> column to specify experiment
                    conditions. 
                </p>
                <p>
                    Example:
                </p>
                <table style={styles.table}>
                    <tr style={styles.tableRow}>
                        <th style={styles.tableText}>wbgene</th>
                        <th style={styles.tableText}>expression</th>
                        <th style={styles.tableText}>pathogen</th>
                        <th style={styles.tableText}>condition</th>
                        <th style={styles.tableText}>extended_pathogen</th>
                    </tr>
                    <tr style={styles.tableRow}>
                        <td style={styles.tableText}>WBGene00010957</td>
                        <td style={styles.tableText}>1053</td>
                        <td style={styles.tableText}>N2</td>
                        <td style={styles.tableText}>wild-type</td>
                        <td style={styles.tableText}></td>
                    </tr>
                </table>
                <p>3. At this time, any other columns in the CSV file will be ignored.</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    subContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    table: {
        border: '1px solid black',
        margin: '5px',
        marginBottom: '20px',
    },
    tableRow: {
        padding: '3px',
        border: '1px solid black',
    },
    tableText: {
        padding: '5px',
        border: '1px solid black',
    },
    error: {
        color: 'red',
    },
    bold: {
        fontWeight: 'bold',
    }
}

export default UploadScreen;