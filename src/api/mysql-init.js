// npm install jsonwebtoken
// npm install aws-sdk
import * as jwt from "jsonwebtoken"


export default function handler(req,res) {
    console.log(`docs api req`, req.body)

    // NEED: Do auth here

	//var AWS = require("aws-sdk");
    const fs = require('fs');
	var mysql = require('mysql2');



	var connection = mysql.createConnection({
	  host     : `${process.env.AWS_RDS_HOST}`,
	  user     : `${process.env.AWS_RDS_ROOT}`,
	  password : `${process.env.AWS_RDS_ROOT_PASS}`,
	  port     : 3306,
      ssl: {
        ca: fs.readFileSync("./rds-ca-2019-root.pem").toString()
      }
	});


	connection.connect(function(err) {
	    if (err) {
	        console.error('Database connection failed: ' + err.stack);
	        return;
	    }
	
	    console.log('Connected to database.');

        doQuery(connection, 'DROP DATABASE IF EXISTS securitydemo;')
        doQuery(connection, 'CREATE DATABASE securitydemo;')
	    connection.end();


	    connection = mysql.createConnection({
	      host     : `${process.env.AWS_RDS_HOST}`,
	      user     : `${process.env.AWS_RDS_ROOT}`,
	      password : `${process.env.AWS_RDS_ROOT_PASS}`,
	      port     : 3306,
          database : "securitydemo",
          ssl: {
            ca: fs.readFileSync("./rds-ca-2019-root.pem").toString()
          }
	    });

	    connection.connect(function(err) {
	        if (err) {
	            console.error('Database connection failed: ' + err.stack);
	            return;
	        }
	    
	        console.log('Connected to database.');

            doQuery(connection, `
                CREATE TABLE users
                (id int(11) unsigned primary key auto_increment not null,
                username VARCHAR(64),
                password VARCHAR(512),
                csrf_token VARCHAR(512));
            `)

            doQuery(connection, `
                CREATE TABLE documents
                (id int(11) unsigned primary key auto_increment not null,
                filename VARCHAR(64));
            `)

            doQuery(connection, `
                CREATE TABLE userdocs
                (id int(11) unsigned primary key auto_increment not null,
                id_users int(11) unsigned,
                id_documents int(11) unsigned);
            `)



            var password = require('../services/password');
            password.hash('my_secret_password')
            .then(pbkdf2_hash => {
                doQuery(connection, `INSERT INTO users (id,username,password) VALUES(1000,'user@test.com', '${pbkdf2_hash}')`)
                doQuery(connection, `SELECT * FROM users`)
            })


            doQuery(connection, `INSERT INTO documents (id,filename) VALUES(1,'file1.txt')`)
            doQuery(connection, `INSERT INTO documents (id,filename) VALUES(2,'file2.txt')`)
            doQuery(connection, `INSERT INTO documents (id,filename) VALUES(3,'file3.txt')`)
            doQuery(connection, `INSERT INTO documents (id,filename) VALUES(4,'file4.txt')`)
            doQuery(connection, `INSERT INTO documents (id,filename) VALUES(5,'file5.txt')`)
            doQuery(connection, `SELECT * FROM documents`)

            doQuery(connection, `INSERT INTO userdocs (id_users,id_documents) VALUES(1000,1)`)
            doQuery(connection, `INSERT INTO userdocs (id_users,id_documents) VALUES(1000,2)`)
            doQuery(connection, `SELECT * FROM userdocs`)

	        //connection.end();
	    });

	});


    res.status(200).send("ok")
    return
}





export const doQuery = (con, query) => {
  con.query(query, function (err, result) {
    if (err) {
        console.log(err)
    }
    console.log(result)
	return result
  });
}





