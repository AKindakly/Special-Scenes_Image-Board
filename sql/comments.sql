DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment TEXT,
    username VARCHAR NOT NULL,
    image_id INT NOT NULL REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);