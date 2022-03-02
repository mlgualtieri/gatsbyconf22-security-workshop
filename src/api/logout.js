// npm install jsonwebtoken
import * as jwt from "jsonwebtoken"

export default async function handler(req, res) {
  console.log(`logout`, req.body)

  // Good practice to set Access-Control-Allow-Origin header
  res.setHeader(`Access-Control-Allow-Origin`, `https://127.0.0.1:8000`)

  // Save copies of client-side cookies
  let token = req.cookies.token
  let csrf_token = req.cookies.csrf_token

  // Remove client-side cookies to log out client-side
  res.clearCookie("token")
  res.clearCookie("csrf_token")

  // Next logout server-side (if authenticated)

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
    req.cookies.csrf_token
  )
  if (csrf_check === false) {
    // unauthorized
    return res.status(401).end()
  }

  // Remove CSRF token from database to invalidate the server-side authentication
  const db = require("../services/mysql")
  let conn = await db.doConnect()
  let query = `UPDATE users SET csrf_token=? WHERE id=?`
  await db.doQuery(conn, query, [req.cookies.csrf_token, payload.userId])

  res.json(`logout`)
}
