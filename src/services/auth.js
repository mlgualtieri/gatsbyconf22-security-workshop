// npm install universal-cookie
import Cookies from 'universal-cookie';

export const isBrowser = () => typeof window !== "undefined"

export const getUser = () =>
  isBrowser() && window.localStorage.getItem("gatsbyUser")
    ? JSON.parse(window.localStorage.getItem("gatsbyUser"))
    : {}


//const setUser = user =>
//  window.localStorage.setItem("gatsbyUser", JSON.stringify(user))

//export const handleLogin = ({ username, password }) => {
export const handleLogin = data => {

    fetch(`/api/login`, {
      method: `POST`,
      body: JSON.stringify(data),
      headers: {
        "content-type": `application/json`,
      },
    })
      .then(res => res.json())
      .then(body => {
        console.log(`response from API:`, body)

        if(body.error === 1) {
            document.getElementById("error").innerText = body.msg
        }
        else {
		    window.location.href = `/app/dashboard`
        }

      })
      .catch(error => { 
            document.getElementById("error").innerText = "Login error"
      })

  /*
  if (username === `user@test.com` && password === `my_secret_password`) {
    return setUser({
      username: `tester`,
      name: `tester`,
      email: `user@test`,
    })
  }
  */
  return false
}

export const isLoggedIn = () => {
    const cookies = new Cookies();
    let token = cookies.get('token')
    return !!token

    //const user = getUser()
    //return !!user.username
}

/*
export const logout = callback => {
  setUser({})
  callback()
}
*/

export const logout = () => {
    // remove cached data regardless of session status
    window.localStorage.removeItem("dataCache")

    if (isLoggedIn()) {
        // If logged in then logout via the backend API
        console.log("logging out...")
        fetch(`/api/logout`)
        .then(() => window.location.href = "/app/login")
    }
    else {
        // Make sure we always redirect on logout
        window.location.href = "/app/login"
    }
}




