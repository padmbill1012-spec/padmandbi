const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_TITLE = 'PADM&BILL Submissions Dashboard';

const EMAIL_TO = process.env.EMAIL_TO || 'padmbill1012@gmail.com';
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_TO;
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_ENABLED = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS;

const transporter = EMAIL_ENABLED
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

function buildSubmissionEmail(entry) {
  const submittedAt = entry._receivedAt || new Date().toISOString();
  return {
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `New PADM&BILL submission: ${entry.name || entry['Full Name'] || entry['Company / Vendor Name'] || 'Contact Request'}`,
    text: `A new submission was received:\n\n` +
      `Name: ${entry.name || entry['Full Name'] || entry['Company / Vendor Name'] || 'Unknown'}\n` +
      `Email: ${entry.email || entry.Email || ''}\n` +
      `Phone: ${entry.phone || entry.Phone || ''}\n` +
      `Type: ${entry.eventType || entry['Registration Type'] || entry.Type || 'Contact'}\n` +
      `Location: ${entry['Current Location'] || entry['Service Area / City'] || ''}\n` +
      `Details: ${entry.message || entry['Skills & Experience'] || entry['Service Details'] || ''}\n` +
      `Received at: ${submittedAt}\n`,
    html: `<!doctype html><html><body>` +
      `<h2>New PADM&BILL Submission</h2>` +
      `<p><strong>Name:</strong> ${entry.name || entry['Full Name'] || entry['Company / Vendor Name'] || 'Unknown'}</p>` +
      `<p><strong>Email:</strong> ${entry.email || entry.Email || ''}</p>` +
      `<p><strong>Phone:</strong> ${entry.phone || entry.Phone || ''}</p>` +
      `<p><strong>Type:</strong> ${entry.eventType || entry['Registration Type'] || entry.Type || 'Contact'}</p>` +
      `<p><strong>Location:</strong> ${entry['Current Location'] || entry['Service Area / City'] || ''}</p>` +
      `<p><strong>Details:</strong><br>${(entry.message || entry['Skills & Experience'] || entry['Service Details'] || '').replace(/\n/g, '<br>')}</p>` +
      `<p><em>Received at ${submittedAt}</em></p>` +
      `</body></html>`,
  };
}

