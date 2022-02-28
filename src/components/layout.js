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


  // Note:
  // Instead of using 'unsafe-inline' for style-src we could also use 'sha256-cLHlYu9WwZQgD1K6YlWPqFYXJEuD9YpxdlDktBDedco='

  let output = (
    <>
    <div className={container}>
      <Helmet>
        <title>{pageTitle} | {data.site.siteMetadata.title}</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Mulish:300,400" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' 127.0.0.1:* ws://127.0.0.1:*; script-src 'self' 'unsafe-eval'; style-src 'self' *.bootstrapcdn.com fonts.googleapis.com cdnjs.cloudflare.com 'unsafe-inline'; font-src cdnjs.cloudflare.com fonts.gstatic.com; img-src 'self' data:; child-src 'none';" />
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
