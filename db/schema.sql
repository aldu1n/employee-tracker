DROP DATABASE IF EXISTS employer_db;

CREATE DATABASE employer_db;

USE employer_db;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(30)
);