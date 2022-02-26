// npm install jsonwebtoken
import * as jwt from "jsonwebtoken"

export default function handler(req,res) {
    console.log(`login form`, req.body)

	try 
        {
            // JWT valid for 4 hours (14400 seconds)
            //const jwtExpirySeconds = 60*60*4
            // 10 mins
            const jwtExpirySeconds = 60*10
            //const jwtKey = "my_jwt_signing_key"
            const jwtKey = `${process.env.JWT_SECRET_KEY}`

            // Initialize vars
            let user_id     = 0
            let username    = ""
            let is_loggedin = ""
            let login_response = {}


            // NEED
            // Hardcoding default user login for now
            // Replace this with database driven calls
            if( (req.body.username == "user@test.com") && 
                (req.body.password == "my_secret_password"))
                {
                    user_id     = 1000
                    username    = "user@test.com"
                    is_loggedin = 1
                }
            else if( (req.body.username == "admin@test.com") && 
                (req.body.password == "super_secret_password"))
                {
                    user_id     = 1
                    username    = "admin@test.com"
                    is_loggedin = 1
                }


            // Check if valid login
            if(is_loggedin == 1)
            {
                // Log in by creating a JWT
		        const token = jwt.sign(
		        	{ 
                        user_id:  user_id, 
                        username: username,
                        //is_loggedin: 1
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

                login_response.error    = 0
                login_response.user_id  = user_id
                login_response.msg      = `Login OK - You are logged in as: ${user_id} ${username}`
            }
            else
            {
                login_response.error = 1
                login_response.msg   = "Invalid login"
                res.clearCookie("token")
            }

            console.log(login_response.msg)
            res.json(login_response)

  	    } 
    catch (err) 
        {
    	    console.log(err);
  	    }
}

