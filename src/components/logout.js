import * as React from 'react'
//import { useForm } from "react-hook-form"
//import { isLoggedIn } from "../services/auth"
import { logout } from "../services/auth"


const LogoutPage = () => {

  console.log("logout")
  logout()

  return (
    <>
    </>
  )
}

export default LogoutPage

