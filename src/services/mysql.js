
// Connect to AWS RDS database for init
export async function doConnectForInit() {
    const mysql = require('mysql2/promise');
    const fs = require('fs');

	var conn = await mysql.createConnection({
	  host     : `${process.env.AWS_RDS_HOST}`,
	  user     : `${process.env.AWS_RDS_ROOT}`,
	  password : `${process.env.AWS_RDS_ROOT_PASS}`,
	  port     : 3306,
      ssl: {
        ca: fs.readFileSync("./rds-ca-2019-root.pem").toString()
      }
	});

    return conn
}


// Connect to AWS RDS database
export async function doConnect() {
    const mysql = require('mysql2/promise');
    const fs = require('fs');

	var conn = await mysql.createConnection({
	  host     : `${process.env.AWS_RDS_HOST}`,
	  user     : `${process.env.AWS_RDS_ROOT}`,
	  password : `${process.env.AWS_RDS_ROOT_PASS}`,
	  port     : 3306,
      database : "securitydemo",
      ssl: {
        ca: fs.readFileSync("./rds-ca-2019-root.pem").toString()
      }
	});

    return conn
}


// Perform query on AWS RDS database
export async function doQuery(conn, query, params) {
    //console.log(query)
    //console.log(params)
    const mysql = require('mysql2/promise');
    let [rows, fields] = await conn.execute(query, params)
    return rows
}

