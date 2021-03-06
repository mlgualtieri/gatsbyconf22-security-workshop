// npm install dompurify 

import * as React from "react"
import { isLoggedIn } from "../services/auth"
import { Link, navigate } from "gatsby"
import DOMPurify from 'dompurify'; 

export const getCachedData = () =>
  window.localStorage.getItem("dataCache")
    ? JSON.parse(window.localStorage.getItem("dataCache"))
    : {}

export const getFile = (file, e) => {
  e.preventDefault()

  // Use DOMPurify here to prevent an XSS
  file = DOMPurify.sanitize(file)

  let csrf_token = window.localStorage.getItem('csrf_token')

  // To prompt download we will append an a element to the DOM and simulate a click
  let url = `/api/docs?file=${file}&csrf_token=${csrf_token}`
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `${file}`,
  );
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
}

export const getData = async frontEndCallback => {
  let postData = {}

  postData.csrf_token = window.localStorage.getItem('csrf_token')

  if (isLoggedIn()) {
    // If cached data is present retrieve
    let cachedData = await getCachedData()
    if (Object.keys(cachedData).length !== 0) {
      frontEndCallback(cachedData)
    } else {
      const loadingSpinner = <i className="fas fa-spinner fa-spin"></i>
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
