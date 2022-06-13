const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

export async function verify(token: any) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  
  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error('Invalid token');
  }

  if (!payload.email_verified) {
    throw new Error('Email not verified');
  }

  if (!payload.hd.includes('westportps.org')) {
    throw new Error('Invalid domain');
  }

  if (payload.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }

  return {
    userId: payload['sub'],
    name: payload['name'],
    email: payload['email'],
    picture: payload['picture'],
  };

  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
