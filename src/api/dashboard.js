//npm install jsonwebtoken
import * as jwt from "jsonwebtoken"

export default function handler(req,res) {
    console.log(`dashboard api req`, req.body)

    // Good practice to set Access-Control-Allow-Origin header
    res.setHeader(`Access-Control-Allow-Origin`, `https://127.0.0.1:8000`);


    // Test for CSRF token before execution
    //if(!checkValidCSRFToken(req.body.csrf_token))
    if(!checkValidCSRFToken(req.cookies.csrf_token))
    {
        // unauthorized
		return res.status(401).end()
    }

    let payload = {}

	try 
        {
            const token = req.cookies.token
            console.log(`Auth token:`, token)
            const jwtKey = `${process.env.JWT_SECRET_KEY}`

		    payload = jwt.verify(token, jwtKey, { algorithms: ["HS256", "RS256", "HS384"] })
            console.log("JWT payload...")
            console.log(payload)
	    } 
    catch (err) 
        {
		    if (err instanceof jwt.JsonWebTokenError) 
            {
                // unauthorized token
			    return res.status(401).end()
		    }

		    // bad request
		    return res.status(400).end()
	    }



    // If we are here, the token is valid and we are logged in... but there's a flaw in our logic

    try
        {
            let user = {}
            user.user_id    = 0
            user.username   = ""
            user.fullname   = ""

            // ensure we have valid json
            if (typeof req.body === 'string') {
                req.body = JSON.parse(req.body)
            }
            
            // Instead of using a database, return static data
            //if(req.body.user_id == 1000)
            if(payload.user_id == 1000)
            {
                user.user_id    = 1000
                user.username   = "user@test.com"
                user.fullname   = "User Test"
                user.docs       = ['file1.txt','file2.txt']
            }
            else if(req.body.user_id == 1001)
            {
                user.user_id    = 1001
                user.username   = "user2@test.com"
                user.fullname   = "Some Other User"
            }
            else if(req.body.user_id == 1)
            {
                user.user_id    = 1
                user.username   = "admin@test.com"
                user.fullname   = "Admin User"
            }

            console.log("Returning...")
            console.log(user)
            res.json(user)
  	    } 
    catch (err) 
        {
    	    console.log(err);
  	    }

}


// Hardcode a valid CSRF token
// In the real world, the CSRF token should be generated randomly 
// during user login and registered in a database
function checkValidCSRFToken(csrf_token) {
    return true
    /*
    console.log(`CSRF Token:`, csrf_token)
    if(csrf_token == "abc-123-random-stuff-here") {
        console.log(`CSRF Token valid!`)
        return true
    }
    return false
    */
}

