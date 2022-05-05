require("dotenv").config();
const querystring = require("querystring");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const tokenService = require("../service/tokenService");
const catchAsync = require("../util/chtchasync");
const AppError = require("../util/appError");

exports.getGoogleAuthURL = (req, res) => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `http://localhost:8000/auth`,
    client_id: process.env.CLINT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/spreadsheets",
    ].join(" "),
  };
  res.redirect(`${rootUrl}?${querystring.stringify(options)}`);
  // res.send(`${rootUrl}?${querystring.stringify(options)}`);
};

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const code = req.query.code;

  const { access_token, id_token } = await tokenService.getTokens(
    code,
    process.env.CLINT_ID,
    process.env.CLINT_SECRET
  );

  const googleUser = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    }
  );

  if (!googleUser) {
    next(new AppError("failed to fatah the user"), 404);
    res.json({
      status: "failed",
    });
  }

  googleUser.data.access_token = access_token;
  googleUser.data.id_token = id_token;

  const token = jwt.sign(googleUser.data, process.env.JWT_SECRET);

  res.cookie("jwt_token", token, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });

  res.json({
    status: "success",
    User: googleUser.data,
  });
});
