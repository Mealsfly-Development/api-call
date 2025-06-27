const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

const httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false, // in case self-signed certs
});

app.post('/forward-lead', async (req, res) => {
  try {
    console.log("🚀 Forwarding payload to Astrix API:", req.body);

    const response = await axios.post(
      'https://b86.ivrobd.com/api/v1/astrixdispatcher/v3/lead?isDND=false',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          // DO NOT include 'Expect' header
        },
        timeout: 10000,
        httpsAgent,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    console.log("✅ API Response:", response.status, response.data);
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error("❌ Proxy error:", error.message);

    if (error.response) {
      console.error("📡 API Error Response:", error.response.status, error.response.data);
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy server is running on port ${PORT}`);
});
