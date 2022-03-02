// Check for valid CSRF token attached to user
export async function checkValidCSRFToken(userId, csrf_token) {
  const db = require("../services/mysql")
  const conn = await db.doConnect()

  const query = `SELECT * FROM users WHERE id=?`
  let user = await db.doQuery(conn, query, [userId])
  user = user[0]
  conn.end()

  if (user.csrf_token == csrf_token) {
    console.log("CSRF token valid...")
    return true
  }

  console.log("CSRF token not valid...")
  return false
}
