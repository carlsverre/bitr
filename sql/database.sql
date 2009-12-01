-- The main database spec for bitr

CREATE TABLE users (
    id              SERIAL PRIMARY KEY UNIQUE,
    username        VARCHAR(128) UNIQUE NOT NULL,
    fullname        VARCHAR(128),
    last_login      TIMESTAMP,
    creation_date   DATE DEFAULT current_date,
    location        VARCHAR(128),
    password        VARCHAR(128) NOT NULL,
    email           VARCHAR(128) UNIQUE,
    active          BOOLEAN DEFAULT TRUE,
    signature       VARCHAR(50)
);


CREATE TABLE groups (
    id              SERIAL PRIMARY KEY UNIQUE,
    name            VARCHAR(128) UNIQUE,
    creation_date   DATE,
    description     TEXT
);

CREATE TABLE group_perms (
    group_id        INT NOT NULL REFERENCES(groups.id),
    user_id         INT NOT NULL REFERENCES(users.id),
    perms           CHAR(3)
);
