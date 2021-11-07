import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

function SearchBar(props)
{
    const [searchFieldContent, setContent] = useState('');

    function handleSearchClick() {
        if (searchFieldContent) {
            props.setGeneExp(searchFieldContent);
        }
    }
    
    return (
        <>
            <Link to={{
                pathname: '/upload',
                state: props.history?.location?.state,
            }}>Upload Data</Link>
            <p>Search by Wormbase ID</p>
            <div style={styles.container}>
                <InputGroup style={styles.searchBox}>
                    <FormControl
                        placeholder="Wormbase ID"
                        onChange={e => setContent(e.target.value)}
                    />
                </InputGroup>
                <Button variant="primary" onClick={handleSearchClick}>
                    Search
                </Button>
            </div>
        </>
    );
}

const styles = {
    container: {
        margin: 10,
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
    }, 
    searchBox: {
        marginRight: 10,
    }
}

export default SearchBar;
