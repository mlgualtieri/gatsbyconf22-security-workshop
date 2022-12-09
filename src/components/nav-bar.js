import React from "react"
import { Link } from "gatsby"
import { isLoggedIn } from "../services/auth"
export default function NavBar() {
  let greetingMessage = ""
  if (isLoggedIn()) { // TODO: Use React.useState hook for logged in message
    greetingMessage = `Welcome back!`
  } else {
    greetingMessage = "You are not logged in"
  }
  return (
    <div
      style={{
        display: "flex", // TODO: extract css here to css module and import
        flex: "1",
        justifyContent: "space-between",
        borderBottom: "1px solid #d1c1e0",
      }}
    >
      <span>{greetingMessage}</span>
      <nav>
        <Link to="https://google.com"><i className="fa fa-home"></i> google</Link>
        <Link to="//google.com"><i className="fa fa-home"></i> google2</Link>
        <Link to="/"><i className="fa fa-home"></i> home</Link>
        {` `}
        {!isLoggedIn() ? ( // TODO: use one ternary to dictate which flow is used here
            <>
              <Link to="/about"><i className="far fa-address-card"></i> about</Link>
              {` `}
              <Link to="/app/login"><i className="fa fa-user"></i> login</Link>
            </>
        ) : null}
        {isLoggedIn() ? (
          <>
            <Link to="/app/dashboard"><i className="fa fa-user"></i> dashboard</Link>
            {` `}
            <Link to="/app/logout"><i className="fa fa-share"></i> logout</Link>
          </>
        ) : null}
      </nav>
    </div>
  )
}
