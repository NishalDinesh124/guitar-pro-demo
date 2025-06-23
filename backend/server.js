const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;  // ✅ Use dynamic port on Render

app.use(cors());

app.get("/api/file", async (req, res) => {
  const fileId = req.query.id;
  if (!fileId) return res.status(400).send("Missing file ID");

  try {
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const response = await fetch(driveUrl);
    if (!response.ok) throw new Error("Failed to fetch file from Google Drive");

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).send("Failed to fetch file");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
