import * as React from 'react'
import { Link } from "gatsby"
import Layout from '../components/layout'

const AboutPage = () => {
  return (
    <Layout pageTitle="About">
      <p>
        This demo has been created by Mike Gualtieri and Rodney Matambo
        for the GatsbyConf 2022 workshop:
        {` `}
        <Link to="https://gatsbyconf.com/mike-gualtieri/#details">Building a Secure Gatsby Website</Link>.
        {` `}
        Enjoy!
      </p>
    </Layout>
  )
}

export default AboutPage
