// pages/api/timestamp.js
export default function handler(req, res) {
  res.status(200).json({ timestamp: new Date().toISOString() })
}
