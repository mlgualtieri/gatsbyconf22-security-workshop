import * as React from 'react'
import Layout from '../components/layout'
import { Link } from "gatsby"
import { isLoggedIn } from "../services/auth"
import gatsbyLogo from '../images/Gatsby-Logo.svg'

const IndexPage = () => {
  return (
    <Layout pageTitle="Home">
      <p>This is a website designed to securely share documents.  There may be some vulnerabilities in it though!</p>
      <div>
        <img
          className="img100"
          alt="GatsbyConf 2022 Security Demo"
          src={gatsbyLogo}
        />
      </div>

      <hr/>

      <p>
        {isLoggedIn() ? (
          <>
            You are logged in, so check your{" "}
            <Link to="/app/dashboard">dashboard</Link>
          </>
        ) : (
          <>
            You should <Link to="/app/login">log in</Link> to see restricted
            content
          </>
        )}
      </p>


    </Layout>
  )
}
export default IndexPage
