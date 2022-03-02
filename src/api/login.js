// npm install jsonwebtoken
import * as jwt from "jsonwebtoken"

const crypto = require("crypto")

export default async function handler(req, res) {
  console.log(`login form`, req.body)
  try {
    // JWT valid for 10 mins (600 seconds)
    const jwtExpirySeconds = 60 * 10
    const jwtKey = `${process.env.JWT_SECRET_KEY}`

    // Initialize vars
    let userId = 0
    let username = ""
    let isLoggedIn = ""
    let loginResponse = {}

    // Log in to database and check credentials

    const db = require("../services/mysql")
    let conn = await db.doConnect()

    ////////////
    // Proper way to check authentication
    // Comment this code block to try the SQL injection below
    const query = `SELECT * FROM users WHERE username=?`
    let user
    try {
      const userFound = await db.doQuery(conn, query, [req.body.username])
      user = userFound && userFound[0]
    } catch (error) {
      throw new Error(`user cannot be found: ` + error.message)
    }
    console.log(user)

    // Check if valid login
    const password = require("../services/password")

    let loginResult
    try {
      loginResult = await password.same(req.body.password, user.password)
    } catch (error) {
      const loginResponse = {}
      loginResponse.error = 1
      loginResponse.msg = "user not found"

      return res.json(loginResponse)
    }
    ////////////

    /*
            ////////////
            // Bad authentication with SQL injection
            // Comment the above codeblock and uncomment this to try the SQL injection
            let login_result = false
            var password = require('../services/password');
            var password_hash = await password.hash(req.body.password)

            var query = `SELECT * FROM users WHERE username='${req.body.username}' AND password='${password_hash}'`
            console.log(query)
            let user  = await db.doQuery(conn, query)
            user = user[0]
            console.log(user)

            if(user !== false) {
                login_result = true
            }
            ////////////
            */

    if (loginResult === true) {
      console.log("Good login")

      // Create and set CSRF token for our user
      const csrf_token = crypto.randomBytes(64).toString("base64")
      console.log(`CSRF token: ${csrf_token}`)
      //query = `UPDATE users SET csrf_token='${csrf_token}' WHERE username='${req.body.username}'`
      //query = `UPDATE users SET csrf_token=? WHERE username=?`
      //await db.doQuery(conn, query, [csrf_token, req.body.username])
      const query = `UPDATE users SET csrf_token=? WHERE id=?`
      await db.doQuery(conn, query, [csrf_token, user.id])

      // Complete the login process
      userId = user.id
      username = user.username
      isLoggedIn = 1

      // Log in by creating a JWT
      const token = jwt.sign(
        {
          userId: userId,
          username: username,
        },
        jwtKey,
        {
          algorithm: "HS256",
          expiresIn: jwtExpirySeconds,
        }
      )

      console.log(`token: ${token}`)

      // set cookie expiration and security headers
      res.cookie("token", token, {
        secure: true,
        sameSite: "none",
        maxAge: 1000 * jwtExpirySeconds,
      })
      res.cookie("csrf_token", csrf_token, {
        secure: true,
        sameSite: "none",
        maxAge: 1000 * jwtExpirySeconds,
      })

      loginResponse.error = 0
      loginResponse.userId = userId
      loginResponse.msg = `Login OK - You are logged in as: ${userId} ${username}`
    } else {
      loginResponse.error = 1
      loginResponse.msg = "Invalid login"
      res.clearCookie("token")
      res.clearCookie("csrf_token")
    }

    // send response
    console.log(loginResponse.msg)
    res.json(loginResponse)
  } catch (err) {
    console.log(err)
  }
}

// OLD2
/*
            // Log in to database and check credentials
            const fs = require('fs');
	        var mysql = require('mysql2');


	        var connection = mysql.createConnection({
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

                var query = `SELECT * FROM users WHERE username='${req.body.username}'`
                connection.query(query, function (err, user) {
                    if (err) {
                      console.log(err)
                    }
                    user = user[0]
                    console.log(user)


                    // Check if valid login
                    var password = require('../services/password');
                    password.same(req.body.password, user.password)
                    .then(login_result => {

                        if(login_result === true) {
                            console.log("Good login")

                            // Create and set CSRF token for our user
                            var csrf_token = crypto.randomBytes(64).toString('base64')
	                        console.log(`CSRF token: ${csrf_token}`)
                            query = `UPDATE users SET csrf_token='${csrf_token}' WHERE username='${req.body.username}'`
                            connection.query(query, function (err, result) {
                                if (err) {
                                  console.log(err)
                                }

                                // Complete the login process
                                userId     = user.id
                                username    = user.username
                                isLoggedIn = 1

                                // Log in by creating a JWT
		                        const token = jwt.sign(
		                        	{ 
                                        userId:  userId, 
                                        username: username,
                                    },
                                    jwtKey, 
                                    { 
                                        algorithm: "HS256",
                                        expiresIn: jwtExpirySeconds,
                                    }
    	                        )

	                            console.log(`token: ${token}`)

                                // set cookie expiration and security headers
                                res.cookie("token", token, { 
                                    secure: true, 
                                    sameSite: 'none', 
                                    maxAge: 1000 * jwtExpirySeconds })
                                res.cookie("csrf_token", csrf_token, { 
                                    secure: true, 
                                    sameSite: 'none', 
                                    maxAge: 1000 * jwtExpirySeconds })

                                loginResponse.error    = 0
                                loginResponse.userId  = userId
                                loginResponse.msg      = `Login OK - You are logged in as: ${userId} ${username}`

                                // send response
                                console.log(loginResponse.msg)
                                res.json(loginResponse)
                            })
                        }
                        else {
                            loginResponse.error = 1
                            loginResponse.msg   = "Invalid login"
                            res.clearCookie("token")
                            res.clearCookie("csrf_token")

                            // send response
                            console.log(loginResponse.msg)
                            res.json(loginResponse)
                        }
                    })
                })
	        })

*/

// old
/*
            // NEED
            // Hardcoding default user login for now
            // Replace this with database driven calls
            if( (req.body.username == "user@test.com") && 
                (req.body.password == "my_secret_password"))
                {
                    userId     = 1000
                    username    = "user@test.com"
                    isLoggedIn = 1
                }

            else if( (req.body.username == "admin@test.com") && 
                (req.body.password == "super_secret_password"))
                {
                    userId     = 1
                    username    = "admin@test.com"
                    isLoggedIn = 1
                }



            // Check if valid login
            if(isLoggedIn == 1)
            {
                // Log in by creating a JWT
		        const token = jwt.sign(
		        	{ 
                        userId:  userId, 
                        username: username,
                        //isLoggedIn: 1
                    },
                    jwtKey, 
                    { 
                        algorithm: "HS256",
                        expiresIn: jwtExpirySeconds,
                    }
    	        )

	            console.log(`token: ${token}`)

                // set cookies valid for 4 hours
                // set cookie security headers
                res.cookie("token", token, { 
                    secure: true, 
                    sameSite: 'none', 
                    maxAge: 1000 * jwtExpirySeconds })
                res.cookie("csrf_token", "abc-123-random-stuff-here", { 
                    secure: true, 
                    sameSite: 'none', 
                    maxAge: 1000 * jwtExpirySeconds })

                loginResponse.error    = 0
                loginResponse.userId  = userId
                loginResponse.msg      = `Login OK - You are logged in as: ${userId} ${username}`
            }
            else
            {
                loginResponse.error = 1
                loginResponse.msg   = "Invalid login"
                res.clearCookie("token")
            }

            console.log(loginResponse.msg)
            res.json(loginResponse)
*/
