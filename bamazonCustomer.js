const mysql = require("mysql");
const inquirer = require("inquirer");
const color = require("colors");
const Table = require('cli-table2');

// instantiate
var table = new Table({
    head: ['Id', 'Name', 'Department', 'Price', 'Stock Quantity'],
    colWidths: [5, 20, 20, 10, 10]
});

// table is an Array, so you can `push`, `unshift`, `splice` and friends



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
        if (err) {
            console.log(err);
        }
        for (let i = 0; i < result.length; i++) {
            table.push(
                [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]
            );

            console.log(table.toString());
            // console.log("Item:".red + result[i].item_id + " " + result[i].product_name.blue + " Price:".green + result[i].price);
        }
        promptUser(result);
    })
});

function promptUser(data) {
    inquirer.prompt([{
            type: "input",
            name: "item_id",
            message: "Which item number would you like?",
        },
        {
            type: "input",
            name: "numberItems",
            message: "How many units would you like?"
        }
    ]).then(function(answer) {
        con.query("SELECT product_name,department_name,price,stock_quantity FROM products WHERE ?", { item_id: answer.item_id },
            function(err, res) {
                if (err) {
                    console.log(err);
                }
                if (res[0].stock_quantity >= answer.numberItems) {
                    let updatedQuantity = res[0].stock_quantity - answer.numberItems;
                    con.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: updatedQuantity
                    }, {
                        item_id: answer.item_id
                    }], function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    let cost = res[0].price * answer.numberItems;
                    console.log("Order Filled, Your Cost is: " + cost);
                    con.end();

                    // promptUser();
                } else {
                    console.log("Not enough inventory to fill your order!");
                    con.end();
                    // promptUser();
                }
            }
        );

    });
}