const axios = require("axios");
const express = require("express");

const app = express;
const port = 3000;

app.listen(port, () => {
  console.log(` mon server a bien demarrée ${port}`);
});
