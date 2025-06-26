// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/forward-lead', async (req, res) => {
  try {
    const response = await axios.post(
      'https://n53.ivrobd.com/api/v1/astrixdispatcher/v3/lead?isDND=false',
      req.body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("New lead from Google Apps Script:", JSON.stringify(req.body, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
