const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('RAG Chatbot is alive!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
