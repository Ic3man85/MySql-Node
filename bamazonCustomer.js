const mysql = require("mysql");
const inquirer = require("inquirer");

let con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "password",
    database: "bamazon"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("CONNECTED!!!" + con.threadId);
    con.query("SELECT * FROM products", function(err, result) {
        let data = result.length;
        if (err) throw err;
        for (let i = 0; i < data; i++) {
            console.log("Id: " + data.products.item_id);
        }
    })
    con.end();
});