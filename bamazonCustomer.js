const mysql = require("mysql");
const inquirer = require("inquirer");
const color = require("colors");


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
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            console.log("Item:".red + result[i].item_id + " " + result[i].product_name.blue + " Price:".green + result[i].price);
        }
        promptUser(result);
        con.end();
    })
});

function promptUser(data) {
    inquirer.prompt([{
            type: "list",
            name: "item_id",
            message: "Which item number would you like?",
            choices: function() {
                let choicesId = [];
                for (let i = 0; i < data.length; i++) {
                    choicesId.push(data[i].item_id);
                }
                return choicesId;
            }

        },
        {
            type: "input",
            name: "numberItems",
            message: "How many units would you like?"

        }
    ]).then(function(answer) {
        checkNumUnits(answer.item_id, answer.numberItems);

    }).catch(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function checkNumUnits(selectedId, numUnits) {
    con.query("SELECT stock_quantity FROM products WHERE ? '{selectedId} = products.item_id'", function(err, res) {
        console.log(res);
        console.log(numUnits);
    })
}