async function sendSubmissionEmail(entry) {
  if (!transporter) {
    console.warn('Email not configured. Skipping email send.');
    return null;
  }
  const mailOptions = buildSubmissionEmail(entry);
  return transporter.sendMail(mailOptions);
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const submissionsFile = path.join(__dirname, 'submissions.json');

function readSubmissions() {
  try {
    if (!fs.existsSync(submissionsFile)) {
      return [];
    }

    const raw = fs.readFileSync(submissionsFile, 'utf8');
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read submissions:', e);
    return [];
  }
}

function saveSubmission(data) {
  const arr = readSubmissions();
  data._receivedAt = new Date().toISOString();
  arr.push(data);
  fs.writeFileSync(submissionsFile, JSON.stringify(arr, null, 2), 'utf8');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderAdminPage(submissions) {
  const rows = submissions
    .slice()
    .reverse()
    .map((entry, index) => {
      const receivedAt = entry._receivedAt ? new Date(entry._receivedAt).toLocaleString() : 'Unknown';
      const registrationType = escapeHtml(entry['Registration Type'] || entry.Type || 'Contact');
      const name = escapeHtml(entry['Full Name'] || entry['Company / Vendor Name'] || 'Unknown');
      const email = escapeHtml(entry.Email || '');
      const phone = escapeHtml(entry.Phone || '');
      const role = escapeHtml(entry['Preferred Role'] || entry['Service Category'] || entry.eventType || '');
      const location = escapeHtml(entry['Current Location'] || entry['Service Area / City'] || '');
      const details = escapeHtml(entry['Skills & Experience'] || entry['Service Details'] || entry.message || '');

      return `
        <tr>
          <td>${submissions.length - index}</td>
          <td>${registrationType}</td>
          <td>${name}</td>
          <td>${email}</td>
          <td>${phone}</td>
          <td>${role}</td>
          <td>${location}</td>
          <td>${receivedAt}</td>
          <td>${details}</td>
        </tr>
      `;
    })
    .join('');

  const total = submissions.length;
  const employees = submissions.filter((entry) => entry['Registration Type'] === 'Employee').length;
  const vendors = submissions.filter((entry) => entry['Registration Type'] === 'Vendor').length;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${ADMIN_TITLE}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f5f1ea;
      --panel: #ffffff;
      --text: #1f2937;
      --muted: #6b7280;
      --accent: #8b5e34;
      --border: #e5ddd3;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: linear-gradient(180deg, #f8f4ee 0%, var(--bg) 100%);
      color: var(--text);
    }

    .wrap {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 18px 56px;
    }

    .hero {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 16px 40px rgba(60, 40, 20, 0.08);
      margin-bottom: 20px;
    }

    .hero h1 {
      margin: 0 0 10px;
      font-size: 30px;
    }

    .hero p {
      margin: 0;
      color: var(--muted);
      line-height: 1.5;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin: 18px 0 22px;
    }

    .stat {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 18px;
    }

    .stat .label {
      color: var(--muted);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }

    .stat .value {
      font-size: 28px;
      font-weight: 700;
      color: var(--accent);
    }

    .table-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(60, 40, 20, 0.08);
    }

    .table-scroll {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 1100px;
    }

    th, td {
      padding: 14px 12px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
      text-align: left;
      font-size: 14px;
    }

    th {
      background: #faf6f1;
      position: sticky;
      top: 0;
      z-index: 1;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--muted);
    }

    tbody tr:nth-child(even) {
      background: #fcfaf7;
    }

    .empty {
      padding: 32px;
      color: var(--muted);
      text-align: center;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 14px 0 0;
    }

    .toolbar a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: 0 16px;
      border-radius: 999px;
      text-decoration: none;
      border: 1px solid var(--border);
      color: var(--text);
      background: #fff;
      font-weight: 600;
    }

    .toolbar a.primary {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
    }

    @media (max-width: 800px) {
      .stats {
        grid-template-columns: 1fr;
      }

      .hero h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <h1>${ADMIN_TITLE}</h1>
      <p>Live view of employee and vendor registrations stored by the backend.</p>
      <div class="toolbar">
        <a class="primary" href="/submissions">Download JSON</a>
        <a href="/">Backend Home</a>
      </div>
    </section>

    <section class="stats">
      <div class="stat">
        <div class="label">Total submissions</div>
        <div class="value">${total}</div>
      </div>
      <div class="stat">
        <div class="label">Employee registrations</div>
        <div class="value">${employees}</div>
      </div>
      <div class="stat">
        <div class="label">Vendor registrations</div>
        <div class="value">${vendors}</div>
      </div>
    </section>

    <section class="table-card">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role / Category</th>
              <th>Location</th>
              <th>Received</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td class="empty" colspan="9">No submissions yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  </main>
</body>
</html>`;
}

app.post('/submit', async (req, res) => {
  try {
    const payload = req.body || {};
    // simple honeypot check
    if (payload.website) {
      return res.status(400).json({ ok: false, message: 'Spam detected' });
    }

    saveSubmission(payload);

    try {
      await sendSubmissionEmail(payload);
      console.log('Submission email sent.');
    } catch (emailError) {
      console.error('Failed to send submission email:', emailError);
    }

    return res.json({ ok: true, message: 'Submission saved' });
  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ ok: false, message: 'Server error' });
  }
});

app.get('/submissions', (req, res) => {
  const submissions = readSubmissions();
  res.json({ ok: true, count: submissions.length, submissions });
});

app.get('/admin', (req, res) => {
  const submissions = readSubmissions();
  res.type('html').send(renderAdminPage(submissions));
});

app.get('/', (req, res) => res.send('PADM&BILL form backend running'));

app.listen(PORT, () => console.log(`Form backend listening on port ${PORT}`));
