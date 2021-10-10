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
    id SERIAL PRIMARY KEY,
    wormbaseId VARCHAR(255) NOT NULL,
    expression INTEGER NOT NULL,
    condition VARCHAR(255),
    pathogen VARCHAR(255),
    extended_pathogen VARCHAR(255)
);