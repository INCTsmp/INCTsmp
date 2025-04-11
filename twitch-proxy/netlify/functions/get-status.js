const fetch = require('node-fetch');

let accessToken = null;
let tokenExpiresAt = 0;

exports.handler = async (event, context) => {
  const streamers = ['alwaysalmostnever', 'jawnskibop', 'radi0zombie']; // Edit your streamer list here
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!accessToken || Date.now() > tokenExpiresAt) {
    const tokenRes = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
      method: 'POST'
    });
    const tokenData = await tokenRes.json();
    accessToken = tokenData.access_token;
    tokenExpiresAt = Date.now() + tokenData.expires_in * 1000;
  }

  const query = streamers.map(name => `user_login=${name}`).join('&');
  const res = await fetch(`https://api.twitch.tv/helix/streams?${query}`, {
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await res.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data.data)
  };
};
