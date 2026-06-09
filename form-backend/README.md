Simple PADM&BILL Form Backend

This tiny Express server accepts POST requests at `/submit` and saves submissions to `submissions.json`.
It also exposes `/submissions` for JSON output and `/admin` for a simple dashboard view of all registrations.

Usage:

1. Install dependencies:

```bash
cd form-backend
npm install
```

2. Start the server:

```bash
npm start
```

3. Configure your deployment or reverse proxy to expose the server, then update your website form or use the JavaScript fetch fallback.

Deployment suggestions:
- Render: create a new Web Service from GitHub and point it at this folder.
- Railway: connect the repo and deploy the Node.js service.
- Vercel: use a custom server deployment or API route.

Notes:
- This server stores submissions locally in `submissions.json`. For production, replace storage with a database and secure the endpoint.
- The `/admin` dashboard is intentionally simple; add authentication before exposing it publicly.
- Do not expose this server to the open internet without adding authentication and rate-limiting.
