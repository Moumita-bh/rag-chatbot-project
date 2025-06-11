const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ RAG Chatbot Backend is running!");
});

// You can add a POST route later for your webhook
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
