const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const submissionsFile = path.join(__dirname, 'submissions.json');

function saveSubmission(data) {
  let arr = [];
  try {
    if (fs.existsSync(submissionsFile)) {
      arr = JSON.parse(fs.readFileSync(submissionsFile, 'utf8') || '[]');
    }
  } catch (e) {
    console.error('Failed to read existing submissions:', e);
  }
  data._receivedAt = new Date().toISOString();
  arr.push(data);
  fs.writeFileSync(submissionsFile, JSON.stringify(arr, null, 2), 'utf8');
}

app.post('/submit', (req, res) => {
  try {
    const payload = req.body || {};
    // simple honeypot check
    if (payload.website) {
      return res.status(400).json({ ok: false, message: 'Spam detected' });
    }
    saveSubmission(payload);
    return res.json({ ok: true, message: 'Submission saved' });
  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

app.get('/', (req, res) => res.send('PADM&BILL form backend running'));

app.listen(PORT, () => console.log(`Form backend listening on port ${PORT}`));
