// npm install jsonwebtoken
// npm install aws-sdk
import * as jwt from "jsonwebtoken"

export default async function handler(req,res) {
    console.log(`docs api req`, req.body)

    // Good practice to set Access-Control-Allow-Origin header
    res.setHeader(`Access-Control-Allow-Origin`, `https://127.0.0.1:8000`);


    /*
    // Uncomment to fix broken authentication
    // Authenticate JWT
    let payload = {}
	try {
        const token = req.cookies.token
        console.log(`Auth token:`, token)
        const jwtKey = `${process.env.JWT_SECRET_KEY}`

	    payload = jwt.verify(token, jwtKey, { algorithms: ["HS256", "RS256", "HS384"] })
        console.log("JWT payload...")
        console.log(payload)
	} 
    catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            // unauthorized token
			return res.status(401).end()
		}

		// bad request
		return res.status(400).end()
	}

    // Test for CSRF token before execution
    const csrf = require('../services/csrf');
    const csrf_check = await csrf.checkValidCSRFToken(payload.userId, req.query.csrf_token)
    if(csrf_check === false) {
        // unauthorized
		return res.status(401).end()
    }
    */


    // JWT and CSRF tokens are valid... continue execution


    /*
    // Ensure that user is allowed to retrieve the file to stop IDOR
    const db = require("../services/mysql")
    let conn = await db.doConnect()

    let query = `SELECT * FROM userdocs as ud LEFT JOIN documents as d ON d.id=ud.id_documents WHERE ud.id_users=?`
    let docs = await db.doQuery(conn, query, [payload.userId])
    let _docs = []
    _docs.push(...docs.map(({ filename }) => filename))
    let doc_check = _docs.includes(req.query.file)
    if(doc_check === false) {
        // unauthorized
		return res.status(401).end()
    }
    */



    // Retrieve doc from AWS S3 bucket

	// Log in to AWS
	var AWS = require("aws-sdk");
    const fs = require('fs');

	AWS.config.update({
	  region: `${process.env.AWS_RDS_REGION}`,
	  accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
	  secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
	});
	AWS.config.getCredentials(function(err) {
	  if (err) {
	  		// credentials not loaded
			console.log(err.stack);
		}
	  else {
		console.log("AWS credentials loaded...")
	    //console.log("Access key:", AWS.config.credentials.accessKeyId);
	  }
	});


	// Get file on S3
	// https://gatsbyconf22-security-demo.s3.us-east-2.amazonaws.com/file1.txt
	let s3 = new AWS.S3({apiVersion: '2006-03-01'});
	var params = {
	    Bucket: `${process.env.AWS_S3_BUCKET}`,
	    Key: `${req.query.file}`
	    };
	s3.getObject(params, function(err, data) {
	  if (err) {
			console.log(err, err.stack) // an error occurred
			res.status(404).send("")
	  }
	  else {
			console.log(data)           // successful response

			// Send file
			res.setHeader('Content-Type', data.ContentType);
			res.setHeader('Content-Length', data.ContentLength);
			res.setHeader('Content-Disposition', `'attachment; filename="${req.query.file}"'`);
			res.status(200).send(data.Body)

		}     
	});

}

