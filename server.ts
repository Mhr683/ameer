import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

interface SessionData {
  accessToken: string;
  user: any;
  createdAt: number;
}

const sessions = new Map<string, SessionData>();

// Simple sanitization helper for HTML template
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helper to extract session
  function getSession(req: express.Request): SessionData | null {
    const sessionId = req.cookies?.gh_session;
    if (!sessionId) return null;
    return sessions.get(sessionId) || null;
  }

  // 1. Auth Status Endpoint
  app.get('/api/auth/status', (req, res) => {
    const session = getSession(req);
    const clientId = process.env.GITHUB_CLIENT_ID?.trim();
    const clientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();
    const isConfigured = Boolean(clientId && clientSecret);

    if (session) {
      res.json({
        authenticated: true,
        configured: isConfigured,
        user: session.user,
        hasClientId: Boolean(clientId),
        hasClientSecret: Boolean(clientSecret),
      });
    } else {
      res.json({
        authenticated: false,
        configured: isConfigured,
        hasClientId: Boolean(clientId),
        hasClientSecret: Boolean(clientSecret),
      });
    }
  });

  // 2. OAuth URL Generator Endpoint
  app.get('/api/auth/github/url', (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID?.trim();
    if (!clientId) {
      res.status(400).json({
        error: 'GITHUB_CLIENT_ID is not configured in environment variables.',
        configured: false,
      });
      return;
    }

    // Determine redirect URI: use provided origin or env APP_URL or fallback
    const origin = (req.query.origin as string) || process.env.APP_URL || '';
    let redirectUri = '';
    if (origin) {
      redirectUri = `${origin.replace(/\/$/, '')}/auth/callback`;
    } else {
      redirectUri = `https://${req.get('host')}/auth/callback`;
    }

    const state = crypto.randomBytes(16).toString('hex');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email repo',
      state,
      allow_signup: 'true',
    });

    const url = `https://github.com/login/oauth/authorize?${params.toString()}`;
    res.json({ url, redirectUri, state });
  });

  // 3. Callback Handler (Handles both with and without trailing slash)
  const callbackHandler: express.RequestHandler = async (req, res) => {
    const code = req.query.code as string;
    const errorParam = req.query.error as string;
    const errorDescription = req.query.error_description as string;

    if (errorParam) {
      const errorMsg = errorDescription || errorParam;
      res.status(400).send(`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>GitHub Authentication Failed</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc;">
            <div style="text-align: center; padding: 2rem; max-width: 440px; border-radius: 12px; background: #1e293b; border: 1px solid #ef4444;">
              <h2 style="color: #f87171; margin: 0 0 0.5rem 0;">Authentication Error</h2>
              <p style="color: #cbd5e1; margin: 0 0 1.25rem 0; font-size: 0.95rem;">${escapeHtml(errorMsg)}</p>
              <button onclick="window.close()" style="background: #334155; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.9rem;">Close Window</button>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
              }
            </script>
          </body>
        </html>
      `);
      return;
    }

    if (!code) {
      res.status(400).send(`
        <!doctype html>
        <html>
          <head><title>No Code</title></head>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc;">
            <p>Missing authorization code from GitHub.</p>
          </body>
        </html>
      `);
      return;
    }

    const clientId = process.env.GITHUB_CLIENT_ID?.trim();
    const clientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();

    if (!clientId || !clientSecret) {
      const errorMsg = 'GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing in server environment.';
      res.status(500).send(`
        <!doctype html>
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc;">
            <div style="text-align: center; padding: 2rem; background: #1e293b; border-radius: 12px;">
              <p style="color: #f87171;">${escapeHtml(errorMsg)}</p>
              <button onclick="window.close()" style="background: #334155; color: white; border: none; padding: 8px 16px; border-radius: 6px;">Close</button>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
              }
            </script>
          </body>
        </html>
      `);
      return;
    }

    try {
      // Exchange code for token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'GitHub-Connect-Applet',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      const tokenData = await tokenResponse.json() as {
        access_token?: string;
        error?: string;
        error_description?: string;
      };

      if (!tokenData.access_token) {
        throw new Error(tokenData.error_description || tokenData.error || 'Failed to obtain access token from GitHub');
      }

      // Fetch user profile from GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'GitHub-Connect-Applet',
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!userResponse.ok) {
        throw new Error(`GitHub user profile request returned status ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      // Create session
      const sessionId = crypto.randomUUID();
      sessions.set(sessionId, {
        accessToken: tokenData.access_token,
        user: userData,
        createdAt: Date.now(),
      });

      // Set cookie configured for cross-origin iframe
      res.cookie('gh_session', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
      });

      res.send(`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Connected to GitHub</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc;">
            <div style="text-align: center; padding: 2.5rem; border-radius: 16px; background: #1e293b; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
              <div style="width: 56px; height: 56px; border-radius: 50%; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto; font-size: 28px; font-weight: bold;">
                ✓
              </div>
              <h2 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; color: #f8fafc;">Connected to GitHub!</h2>
              <p style="color: #94a3b8; margin: 0 0 1.25rem 0; font-size: 0.95rem;">Authenticated as @${escapeHtml(userData.login || 'user')}</p>
              <p style="color: #64748b; margin: 0; font-size: 0.85rem;">This window will close automatically.</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(userData.login)} }, '*');
                setTimeout(() => window.close(), 600);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('OAuth callback processing error:', err);
      const errorMsg = err?.message || 'Authentication failed';
      res.status(500).send(`
        <!doctype html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc;">
            <div style="text-align: center; padding: 2rem; max-width: 440px; border-radius: 12px; background: #1e293b; border: 1px solid #ef4444;">
              <h2 style="color: #f87171; margin: 0 0 0.5rem 0;">Authentication Error</h2>
              <p style="color: #cbd5e1; margin: 0 0 1.25rem 0;">${escapeHtml(errorMsg)}</p>
              <button onclick="window.close()" style="background: #334155; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Close Window</button>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: ${JSON.stringify(errorMsg)} }, '*');
              }
            </script>
          </body>
        </html>
      `);
    }
  };

  app.get(['/auth/callback', '/auth/callback/'], callbackHandler);

  // 4. GitHub User Profile Endpoint
  app.get('/api/github/user', async (req, res) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Not authenticated with GitHub.' });
      return;
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'User-Agent': 'GitHub-Connect-Applet',
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          sessions.delete(req.cookies?.gh_session);
          res.status(401).json({ error: 'GitHub session expired. Please reconnect.' });
          return;
        }
        throw new Error(`GitHub API returned status ${response.status}`);
      }

      const userData = await response.json();
      session.user = userData;
      res.json(userData);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch GitHub user profile.' });
    }
  });

  // 5. GitHub Repositories Endpoint
  app.get('/api/github/repos', async (req, res) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Not authenticated with GitHub.' });
      return;
    }

    const sort = (req.query.sort as string) || 'updated';
    const perPage = (req.query.per_page as string) || '30';

    try {
      const response = await fetch(`https://api.github.com/user/repos?sort=${encodeURIComponent(sort)}&per_page=${encodeURIComponent(perPage)}&affiliation=owner,collaborator`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'User-Agent': 'GitHub-Connect-Applet',
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub repos API returned status ${response.status}`);
      }

      const repos = await response.json();
      res.json(repos);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch repositories.' });
    }
  });

  // 6. GitHub Activity Endpoint
  app.get('/api/github/activity', async (req, res) => {
    const session = getSession(req);
    if (!session) {
      res.status(401).json({ error: 'Not authenticated with GitHub.' });
      return;
    }

    try {
      const username = session.user?.login;
      if (!username) {
        res.status(400).json({ error: 'Missing username in session.' });
        return;
      }

      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=20`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'User-Agent': 'GitHub-Connect-Applet',
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub events API returned status ${response.status}`);
      }

      const events = await response.json();
      res.json(events);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch activity.' });
    }
  });

  // 7. Connect via Personal Access Token (PAT)
  app.post('/api/auth/token-login', async (req, res) => {
    const token = req.body?.token?.trim();
    if (!token) {
      res.status(400).json({ error: 'Token is required.' });
      return;
    }

    try {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'GitHub-Connect-Applet',
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!userResponse.ok) {
        res.status(401).json({ error: 'Invalid GitHub token or expired permissions.' });
        return;
      }

      const userData = await userResponse.json();

      const sessionId = crypto.randomUUID();
      sessions.set(sessionId, {
        accessToken: token,
        user: userData,
        createdAt: Date.now(),
      });

      res.cookie('gh_session', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.json({ success: true, user: userData });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to authenticate token.' });
    }
  });

  // 8. Direct Repository Inspection Endpoint (Inspect any public or authenticated repo)
  app.post('/api/github/inspect-repo', async (req, res) => {
    let repoInput = (req.body?.repo || '').trim();
    const customToken = req.body?.token?.trim();
    const session = getSession(req);

    // Extract owner and repo from URL or "owner/repo" string
    repoInput = repoInput.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    const parts = repoInput.split('/');
    if (parts.length < 2) {
      res.status(400).json({ error: 'Invalid repository format. Please enter "owner/repo" or full GitHub URL.' });
      return;
    }

    const owner = parts[0];
    const repo = parts[1];

    const token = customToken || session?.accessToken || '';
    const headers: Record<string, string> = {
      'User-Agent': 'GitHub-Connect-Applet',
      Accept: 'application/vnd.github.v3+json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      // 1. Fetch Repo info
      const repoRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, { headers });
      if (!repoRes.ok) {
        if (repoRes.status === 404) {
          res.status(404).json({ error: `Repository "${owner}/${repo}" not found or is private. If private, please connect with access token.` });
          return;
        }
        throw new Error(`GitHub API returned status ${repoRes.status}`);
      }
      const repoData = await repoRes.json();

      // 2. Fetch README
      let readme = '';
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, {
          headers: { ...headers, Accept: 'application/vnd.github.v3.raw' },
        });
        if (readmeRes.ok) {
          readme = await readmeRes.text();
        }
      } catch {
        // Ignore if no readme
      }

      // 3. Fetch Root Contents Tree
      let contents: any[] = [];
      try {
        const contentsRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents`, { headers });
        if (contentsRes.ok) {
          contents = await contentsRes.json();
        }
      } catch {
        // Ignore
      }

      // 4. Fetch Recent Commits
      let commits: any[] = [];
      try {
        const commitsRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=10`, { headers });
        if (commitsRes.ok) {
          commits = await commitsRes.json();
        }
      } catch {
        // Ignore
      }

      res.json({
        repo: repoData,
        readme,
        contents: Array.isArray(contents) ? contents : [],
        commits: Array.isArray(commits) ? commits : [],
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to inspect repository.' });
    }
  });

  // 9. Fetch File Content from Repo
  app.post('/api/github/file-content', async (req, res) => {
    let repoInput = (req.body?.repo || '').trim();
    const filePath = (req.body?.path || '').trim();
    const customToken = req.body?.token?.trim();
    const session = getSession(req);

    repoInput = repoInput.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
    const parts = repoInput.split('/');
    if (parts.length < 2 || !filePath) {
      res.status(400).json({ error: 'Repository and file path are required.' });
      return;
    }

    const owner = parts[0];
    const repo = parts[1];
    const token = customToken || session?.accessToken || '';
    const headers: Record<string, string> = {
      'User-Agent': 'GitHub-Connect-Applet',
      Accept: 'application/vnd.github.v3.raw',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const fileRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(filePath)}`, { headers });
      if (!fileRes.ok) {
        res.status(fileRes.status).json({ error: `File not found or inaccessible (${fileRes.status})` });
        return;
      }
      const content = await fileRes.text();
      res.json({ content, path: filePath });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch file content.' });
    }
  });

  // 10. Logout Endpoint
  app.post('/api/auth/logout', (req, res) => {
    const sessionId = req.cookies?.gh_session;
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.clearCookie('gh_session', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
    res.json({ success: true });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
