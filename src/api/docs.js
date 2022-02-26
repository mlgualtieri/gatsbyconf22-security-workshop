// npm install jsonwebtoken
// npm install aws-sdk
import * as jwt from "jsonwebtoken"

export default function handler(req,res) {
    console.log(`docs api req`, req.body)

    // NEED: Do auth here

	var AWS = require("aws-sdk");
    const fs = require('fs');

	// Log in to AWS
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



    // RDS IAM signer
	var signer = new AWS.RDS.Signer({
	  // configure options
	  region: `${process.env.AWS_RDS_REGION}`,
	  username: 'default',
	  hostname: `${process.env.AWS_RDS_HOST}`,
	  port: 3306
	});
	signer.getAuthToken({
	  username: `${process.env.AWS_RDS_IAM_USER}` // overriding username
	}, function(err, token) {
	  if (err) {
	    // handle error
		console.log(err)
	  } else {
	    // use token
		console.log(token)


        // RDS connect
	    var mysql = require('mysql2');
	    var connection = mysql.createConnection({
	      host     : `${process.env.AWS_RDS_HOST}`,
	      port     : 3306,
          ssl      : 'Amazon RDS',
          user     : `${process.env.AWS_RDS_IAM_USER}`,
          authPlugins: {
	      	mysql_clear_password: () => () =>
            	signer.getAuthToken({
	  				region: `${process.env.AWS_RDS_REGION}`,
	  				hostname: `${process.env.AWS_RDS_HOST}`,
	  				username: `${process.env.AWS_RDS_IAM_USER}`,
	  				port: 3306
            	})
          }
	    });
	    
	    connection.connect(function(err) {
	      if (err) {
	        console.error('Database connection failed: ' + err.stack);
	        return;
	      }
	    
	      console.log('Connected to database.');
	    });
	    
	    connection.end();
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

