const express = require('express');
const app = express();
const cors = require('cors');
// lets us see into the database
const pool = require('./db');

app.use(cors());
// limit 25mb for uploading big files
app.use(express.json({ limit: '25mb' })); // lets us access req.body

/* ROUTES */

/* GENE EXPRESSION ROUTES */

app.get('/expression/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const expressionEntry = await pool.query(
            'SELECT * FROM expression WHERE wormbaseid = $1;',
            [id]
        );
        if (expressionEntry.rows.length == 0) {
            res.json({ error: `Couldn't find Wormbase ID ${id || ''} in database` });
        } else {
            res.json(expressionEntry.rows[0]);
        }
    } catch (err) {
        console.error(err.message);
    }
});

/* Batch post expression data */
app.post('/expression', async (req, res) => {
    try {
        const { items } = req.body;
        let newEntry;
        let newEntries = [];

        // TODO: make a batch insert query 
        for (entry of items) {
            newEntry = await pool.query(
                'INSERT INTO expression (wormbaseid, egl19_1, egl19_2, egl19_3, zf35_1, zf35_2, zf35_3) ' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
                [entry.geneid, entry.egl19_1, entry.egl19_2, entry.egl19_3, 
                    entry.zf35_1, entry.zf35_2, entry.zf35_3]
            );
            newEntries.push(newEntry.rows);
        }
        res.json(newEntries);
    } catch (err) {
        console.error(err.message);
    }
});

/* LIFESPAN ROUTES */

// get all lifespan entries

app.get('/lifespan_entries', async (req, res) => {
    try {
        const allEntriesResponse = await pool.query(
            "SELECT * FROM lifespan"
        );

        res.json(allEntriesResponse.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get a lifespan entry

app.get('/lifespan_pathogen', async (req, res) => {
    try {
        const { pathogen } = req.body;
        console.log(pathogen); 
        
        const entries = await pool.query(
            'SELECT * FROM lifespan WHERE pathogen = $1;',
            [pathogen]
        );
        res.json(entries.rows);
    
    } catch (err) {
        console.error(err.message);
    }
});

// create a lifespan entry

app.post('/lifespan_entry', async (req, res) => {
    try {
        // await 
        const { description } = req.body;
        const newLifespanEntry = await pool.query(
            "INSERT INTO lifespan (description) VALUES ($1) RETURNING *",
            [description]
        );
        res.json(newLifespanEntry.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// create batch of entries

app.post('/lifespan', async (req, res) => {
    try {
        const { items } = req.body;
        let newEntry;
        let newEntries = [];
        console.log(items);

        // TODO: make a batch insert query 
        for (entry of items) {
            newEntry = await pool.query(
                'INSERT INTO lifespan (genotype, pathogen, ' + 
                'expanded_pathogen, experiment_date, repl, LT50) ' +
                'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
                [entry.genotype, entry.pathogen, entry.expandedPathogenName, 
                    entry.experimentDate, entry.replicate, entry.lt50]
            );
            console.log(newEntry.rows);
            newEntries.push(newEntry.rows);
        }

        res.json(newEntries);

    } catch (err) {
        console.error(err.message);
    }
});

// update a lifespan entry

// delete a lifespan entry

app.delete('/lifespan', async (req, res) => {
    try {
        const { id } = req.body;
        const entry = await pool.query(
            'DELETE FROM lifespan WHERE id = $1 RETURNING *',
            [id]
        );
        console.log('entry deleted: ', entry.rows);
        res.json(entry.rows);
    } catch (err) {
        console.error(err.message);
    }
});

/* TESTING endpoints */

app.post('/test_post', async (req, res) => {
    try {
        const { items } = req.body;

        /* construct query string */
        let query = 'INSERT INTO test_table (col1, col2, col3) VALUES ';
        for (item of items) {
            query += `('${item.col1}', '${item.col2}', '${item.col3}'), `;
        }
        query = query.slice(0,query.length-2);
        query += ' RETURNING *;';

        entries = pool.query(query);

        res.json(entries.rows);

    } catch (err) {
        console.error(err);
    }
});

app.listen(3001, () => {
    console.log('server is listening on port 3001');
});

