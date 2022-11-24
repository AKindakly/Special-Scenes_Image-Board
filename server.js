const express = require("express");
const app = express();
const { PORT = 8080 } = process.env;

require("dotenv").config();

const path = require("path");
const fs = require("fs");

const { uploader } = require("./middleware");
const db = require("./db");

app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

///////////////// AWS thing: /////////////////
const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

///////////////// routes: /////////////////
app.get("/images", (req, res) => {
    db.getAllData()
        .then((data) => {
            // console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log("ERROR in getAllData: ", err);
        });
});

app.post("/images", uploader.single("file"), (req, res) => {
    if (req.file) {
        const { filename, mimetype, size, path } = req.file;

        const promise = s3
            .putObject({
                Bucket: "spicedling",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise();

        promise
            .then(() => {
                // console.log("success");
                fs.unlinkSync(req.file.path);
                const { username, title, description } = req.body;
                let url = `https://s3.amazonaws.com/spicedling/${filename}`;

                db.insertImage(url, username, title, description).then(
                    (data) => {
                        console.log("new data:", data);
                        res.json({
                            success: true,
                            message: "Thank you!",
                            id: data[0].id,
                            title,
                            url,
                            username,
                            description,
                        });
                    }
                );
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        res.json({
            success: false,
            message: "Upload failed!",
        });
    }
});

app.get("/images/:id", (req, res) => {
    const id = req.params.id;
    // console.log("params id is: ", req.params.id);
    db.getImagebyId(id)
        .then((data) => {
            // console.log(data[0]);
            res.json(data[0]);
        })
        .catch((err) => {
            console.log("ERROR in getImagebyId: ", err);
        });
});

////////////////////////////////////////////////////
app.get("/images/comments/:id", (req, res) => {
    const id = req.params.id;
    // console.log("params id is: ", req.params.id);
    db.getCommentbyId(id)
        .then((data) => {
            // console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log("ERROR in geting comment: ", err);
        });
});

app.post("/images/comments", (req, res) => {
    const { comment, username, imageId } = req.body;
    db.insertComment(comment, username, imageId)
        .then((data) => {
            console.log("comment data in post: ", data);
            res.json({ id: data[0].id, comment, username, imageId });
        })
        .catch((err) => {
            console.log("ERROR in insertComment: ", err);
        });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

///////////////// server running: /////////////////
app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
