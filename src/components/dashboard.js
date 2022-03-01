import * as React from "react"
import { isLoggedIn } from "../services/auth"
import { Link, navigate } from "gatsby"

//import Cookies from 'universal-cookie';

export const getCachedData = () =>
  window.localStorage.getItem("dataCache")
    ? JSON.parse(window.localStorage.getItem("dataCache"))
    : {}

/*
export const getFile = (file) => {
    console.log(file)
    fetch(`/api/docs`, {
        method: 'POST',
        headers: {
          "content-type": `application/json`,
        },
        body: JSON.stringify(file)
    })
    .then(response => response.blob())
	.then(function(blob) {
    	download(blob);
  	});
}
*/

export const getFile = (file, e) => {
  e.preventDefault()
  window.open(`/api/docs?file=${file}`, "_blank")
}

export const getData = async frontEndCallback => {
  let postData = {}

  //const cookies = new Cookies();
  //postData.csrf_token = cookies.get('csrf_token')

  if (isLoggedIn()) {
    // If cached data is present retrieve
    let cachedData = await getCachedData()
    if (Object.keys(cachedData).length !== 0) {
      frontEndCallback(cachedData)
    } else {
      const loadingSpinner = <i class="fas fa-spinner fa-spin"></i>
      frontEndCallback({
        username: loadingSpinner,
        fullname: loadingSpinner,
        docs: loadingSpinner,
      })
    }

    // Update with the dashboard server-side data
    fetch(`/api/dashboard`, {
      method: "POST",
      headers: {
        "content-type": `application/json`,
      },
      body: JSON.stringify(postData),
    })
      .then(response => {
        if (response.status !== 200) {
          navigate("/app/logout")
          return null
        } else {
          return response.json()
        }
      })
      .then(resultData => {
        if (resultData !== null) {
          //console.log(resultData)
          frontEndCallback(resultData)

          window.localStorage.setItem("dataCache", JSON.stringify(resultData)) // local storage calls are expensive
        }
      })
  } else {
    console.log("Not logged in...")
  }
}
const UlWrapper = ({ children }) => <ul>{children}</ul>
const Dashboard = () => {
  const [username, setUsername] = React.useState(``)
  const [fullname, setFullname] = React.useState(``)
  const [docs, setDocs] = React.useState([])
  React.useEffect(() => {
    getData(data => {
      if (data.username) {
        setUsername(data.username)
      }

      if (data.fullname) {
        setFullname(data.fullname)
      }

      if (data.docs) {
        setDocs(data.docs)
      }
    })
  }, [])

  return (
    <>
      <h2>Account</h2>
      <ul>
        <li>
          <b>Name:</b> <span id="fullname">{fullname}</span>
        </li>
        <li>
          <b>Email:</b> <span id="username">{username}</span>
        </li>
      </ul>
      <h2>Documents</h2>
      <div id="docs">
        {!Array.isArray(docs) ? (
          docs
        ) : docs.length > 0 ? (
          <UlWrapper>
            {docs.map((file, index) => {
              return (
                <li key={file}>
                  <Link to="#" onClick={e => getFile(file, e)}>
                    <i className="fa fa-file"></i> {file}
                  </Link>
                </li>
              )
            })}
          </UlWrapper>
        ) : null}
      </div>
    </>
  )
}

//<li>E-mail: {getUser().email}</li>
export default Dashboard
