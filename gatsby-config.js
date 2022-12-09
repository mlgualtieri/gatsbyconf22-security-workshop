require("dotenv").config({
      path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
    siteMetadata: {
      title: `GatsbyConf 2022 Security Workshop`,
      siteUrl: `https://www.yourdomain.tld`,
      description: `<h3 onload="alert(1)">tester</h1>`,
    },
    plugins: [
        "gatsby-plugin-image",
        "gatsby-plugin-sharp",
        "gatsby-plugin-mdx",
        "gatsby-transformer-sharp",
        {
          resolve: `gatsby-plugin-gatsby-cloud`,
          options: {
            mergeSecurityHeaders: false,
            headers: {
              "/*": [
                  `X-Frame-Options: DENY`,
                  `X-XSS-Protection: 1; mode=block`,
                  `X-Content-Type-Options: nosniff`,
                  `Referrer-Policy: same-origin`,
                  //`Content-Security-Policy: upgrade-insecure-requests; default-src 'self'; `
              ],
            },
          },
        },
    ]
}
