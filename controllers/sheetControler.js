const axios = require("axios");
const tokenService = require("../service/tokenService");
const formatterService = require("../service/formatterService");
const functionFactoryService = require("../service/functionFactoryService");
const catchAsync = require("../util/chtchasync");
const AppError = require("../util/appError");

exports.redSheet = catchAsync(async (req, res, next) => {
  const { spreadsheet_ID } = req.params;
  const obj = tokenService.decodeJWT(req.cookies.jwt_token);
  const token = obj.access_token;

  const data = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_ID}?fields=sheets%2Fdata%2FrowData%2Fvalues%2FuserEnteredValue`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!data?.data) {
    next(
      new AppError("please check your spreadsheet ID or try again later", 404)
    );
  }

  res.json(formatterService.data_formatter(data.data));
});

exports.updateSheet = catchAsync(async (req, res) => {
  const { spreadsheet_id, sheet_id, row_number, column_number, value } =
    req.body;

  // const spreadsheet_id = "1tkYTGls_8eSGD5kOIDcaWGiDvIC7muuwupgiyRBjrc0";
  // const sheet_id = 0;
  // const row_number = 1;
  // const column_number = 1;
  // const value = 639;

  if (
    spreadsheet_id === null ||
    sheet_id === null ||
    row_number === null ||
    column_number === null ||
    value === null
  ) {
    res.json({
      success: false,
      message: "please provide all the fields",
    });
  }

  const obj = tokenService.decodeJWT(req.cookies.jwt_token);
  const token = obj.access_token;

  const data = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}?fields=sheets.properties`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!data) {
    next(
      new AppError("please check your spreadsheet ID or try again later", 404)
    );
  }
  const title = functionFactoryService.giveSheetTitle(data.data, sheet_id);

  const postData = {
    majorDimension: "ROWS",
    range: `${title}!${formatterService.convertColumn(
      column_number
    )}${row_number}`,
    values: [[value]],
  };

  const response = await axios.put(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet_id}/values/${title}!${formatterService.convertColumn(
      column_number
    )}${row_number}?includeValuesInResponse=true&responseDateTimeRenderOption=SERIAL_NUMBER&responseValueRenderOption=UNFORMATTED_VALUE&valueInputOption=RAW`,
    postData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response) {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }
  res.json({
    success: true,
  });
});
