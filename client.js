


const sanityClient = require('@sanity/client')


const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production2',
  apiVersion: '2021-03-25', // use current UTC date - see "specifying API version"!
  token: process.env.SANITY_API_KEY, // or leave blank for unauthenticated usage
  useCdn: true, // `false` if you want to ensure fresh data
})


module.exports = client;