CREATE USER kam;

CREATE DATABASE worm_database;

GRANT ALL PRIVILEGES ON DATABASE worm_database TO kam;

\c worm_database

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
    wbgene VARCHAR(255) NOT NULL,
    expression INTEGER NOT NULL,
    condition VARCHAR(255),
    pathogen VARCHAR(255) NOT NULL,
    extended_pathogen VARCHAR(255)
);

CREATE TABLE authorized_emails(
    email VARCHAR(255) PRIMARY KEY
);

INSERT INTO authorized_emails (email) VALUES ('kamtb28@gmail.com');