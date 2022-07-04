const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("article", articleSchema);

app.get("/articles", function (req, res) {
    Article.find(function (err, foundItems) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(foundItems);
        }
    })
});

app.post("/articles", function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    // console.log(newArticle);
    newArticle.save(function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("Successfully added a new article");
        }
    });
});

app.delete("/articles", function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Successfully deleted all the articles");
        }
        else {
            res.send(err);
        }
    });
});
////Request Targeting A specific article/////
app.route("/articles/:articleTitle")
    .get(function (req, res) {
        const articleTitle = req.params.articleTitle;
        console.log(articleTitle);
        Article.findOne({ title: articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            }
            else {
                res.send("No article of this name found");
            }
        });
    })

    .put(function (req, res) {
        Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send('Successfully put article.');
                }
            });
    })

    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send('Successfully patch article.');
                }
            });
    })

    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send('Successfully deleted the corresponding article.');
                }
            });
    });


app.listen(3000, function () {
    console.log("Server started on port 3000");
});