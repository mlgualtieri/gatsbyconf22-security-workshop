// npm install aws-sdk

// To init database run:
// curl http://127.0.0.1:8000/api/mysql-init
export default async function handler(req,res) {
    console.log(`docs api req`, req.body)

    const db  = require('../services/mysql');
    let connection = await db.doConnectForInit()

	console.log('Connected to database.');

    await db.doQuery(connection, 'DROP DATABASE IF EXISTS securitydemo;')
    await db.doQuery(connection, 'CREATE DATABASE securitydemo;')

	connection.end();

	console.log('Database initialized...');


    connection = await db.doConnect()
	console.log('Connected to database.');



    await db.doQuery(connection, `
        CREATE TABLE users
        (id int(11) unsigned primary key auto_increment not null,
        username VARCHAR(64),
        fullname VARCHAR(64),
        password VARCHAR(512),
        csrf_token VARCHAR(512));
    `)

    await db.doQuery(connection, `
        CREATE TABLE documents
        (id int(11) unsigned primary key auto_increment not null,
        filename VARCHAR(64));
    `)

    await db.doQuery(connection, `
        CREATE TABLE userdocs
        (id int(11) unsigned primary key auto_increment not null,
        id_users int(11) unsigned,
        id_documents int(11) unsigned);
    `)

    const password = require('../services/password');
    var pbkdf2_hash = await password.hash("my_secret_password")
    await db.doQuery(connection, `INSERT INTO users (id,username,fullname,password) VALUES(1000,'user@test.com', 'User Test', '${pbkdf2_hash}')`)
    let users = await db.doQuery(connection, `SELECT * FROM users`)
    console.log(users)


    await db.doQuery(connection, `INSERT INTO documents (id,filename) VALUES(1,'file1.txt')`)
    await db.doQuery(connection, `INSERT INTO documents (id,filename) VALUES(2,'file2.txt')`)
    await db.doQuery(connection, `INSERT INTO documents (id,filename) VALUES(3,'file3.txt')`)
    await db.doQuery(connection, `INSERT INTO documents (id,filename) VALUES(4,'file4.txt')`)
    await db.doQuery(connection, `INSERT INTO documents (id,filename) VALUES(5,'file5.txt')`)
    let documents = await db.doQuery(connection, `SELECT * FROM documents`)
    console.log(documents)

    await db.doQuery(connection, `INSERT INTO userdocs (id_users,id_documents) VALUES(1000,1)`)
    await db.doQuery(connection, `INSERT INTO userdocs (id_users,id_documents) VALUES(1000,2)`)
    let userdocs = await db.doQuery(connection, `SELECT * FROM userdocs`)
    console.log(userdocs)

	connection.end();
    console.log("Done!")

    res.status(200).send("ok")
    return
}

