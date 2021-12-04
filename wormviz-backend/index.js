var fs = require('fs');

const express = require('express');
const app = express();
const cors = require('cors');
// lets us see into the database
const pool = require('./db');
const { response } = require('express');

app.use(cors());
app.options('*', cors());
// limit 25mb for uploading big files
app.use(express.json({ limit: '250mb' })); // lets us access req.body

/******* ROUTES *******/

/* GENE EXPRESSION ROUTES */

app.get('/expression/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const expressionEntry = await pool.query(
            'SELECT * FROM expression WHERE wbgene = $1;',
            [id]
        );
        if (expressionEntry.rows.length) {
            res.json(expressionEntry.rows);
        } else {
            res.json({ error: `Couldn't find gene ${id || ''} in database` });
        }
    } catch (err) {
        console.error(err.message);
    }
});

/* Batch post expression data */
app.post('/expression', async (req, res) => {
    try {
        const { items } = req.body;

        /* construct query string */
        let query = 'INSERT INTO expression (wbgene, expression, condition, pathogen, extended_pathogen) VALUES ';
        for (let item of items) {
            query += `('${item.wbgene}', ${item.expression}, '${item.condition}', '${item.pathogen || ''}', '${item.extended_pathogen || ''}'), `;
        }
        query = query.slice(0,query.length-2);
        query += ' RETURNING *;';

        /* make database query */
        const entries = await pool.query(query);

        res.json(entries.rows);

    } catch (err) {
        console.error(err);
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

        // TODO: make a batch insert query 
        for (entry of items) {
            newEntry = await pool.query(
                'INSERT INTO lifespan (genotype, pathogen, ' + 
                'expanded_pathogen, experiment_date, repl, LT50) ' +
                'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
                [entry.genotype, entry.pathogen, entry.expandedPathogenName, 
                    entry.experimentDate, entry.replicate, entry.lt50]
            );
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
        let query = 'INSERT INTO test_table (wbgene, expression, condition, pathogen, extended_pathogen) VALUES ';
        for (let item of items) {
            query += `('${item.wbgene}', ${item.expression}, '${item.condition || ''}', '${item.pathogen}', '${item.extended_pathogen || ''}'), `;
        }
        query = query.slice(0,query.length-2);
        query += ' RETURNING *;';

        /* make database query */
        const entries = await pool.query(query);

        res.json(entries.rows);

    } catch (err) {
        console.error(err);
    }
});

/* ALIAS DATABASE ENDPOINTS */

app.post('/refresh_alias_db', async (req, res) => {
    try {
        console.log('Deleting current alias table...');
        await pool.query('DROP TABLE IF EXISTS wbgene_aliases;');

        console.log('Creating new table...');
        await pool.query('CREATE TABLE wbgene_aliases(alias VARCHAR(255) PRIMARY KEY, wbgene VARCHAR(255));');

        console.log('Reloading alias entries...');

        // read csv and post entries into database
        var textByLine = fs.readFileSync("./alias_db.csv").toString().split("\n");
        const aliases = textByLine.map((line) => line.split(","));
        let query = 'INSERT INTO wbgene_aliases (alias, wbgene) VALUES ';
        for (let pair of aliases.slice(1)) {
            if (pair[0] && pair[1])
                query += `('${pair[0]}', '${pair[1]}'), `;
        }
        query = query.slice(0,query.length-2);
        query += ' RETURNING *;';

        const entries = await pool.query(query);
        
        res.json(entries.rows);

    } catch (err) {
        console.error(err.message);
    }
});

app.get('/getbyalias/:alias', async (req, res) => {
    try {
        const { alias } = req.params;

        const dbRes = await pool.query(`SELECT * FROM wbgene_aliases WHERE alias = $1;`, [alias]);

        if (dbRes.rows)
            res.json(dbRes.rows[0]);
        else
            res.json({ error: `Couldn't find gene ${alias} in database` });
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/getallaliases/:wbgene', async (req, res) => {
    try {
        const { wbgene } = req.params;

        const dbRes = await pool.query(`SELECT * FROM wbgene_aliases WHERE wbgene = $1;`, [wbgene]);

        res.json(dbRes.rows);

    } catch (err) {
        console.error(err.message);
    }
});

/* AUTH ENDPOINTS */

const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';

app.post('/add_authorized_email', async (req, res) => {
    try {
        const { email } = req.body;
        const entry = await pool.query('INSERT INTO authorized_emails (email) VALUES ($1) RETURNING *;', [email]);
        res.json(entry.rows);
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/login', async (req, res) => {
    try {
        const { email } = req.query;
        const entry = await pool.query('SELECT * FROM authorized_emails WHERE email=$1;', [email]);
        if (entry.rows.length != 0) {
            res.json({ status: LOGIN_SUCCESS });
        } else {
            res.json({ status: LOGIN_FAILURE });
        }
    } catch (err) {
        console.error(err.message);
    }
});

app.get('/userlogin', async (req, res) => {
    try {
        const { username, password } = req.query;
        const entry = await pool.query('SELECT * FROM authorized_emails WHERE username=$1 AND password=$2;', [username, password]);
        if (entry.rows.length != 0) {
            res.json({ status: LOGIN_SUCCESS });
        } else {
            res.json({ status: LOGIN_FAILURE });
        }
    } catch (err) {
        console.error(err.message);
    }
})

/* expose app */

app.listen(8000, () => {
    console.log('server is listening on port 8000');
});

