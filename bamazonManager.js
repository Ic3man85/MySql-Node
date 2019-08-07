const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table2');
const color = require('colors');

let table = new Table({
    head: ['Id', 'Name', 'Department', 'Price', 'Stock Quantity'],
    colWidths: [5, 20, 20, 10, 10]
});


let con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "password",
    database: "bamazon"
});

con.connect(function(err) {
    if (err) {
        console.log(err);
    }
    inquirer.prompt([{
        name: "request",
        type: "input",
        message: "1-Products For Sale\n2-Low Inventory\n3-Add Inventory\n4-Add New Product\nChoose which option?"
            // choices: ["1-Products For Sale", "2-Low Inventory", "3-Add Inventory", "4-Add New Product"]
    }]).then(function(answer) {

        let stuff = parseInt(answer.request);
        if (stuff > 0 && stuff <= 4) {
            switch (stuff) {
                case 1:
                    forSale();
                    break;
                case 2:
                    lowInventory();
                    break;
                case 3:
                    addInventory();
                    break;
                case 4:
                    addNewProduct();
                    break;
                default:
                    break;
            }
        }
    });
});

function forSale() {
    con.query("SELECT * FROM products", function(err, result) {
        if (err) {
            console.log(err);
        }
        for (let i = 0; i < result.length; i++) {
            table.push(
                [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]
            );
        }
        console.log(table.toString());
        con.end();
    });
};

function lowInventory() {
    con.query("SELECT * FROM products WHERE stock_quantity <= '5'", function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            table.push(

                [result[i].item_id, result[i].product_name, result[i].department_name, result[i].price, result[i].stock_quantity]
            );
        }
        console.log(table.toString());

        con.end();
    });
}

function addInventory() {
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "Choose which item you would like to add inventory:"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to add?"

        }
    ]).then(function(answer) {
        con.query("SELECT * FROM products WHERE ?", { item_id: answer.ID }, function(err, result) {
            if (err) throw err;
            table.push(
                [result[0].item_id, result[0].product_name, result[0].department_name, result[0].price, result[0].stock_quantity]
            );
            console.log(table.toString());
            con.query("UPDATE products SET stock_quantity = stock_quantity +" + answer.quantity + " WHERE item_id = " + answer.ID,
                function(err, res) {
                    if (err) throw err;
                    let newTotal = parseInt(result[0].stock_quantity) + parseInt(answer.quantity);
                    console.log("Inventory Succesfully added!!, Your New Quantity is: " + newTotal);
                    con.end();
                });
        });
    });
}

function addNewProduct() {
    inquirer.prompt([{
            name: "name",
            type: "input",
            message: "What is the name of the item?"
        },
        {
            name: "department",
            type: "input",
            message: "What department does your item belong too?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the price of the item?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many of you item?"
        }
    ]).then(function(answer) {
        console.log(answer);
        const { name, department, price, quantity } = answer;
        const parsedQuantity = parseInt(quantity);
        const parsedPrice = parseFloat(price);
        const query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";
        con.query(query, [name, department, parsedPrice, parsedQuantity], (err, res) => {
            if (err) throw err;
            console.log("Item Added To Inventory!!");
            con.end();
        });

    });
}