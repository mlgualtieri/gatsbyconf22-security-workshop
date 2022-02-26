require("dotenv").config({
      path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
    siteMetadata: {
      title: `GatsbyConf 2022 Security Workshop`,
      siteUrl: `https://www.yourdomain.tld`,
      /*
      menuLinksLogin:[
        {
          name:'home',
          link:'/'
        },
        {
          name:'account',
          link:'/account'
        },
        {
          name:'login',
          link:'/login'
        },
      ],
      menuLinksLogout:[
        {
          name:'home',
          link:'/'
        },
        {
          name:'account',
          link:'/account'
        },
        {
          name:'logout',
          link:'/logout'
        },
      ],
      */
    },
    plugins: [
        "gatsby-plugin-image",
        "gatsby-plugin-sharp",
        /*
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: `blog`,
                path: `${__dirname}/blog`,
            }
        },
        */
        "gatsby-plugin-mdx",
        "gatsby-transformer-sharp",
    ]
}
