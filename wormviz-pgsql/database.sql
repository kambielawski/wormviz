CREATE DATABASE worm_database;

-- \c into worm_database

CREATE TABLE lifespan(
    id SERIAL PRIMARY KEY,
    genotype VARCHAR(255),
    pathogen VARCHAR(255) NOT NULL,
    expanded_pathogen VARCHAR(255),
    experiment_date DATE,
    repl NUMERIC(5,1),
    LT50 NUMERIC(5,1) NOT NULL
);

CREATE TABLE expression(
    wormbaseId VARCHAR(255) PRIMARY KEY,
    egl19_1 INTEGER,
    egl19_2 INTEGER,
    egl19_3 INTEGER,
    zf35_1 INTEGER,
    zf35_2 INTEGER,
    zf35_3 INTEGER
);