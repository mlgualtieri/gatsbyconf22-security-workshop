// npm install universal-cookie
import Cookies from "universal-cookie"
import { navigate } from "gatsby"

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : {}

export const handleLogin = async data => {
  await fetch(`/api/login`, {
    method: `POST`,
    body: JSON.stringify(data),
    headers: {
      "content-type": `application/json`,
    },
  })
    .then(res => res.json())
    .then(body => {
      console.log(`response from API:`, body)

      if (body.error === 1) {
        throw new Error(body.msg)
      } else {
        // Put our CSRF token into local storage
        // This is the value we will trust, and no longer use the cookie
        const cookies = new Cookies()
        window.localStorage.setItem("csrf_token", cookies.get("csrf_token"))

        // redirect to dashboard
        navigate(`/app/dashboard`)
      }
    })
    .catch(error => {
      throw new Error(error.message)
    })
    .then(res => res.json())
    .then(body => {
      console.log(`response from API:`, body)

      if (body.error === 1) {
        document.getElementById("error").innerText = body.msg
      } else {
        // Put our CSRF token into local storage
        // This is the value we will trust, and no longer use the cookie
        const cookies = new Cookies()
        window.localStorage.setItem("csrf_token", cookies.get("csrf_token"))
        alert(cookies.get("csrf_token"))

        // redirect to dashboard
        window.location.href = `/app/dashboard`
      }
    })
    .catch(error => {
      document.getElementById("error").innerText = "Login error"
    })

  return false
}

export const isLoggedIn = () => {
  const cookies = new Cookies()
  let token = cookies.get("token")
  return !!token
}

export const logout = async () => {
  // remove cached data regardless of session status
  window.localStorage.removeItem("dataCache")
  window.localStorage.removeItem("csrf_token")

  if (isLoggedIn()) {
    // If logged in then logout via the backend API
    console.log("logging out...")
    await fetch(`/api/logout`).then(() => (window.location.href = "/app/login"))
  } else {
    // Make sure we always redirect on logout
    navigate("/app/login")
  }
}
