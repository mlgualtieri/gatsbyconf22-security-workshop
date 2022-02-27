
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


export async function doQuery(conn, query, params) {
    const mysql = require('mysql2/promise');
    let [rows, fields] = await conn.execute(query, params)
    return rows
}



/*
export async function doQuery(query) {
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

    //let [rows, fields] = await conn.execute('select ?+? as sum', [2, 2]);
    let [rows, fields] = await conn.execute(query)
    console.log(rows)
    return rows
}
*/





/*
export async function doQuery(con, q) {

    con.query(query, await function (err, result) {
        if (err) {
            console.log(err)
        }
        console.log("AWAIT")
        console.log(result)
	    return result
    });
}
*/

