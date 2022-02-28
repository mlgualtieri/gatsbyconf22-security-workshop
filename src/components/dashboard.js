import React, { useEffect } from "react"
import { isLoggedIn } from "../services/auth"
import { Link } from "gatsby"

const ReactDOM = require('react-dom')

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


export const setProfileData = (data) => {
    // Populate user data
    document.getElementById("fullname").innerText = data.fullname
    document.getElementById("username").innerText = data.username
    /*
    	TODO: Replace with react logic
	- track fullname and username using useState/ use Reducer
	- pass in data into a list component
	- separate logic and rendering - conditionally render if list is available
	
    */
    // Populate list of docs
    const doc_items = data.docs.map((file, e) =>  
        <li key={file}>
            <Link to="#" onClick={(e) => getFile(file, e)}>
                <i className="fa fa-file"></i> {file}
            </Link>
        </li>)
    ReactDOM.render(
        <ul>{doc_items}</ul>, document.getElementById('docs')
    );
}


export const getData = data => {

    let postData = {}
    
    //const cookies = new Cookies();
    //postData.csrf_token = cookies.get('csrf_token')
    
    if (isLoggedIn()) {
 
        // If cached data is present retrieve
        let cachedData = getCachedData()
        if(Object.keys(cachedData).length !== 0) {
            setProfileData(cachedData)
        }
        else {
            // Show spinner while we wait for the data // TODO: create component for spinner and render spinning when getting data
            document.getElementById("fullname").innerHTML = `<i class="fas fa-spinner fa-spin"></i>`
            document.getElementById("username").innerHTML = `<i class="fas fa-spinner fa-spin"></i>` 
            document.getElementById("docs").innerHTML     = `<i class="fas fa-spinner fa-spin"></i>` 
        }

        // Update with the dashboard server-side data
        fetch(`/api/dashboard`, {
            method: 'POST',
            headers: {
              "content-type": `application/json`,
            },
            body: JSON.stringify(postData)
        })
        .then(response => {
            if(response.status !== 200) {
                window.location.href = "/app/login" // TODO: use navigate here
                return null
            }
            else {
                return response.json()
            }
        })
        .then(resultData => {
            if(resultData !== null) {
                //console.log(resultData)
                setProfileData(resultData)
                window.localStorage.setItem("dataCache", JSON.stringify(resultData)) // local storage calls are expensive
            }
        }) 
    }
    else {
        console.log("Not logged in...")
    }

}


const Dashboard = () => {

    useEffect(() => {
          getData();
    }, []);

  return (
  <>
    <h2>Account</h2>
    <ul>
      <li><b>Name:</b> <span id="fullname"></span></li>
      <li><b>Email:</b> <span id="username"></span></li>
    </ul>
    <h2>Documents</h2>
    <div id="docs">
    </div>
  </>
  )
}

      //<li>E-mail: {getUser().email}</li>
export default Dashboard
