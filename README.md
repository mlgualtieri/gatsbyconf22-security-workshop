<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>

## 🚀 Welcome GatsbyConf 2022 Visitors!

This demo web application has been created by @mlgualtieri and @rmatambo8 for the GatsbyConf 2022 workshop: **Building a Secure Gatsby Website**.  The demo is a small application designed to securely share documents. There may be some (purposful) vulnerabilities in it though!

The workshop will cover the following topics:
- Securely architecting a Gatsby web application
- IAM basics
- JWT authentication
- Environment variables
- Data caching and security
- Securly logging out 
- CSRF and XSS 
- Can you hack Static? Using CSP and SRI 
- Common web application vulnerability: Broken authentication
- Common web application vulnerability: IDOR 
- Common web application vulnerability: Injection


## To try out the application run:
    ```shell
    cd gatsbyconf22-security-workshop/
    npm install
    gatsby develop
    ```
Note: For the application to be fully functional it requires an AWS RDS MySQL server and an AWS S3 bucket, accessible via an IAM user.
