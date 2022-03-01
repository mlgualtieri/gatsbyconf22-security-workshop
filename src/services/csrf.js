
// Check for valid CSRF token attached to user
export async function checkValidCSRFToken(user_id, csrf_token) {
    const db  = require('../services/mysql');
    const conn = await db.doConnect()

    const query = `SELECT * FROM users WHERE id=?`
    let user  = await db.doQuery(conn, query, [user_id])
    user = user[0]
	conn.end();

    if(user.csrf_token == csrf_token) {
        console.log("CSRF token valid...")
        return true
    }

    console.log("CSRF token not valid...")
    return false
}


