﻿-- The main database spec for bitr

-- MAIN TABLES

CREATE TABLE users (
    id              SERIAL PRIMARY KEY UNIQUE,
    username        VARCHAR(128) UNIQUE NOT NULL,
    fullname        VARCHAR(128),
    last_login      TIMESTAMP DEFAULT current_timestamp,
    creation_date   DATE DEFAULT current_date,
    location        VARCHAR(128),
    password        CHAR(32) NOT NULL,      -- MD5 PASSWORD
    salt            CHAR(32) NOT NULL,      -- PASSWORD SALT (MD5)
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

-- references users.id
CREATE TABLE posts (
    id              SERIAL PRIMARY KEY UNIQUE,
    user_id         INT NOT NULL REFERENCES users(id),
    response_to     INT REFERENCES posts(id) DEFAULT -1,
    creation_date   TIMESTAMP DEFAULT current_timestamp,
    tags            TEXT,
    content         VARCHAR(200),
    private         BOOLEAN
);

CREATE TYPE media_type AS ENUM ('photo','video');
CREATE TABLE media_posts (
    type            media_type,
    filename        VARCHAR(256)
) INHERITS (posts);

-- RELATIONS

-- references users.id groups.id
CREATE TABLE user_to_group (
    group_id        INT NOT NULL REFERENCES groups(id),
    user_id         INT NOT NULL REFERENCES users(id),
    perms           CHAR(3)
);

-- references users.id
CREATE TABLE friends (
    user_id         INT NOT NULL REFERENCES users(id),
    friend_id       INT NOT NULL REFERENCES users(id),
    perms           CHAR(3),
    creation_date   TIMESTAMP DEFAULT current_timestamp
);
