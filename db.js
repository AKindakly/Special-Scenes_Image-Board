require("dotenv").config();
const spicedPg = require("spiced-pg");
const DATABASE_URL = process.env.DATABASE_URL;

const db = spicedPg(DATABASE_URL);

module.exports.getAllData = function () {
    const sql = "SELECT * FROM images ORDER BY created_at DESC;";
    return db
        .query(sql)
        .then((result) => {
            return result.rows;
        })
        .catch((error) => {
            console.log("error getting data", error);
        });
};

module.exports.insertImage = function (url, username, title, description) {
    const sql = `
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    return db
        .query(sql, [url, username, title, description])
        .then((result) => result.rows)
        .catch((error) =>
            console.log("error inserting Image to database", error)
        );
};

module.exports.getImagebyId = (id) => {
    const sql = `SELECT * FROM images WHERE id = $1;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("error getting one Image", error));
};

module.exports.getCommentbyId = (image_id) => {
    const sql = `SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC;`;
    return db
        .query(sql, [image_id])
        .then((result) => result.rows)
        .catch((error) => console.log("error getting one Image", error));
};

module.exports.insertComment = function (comment, username, image_id) {
    const sql = `
        INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    return db
        .query(sql, [comment, username, image_id])
        .then((result) => result.rows)
        .catch((error) =>
            console.log("error inserting comment to database", error)
        );
};

module.exports.getMoreImages = (id) => {
    const sql = `
        SELECT *, (
            SELECT id FROM images
            LIMIT 1
        ) AS "lowestId"
        FROM images
        WHERE id < 112
        LIMIT 9;
    `;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) =>
            console.log("error inserting comment to database", error)
        );
};
