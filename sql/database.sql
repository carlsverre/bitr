-- The main database spec for bitr

-- MAIN TABLES

CREATE TABLE users (
    id              SERIAL PRIMARY KEY UNIQUE,
    username        VARCHAR(128) UNIQUE NOT NULL,
    fullname        VARCHAR(128),
    last_login      TIMESTAMP DEFAULT current_timestamp,
    creation_date   TIMESTAMP DEFAULT current_timestamp,
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
    owner           INT NOT NULL REFERENCES users(id),
    creation_date   TIMESTAMP DEFAULT current_timestamp,
    description     TEXT
);

-- references users.id
CREATE TABLE posts (
    id              SERIAL PRIMARY KEY UNIQUE,
    user_id         INT NOT NULL REFERENCES users(id),
    response_to     INT REFERENCES posts(id),
    creation_date   TIMESTAMP DEFAULT current_timestamp,
    tags            TEXT,
    content         VARCHAR(200),
    private         BOOLEAN,
    mediatype       VARCHAR(3) CHECK(mediatype in ('r--', '-r-', '--r')),
    filename        VARCHAR(256),
    index_col       tsvector
);

-- SEARCH INDEX FOR POSTS (and trigger)
CREATE INDEX posts_idx ON posts USING gin(index_col);
CREATE FUNCTION posts_trigger() RETURNS trigger AS $$
begin
  new.index_col :=
    setweight(to_tsvector('pg_catalog.english', coalesce(new.tags,'')),     'A') ||
    setweight(to_tsvector('pg_catalog.english', coalesce(new.content,'')),  'B') ||
    setweight(to_tsvector('pg_catalog.english', coalesce(new.filename,'')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_index_col_update BEFORE INSERT OR UPDATE
ON posts FOR EACH ROW EXECUTE PROCEDURE posts_trigger();

CREATE TABLE sessions (
    session_id      VARCHAR(16),
    session         TEXT
);

-- RELATIONS

-- references users.id groups.id
CREATE TABLE user_to_group (
    id              SERIAL PRIMARY KEY UNIQUE,
    group_id        INT NOT NULL REFERENCES groups(id),
    user_id         INT NOT NULL REFERENCES users(id),
    perms           CHAR(3)
);

-- references users.id
CREATE TABLE friends (
    id              SERIAL PRIMARY KEY UNIQUE,
    user_id         INT NOT NULL REFERENCES users(id),
    friend_id       INT NOT NULL REFERENCES users(id),
    perms           CHAR(3),
    creation_date   TIMESTAMP DEFAULT current_timestamp
);
