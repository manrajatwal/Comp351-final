const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8888;
const app = express();
const endPointRoot = "/API/v1";
const error = {
    database: "Database error!"
}

const connection = mysql.createConnection({
    host: "localhost",
    user: "iamharry_iamharry",
    password: "yodog007",
    database: "iamharry_finalQuoteDB"
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 
    'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.put(endPointRoot + "/quotes/:id", (req, res) => {
    let body = "";
    
    req.on('data', function (chunk) {
        if (chunk != null) {
            body += chunk;
            console.log(body);
        }
    });
    
    req.on('end', function() {
        let q = `update quotes set quote = "${JSON.parse(body).quote}" where quoteid = ${req.params.id}`
        connection.query(q,
            (err, results) => {
            if (err) { 
                throw err;
            };
            console.log(result);
        });
        res.end(body);
    });
});

app.post(endPointRoot + "/quote/:quote", (req, res) => {
    console.log("Adding Quote to db: " + req.params.quote);
    connection.query("INSERT INTO quotes (quote) VALUES (" + req.params.quote + ")", (err, result) => {
         if (err) {
             console.log(error.database);
             res.send(error.database);
         } else {
             res.status(200).send(result);
         }
     });
});

app.get(endPointRoot + "/quotes/:id", (req, res) => {
    connection.query("SELECT * FROM quotes where quoteid = "
     + req.params.id, (err, result) => {
         if (err) {
             console.log(error.database);
             res.send(error.database);
         } else {
             res.status(200).send(result);
         }
     });
});

app.get(endPointRoot + "/quotes/", (req, res) => {
    connection.query("SELECT * FROM quotes", (err, result) => {
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.listen()
