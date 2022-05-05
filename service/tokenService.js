const querystring = require("querystring");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const redirectURI = `http://localhost:8000/auth`;

exports.decodeJWT = (jwt_token) => {
  const obj = jwt.verify(jwt_token, process.env.JWT_SECRET);

  return obj;
};

exports.getTokens = async (code, clientId, clientSecret) => {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectURI,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch auth tokens`);
    throw new Error(error.message);
  }
};
