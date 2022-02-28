//npm install jsonwebtoken
import * as jwt from "jsonwebtoken"

export default async function handler(req, res) {
    console.log(`dashboard api req`, req.body)

    // Good practice to set Access-Control-Allow-Origin header
    res.setHeader(`Access-Control-Allow-Origin`, `https://127.0.0.1:8000`);


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
    const csrf_check = await checkValidCSRFToken(payload.user_id, req.cookies.csrf_token)
    if(csrf_check === false)
    {
        // unauthorized
		return res.status(401).end()
    }

    // JWT and CSRF tokens are valid... continue execution


    // If we are here, the token is valid and we are logged in... but there's a flaw in our logic

    try {
        let user = {}
        user.user_id    = 0
        user.username   = ""
        user.fullname   = ""

        // ensure we have valid json
        if (typeof req.body === 'string') {
            req.body = JSON.parse(req.body)
        }
        
        // Instead of using a database, return static data
        if(payload.user_id == 1000)
        {
            user.user_id    = 1000
            user.username   = "user@test.com"
            user.fullname   = "User Test"
            user.docs       = ['file1.txt','file2.txt']
        }

        console.log("Returning...")
        console.log(user)
        res.json(user)
  	} 
    catch (err) {
        console.log(err);
  	}

}


// Check for valid CSRF token attached to user
async function checkValidCSRFToken(user_id, csrf_token) {
    const db  = require('../services/mysql');
    const conn = await db.doConnect()

    const query = `SELECT * FROM users WHERE id=?`
    const user  = await db.doQuery(conn, query, [user_id])
    user = user[0]
	conn.end();

return true
    if(user.csrf_token == csrf_token) {
        console.log("CSRF token valid...")
        return true
    }

    console.log("CSRF token not valid...")
    return false
}

