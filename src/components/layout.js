import * as React from 'react'
import Helmet from "react-helmet"
import "../styles/global.css"


import { useStaticQuery, graphql } from 'gatsby'
import NavBar from "./nav-bar"

import {
  container,
  heading,
} from './layout.module.css'

const Layout = ({ pageTitle, children }) => {

  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title,
        }
      }
    }
  `)

  let output = (
    <>
    <div className={container}>
      <Helmet>
        <title>{pageTitle} | {data.site.siteMetadata.title}</title>
        <link rel="stylesheet" 
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" 
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
        <link rel="stylesheet" 
            href="//use.fontawesome.com/releases/v5.15.4/css/all.css" />
        <link 
            href="https://fonts.googleapis.com/css?family=Mulish:300,400" rel="stylesheet" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' 127.0.0.1:* ws://127.0.0.1:*; script-src 'self' 'unsafe-eval'; style-src 'self' *.bootstrapcdn.com use.fontawesome.com 'unsafe-inline'; font-src use.fontawesome.com fonts.gstatic.com; img-src 'self' data:; child-src 'none';" />
      </Helmet>
      <NavBar />
      <main>
        <h1 className={heading}>{pageTitle}</h1>
        {children}
      </main>
    </div>
    </>
  )

  return (
    output
  )
}

export default Layout
