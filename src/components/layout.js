import * as React from 'react'
import Helmet from "react-helmet"
import "../styles/global.css"


import { 
    //Link, 
    useStaticQuery, graphql } from 'gatsby'
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
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
        <link rel="stylesheet" href="//use.fontawesome.com/releases/v5.15.4/css/all.css" />
        <link href="https://fonts.googleapis.com/css?family=Mulish:300,400" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css?family=Droid+Sans+Mono|Arimo:400,400i,700" rel="stylesheet" />
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
