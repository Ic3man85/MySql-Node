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
    con.query("SELECT * FROM products", function(err, result, fields) {
        if (err) throw err;
        // console.log(result[2].item_id);
        for (let i = 0; i < result.length; i++) {
            console.log("Item:" + result[i].item_id + " " + result[i].product_name + " Price:" + result[i].price);
        }
        promptUser();
        con.end();
    })
});

function promptUser() {
    inquirer.prompt([{
            type: "input",
            name: "item",
            message: "Choose an item number!"
        },
        {
            type: "input",
            name: "numberItems",
            message: "How many would you like?"

        }
    ]).then(function(result) {
        console.log(result);
    });
}