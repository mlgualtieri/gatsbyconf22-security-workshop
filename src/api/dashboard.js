//npm install jsonwebtoken
import * as jwt from "jsonwebtoken"

export default async function handler(req, res) {
  console.log(`dashboard api req`, req.body)

  // Good practice to set Access-Control-Allow-Origin header
  res.setHeader(`Access-Control-Allow-Origin`, `${process.env.ACCESS_CONTROL_ALLOW_ORIGIN}`)

  // Authenticate JWT
  let payload = {}
  try {
    const token = req.cookies.token
    console.log(`Auth token:`, token)
    const jwtKey = `${process.env.JWT_SECRET_KEY}`

    payload = jwt.verify(token, jwtKey, {
      algorithms: ["HS256", "RS256", "HS384"],
    })
    console.log("JWT payload...")
    console.log(payload)
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      // unauthorized token
      return res.status(401).end()
    }

    // bad request
    return res.status(400).end()
  }

  // Test for CSRF token before execution
  const csrf = require("../services/csrf")
  const csrf_check = await csrf.checkValidCSRFToken(
    payload.userId,
    req.body.csrf_token
  )
  if (csrf_check === false) {
    // unauthorized
    return res.status(401).end()
  }

  // JWT and CSRF tokens are valid... continue execution

  // If we are here, the token is valid and we are logged in...
  try {
    // initialize vars
    let user = {}
    user.userId = 0
    user.username = ""
    user.fullname = ""
    user.docs = []

    // ensure we have valid json
    if (typeof req.body === "string") {
      req.body = JSON.parse(req.body)
    }

    // retrieve user data from database
    const db = require("../services/mysql")
    let conn = await db.doConnect()

    // get user
    let query = `SELECT * FROM users WHERE id=?`
    let dbuser = await db.doQuery(conn, query, [payload.userId])
    dbuser = dbuser[0]
    user.userId = dbuser.id
    user.username = dbuser.username
    user.fullname = dbuser.fullname

    // get user docs
    query = `SELECT * FROM userdocs as ud LEFT JOIN documents as d ON d.id=ud.id_documents WHERE ud.id_users=?`
    let docs = await db.doQuery(conn, query, [payload.userId])
    //console.log(docs)
    user.docs.push(...docs.map(({ filename }) => filename))
    // docs.forEach(doc => user.docs.push(doc.filename))

    console.log("Returning...")
    console.log(user)
    res.json(user)
  } catch (err) {
    console.log(err)
  }
}
