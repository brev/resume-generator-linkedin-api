module.exports = {  
  key: {
    api   : 'LINKEDIN_API_KEY_GOES_HERE',
    secret: 'LINKEDIN_SECRET_KEY_GOES_HERE',
  },
  access: {
    token:  'LINKEDIN_ACCESS_TOKEN_GOES_HERE',
    secret: 'LINKEDIN_ACCESS_SECRET_GOES_HERE',
  },
  path: {
    profile: '/v1/people/~',
    token: {
      request:  '/uas/oauth/requestToken',
      access:   '/uas/oauth/accessToken',
    },
  },
  url: {
    api: 'https://api.linkedin.com',
  },
};
