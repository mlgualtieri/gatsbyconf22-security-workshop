require("dotenv").config({
      path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
    siteMetadata: {
      title: `GatsbyConf 2022 Security Workshop`,
      siteUrl: `https://www.yourdomain.tld`,
    },
    plugins: [
        "gatsby-plugin-image",
        "gatsby-plugin-sharp",
        "gatsby-plugin-mdx",
        "gatsby-transformer-sharp",
    ]
}
