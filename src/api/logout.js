// npm install jsonwebtoken
import * as jwt from "jsonwebtoken"

export default function handler(req,res) {
    console.log(`logout`, req.body)
    res.clearCookie("token")
    res.clearCookie("csrf_token")
    res.json(`logout`)
}

