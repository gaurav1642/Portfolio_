import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { connectToDatabase, db } from './server/db';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';

dotenv.config();

// ----------------------------------------------------
// SECURE NODEMAILER SMTP RELAY IMPLEMENTATION
// ----------------------------------------------------
async function sendOutboundReplyEmail(toEmail: string, senderName: string, originalSubject: string, originalMessage: string, replyBody: string): Promise<{ success: boolean; error?: string }> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || 'portfolio@localhost';

  if (!host || !user || !pass) {
    console.log('Nodemailer SMTP is not configured in environment secrets.');
    return { success: false, error: 'SMTP_NOT_CONFIGURED' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports (587)
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const emailHtmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Response to your inquiry - Gaurav Kumar</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #070b13;
            color: #d1d5db;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #111625;
            border: 1px solid rgba(148, 163, 184, 0.1);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
          }
          .header {
            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          .header h2 {
            margin: 0;
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .salutation {
            font-size: 16px;
            font-weight: 600;
            color: #22d3ee;
            margin-bottom: 12px;
          }
          .reply-text {
            font-size: 14.5px;
            line-height: 1.6;
            color: #f3f4f6;
            background-color: #070b13;
            border-left: 3px solid #22d3ee;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 28px;
            white-space: pre-line;
          }
          .history-label {
            font-size: 11px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1px;
            color: #a78bfa;
            margin-bottom: 8px;
            display: block;
          }
          .original-box {
            font-size: 12.5px;
            line-height: 1.5;
            color: #6b7280;
            border-top: 1px solid rgba(148, 163, 184, 0.1);
            padding-top: 16px;
            margin-top: 24px;
          }
          .footer {
            margin-top: 36px;
            border-top: 1px solid rgba(148, 163, 184, 0.1);
            padding-top: 16px;
            font-size: 11px;
            color: #4b5563;
            text-align: center;
          }
          .footer a {
            color: #22d3ee;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Gaurav Kumar &mdash; Inquiry Response</h2>
          </div>
          <div class="salutation">Hi ${senderName},</div>
          <p style="margin-top: 0; font-size: 13.5px; color: #9ca3af;">Thank you for getting in touch. I am writing back regarding the inquiry filed on my digital portfolio.</p>
          
          <div class="reply-text">
            ${replyBody}
          </div>

          <p style="font-size: 13.5px; color: #d1d5db; margin-bottom: 0;">Warm regards,</p>
          <p style="font-weight: 700; color: #ffffff; margin-top: 4px; font-size: 15px;">Gaurav Kumar</p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: -8px;">Full-Stack Developer &amp; Software Engineer</p>

          <div class="original-box">
            <span class="history-label">Original Submission Hook</span>
            <p style="margin: 4px 0;"><strong>Reason/Subject:</strong> ${originalSubject}</p>
            <p style="margin: 4px 0; font-style: italic;">"${originalMessage}"</p>
          </div>

          <div class="footer">
            Securely routed via <a href="https://ais-pre-omcz34r2vp5dbmubneujwr-954504865512.asia-southeast1.run.app">Gaurav's Digital Portfolio Platform</a>.
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${from === user ? 'Gaurav Kumar' : from}" <${from}>`,
      to: toEmail,
      subject: `Re: ${originalSubject}`,
      text: `Hi ${senderName},\n\nI am writing back regarding your message "${originalSubject}":\n\n${replyBody}\n\nBest regards,\nGaurav Kumar\nFull-Stack Developer & Software Engineer`,
      html: emailHtmlBody
    });

    console.log(`Successfully dispatched reply email via SMTP to: ${toEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error('Nodemailer SMTP delivery error:', error);
    return { success: false, error: error.message };
  }
}

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration secrets (with robust fallbacks)
const JWT_SECRET = process.env.JWT_SECRET || 'cyber_portfolio_secure_secret_hash_2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword123';
console.log('SERVER STARTUP - ADMIN_USERNAME:', JSON.stringify(ADMIN_USERNAME));
console.log('SERVER STARTUP - ADMIN_PASSWORD:', JSON.stringify(ADMIN_PASSWORD));
try {
  fs.writeFileSync('server_debug_env.txt', `ADMIN_USERNAME=${ADMIN_USERNAME}\nADMIN_PASSWORD=${ADMIN_PASSWORD}\n`, 'utf-8');
} catch (e) {}

// ----------------------------------------------------
// SECURE DIRECT JWT IMPLEMENTATION (Zero-dependency, 100% robust)
// ----------------------------------------------------
function signToken(payload: { username: string; exp: number }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const signatureInput = `${base64Header}.${base64Payload}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64url');
  
  return `${signatureInput}.${signature}`;
}

function verifyToken(token: string): { username: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerB64, payloadB64, signature] = parts;
    const signatureInput = `${headerB64}.${payloadB64}`;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(signatureInput)
      .digest('base64url');
    
    if (signature !== expectedSignature) return null;
    
    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload = JSON.parse(payloadStr);
    
    if (payload.exp && Date.now() > payload.exp) {
      console.log('Token verification failed: Token is expired.');
      return null;
    }
    
    return payload;
  } catch (err) {
    console.error('JWT Token Verification Error:', err);
    return null;
  }
}

// Admin Authorization Middleware
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Authorization token missing or invalid.' });
  }
  
  const token = authHeader.split(' ')[1];
  const adminPayload = verifyToken(token);
  if (!adminPayload) {
    return res.status(403).json({ error: 'Session expired or authentication failed. Please log in again.' });
  }
  
  // Attach user identity
  (req as any).adminUser = adminPayload.username;
  next();
}

async function initializeApp() {
  // Connect database (either MongoDB Atlas or localized JSON system fallback)
  await connectToDatabase();

  // ----------------------------------------------------
  // AUTHENTICATION CONTROLLERS
  // ----------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required fields.' });
    }
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create session valid for 4 hours
      const expirations = Date.now() + 4 * 60 * 60 * 1000; 
      const token = signToken({ username, exp: expirations });
      
      return res.json({
        success: true,
        token,
        username,
        expiresIn: '4h'
      });
    }
    
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  });

  // Verify token endpoint
  app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ valid: false });
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    return res.json({ valid: !!payload, user: payload ? payload.username : null });
  });

  // ----------------------------------------------------
  // PROJECTS ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await db.getProjects();
      res.json(projects);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve project listings.', details: err.message });
    }
  });

  app.post('/api/projects', authenticateAdmin, async (req, res) => {
    try {
      const { title, description, features, techStack, category, liveUrl, githubUrl, iconType } = req.body;
      if (!title || !description || !category) {
        return res.status(400).json({ error: 'Missing key fields: title, description, or category are required.' });
      }
      
      const newProj = await db.createProject({
        title,
        description,
        features: Array.isArray(features) ? features : [],
        techStack: Array.isArray(techStack) ? techStack : [],
        category,
        liveUrl: liveUrl || '#',
        githubUrl: githubUrl || '#',
        iconType: iconType || 'globe'
      });
      
      res.status(214).json({ success: true, project: newProj });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create project entry.', details: err.message });
    }
  });

  app.put('/api/projects/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updateProject(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Project listing not found.' });
      }
      res.json({ success: true, project: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update project details.', details: err.message });
    }
  });

  app.delete('/api/projects/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await db.deleteProject(id);
      if (!success) {
        return res.status(404).json({ error: 'Project listing not found.' });
      }
      res.json({ success: true, message: 'Project successfully removed.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete project.', details: err.message });
    }
  });

  // ----------------------------------------------------
  // ----------------------------------------------------
  // EXPERIENCES ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/experiences', async (req, res) => {
    try {
      const exps = await db.getExperiences();
      res.json(exps);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve professional experiences.', details: err.message });
    }
  });

  app.post('/api/experiences', authenticateAdmin, async (req, res) => {
    try {
      const { role, organization, duration, highlights, type, badge } = req.body;
      if (!role || !organization || !duration || !type) {
        return res.status(400).json({ error: 'Missing key fields: role, organization, duration, or type are required.' });
      }

      const newExp = await db.createExperience({
        role,
        organization,
        duration,
        highlights: Array.isArray(highlights) ? highlights : [],
        type,
        badge: badge || ''
      });

      res.status(201).json({ success: true, experience: newExp });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create experience entry.', details: err.message });
    }
  });

  app.put('/api/experiences/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updateExperience(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Experience entry not found.' });
      }
      res.json({ success: true, experience: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update experience details.', details: err.message });
    }
  });

  app.delete('/api/experiences/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await db.deleteExperience(id);
      if (!success) {
        return res.status(404).json({ error: 'Experience entry not found.' });
      }
      res.json({ success: true, message: 'Experience entry successfully removed.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete experience.', details: err.message });
    }
  });

  // ----------------------------------------------------
  // SKILLS ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/skills', async (req, res) => {
    try {
      const skills = await db.getSkills();
      res.json(skills);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve skills.', details: err.message });
    }
  });

  app.post('/api/skills', authenticateAdmin, async (req, res) => {
    try {
      const { name, category, proficiency } = req.body;
      if (!name || !category || typeof proficiency !== 'number') {
        return res.status(400).json({ error: 'Missing fields: name, category, or proficiency index are required.' });
      }

      const newSkill = await db.createSkill({ name, category, proficiency });
      res.status(201).json({ success: true, skill: newSkill });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to build skill record.', details: err.message });
    }
  });

  app.put('/api/skills/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, proficiency } = req.body;

      // Handle proficiency slider specifically if nothing else is provided
      if (typeof proficiency === 'number' && !name && !category) {
        if (proficiency < 0 || proficiency > 100) {
          return res.status(400).json({ error: 'Proficiency must be a valid percentage value between 0 and 100.' });
        }
        const updated = await db.updateSkillProficiency(id, proficiency);
        if (!updated) {
          return res.status(404).json({ error: 'Skill item not found.' });
        }
        return res.json({ success: true, skill: updated });
      }

      const updated = await db.updateSkill(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Skill item not found.' });
      }
      res.json({ success: true, skill: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update skill details.', details: err.message });
    }
  });

  app.delete('/api/skills/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await db.deleteSkill(id);
      if (!success) {
        return res.status(404).json({ error: 'Skill item not found.' });
      }
      res.json({ success: true, message: 'Skill successfully removed.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to remove skill item.', details: err.message });
    }
  });

  // ----------------------------------------------------
  // EDUCATION ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/education', async (req, res) => {
    try {
      const edu = await db.getEducationEntries();
      res.json(edu);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve education history.', details: err.message });
    }
  });

  app.post('/api/education', authenticateAdmin, async (req, res) => {
    try {
      const { institution, degree, duration, concentration, badge } = req.body;
      if (!institution || !degree || !duration || !concentration) {
        return res.status(400).json({ error: 'Missing education fields: institution, degree, duration, and concentration are required.' });
      }

      const newEdu = await db.createEducationEntry({ institution, degree, duration, concentration, badge });
      res.status(201).json({ success: true, education: newEdu });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create education entry.', details: err.message });
    }
  });

  app.put('/api/education/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.updateEducationEntry(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Education entry not found.' });
      }
      res.json({ success: true, education: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update education entry.', details: err.message });
    }
  });

  app.delete('/api/education/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await db.deleteEducationEntry(id);
      if (!success) {
        return res.status(404).json({ error: 'Education entry not found.' });
      }
      res.json({ success: true, message: 'Education entry successfully removed.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete education entry.', details: err.message });
    }
  });

  // ----------------------------------------------------
  // PROFILE BIO ENDPOINTS
  // ----------------------------------------------------
  app.get('/api/profile-bio', async (req, res) => {
    try {
      const bio = await db.getProfileBio();
      res.json(bio);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch profile biography.', details: err.message });
    }
  });

  app.put('/api/profile-bio', authenticateAdmin, async (req, res) => {
    try {
      const updated = await db.updateProfileBio(req.body);
      res.json({ success: true, profileBio: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update profile details.', details: err.message });
    }
  });

  // ----------------------------------------------------
  // CONTACT MESSAGES ENDPOINTS
  // ----------------------------------------------------
  app.post('/api/messages', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All core input fields are required (name, email, subject, and message).' });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please submit a valid email address.' });
      }
      
      const savedMsg = await db.createMessage({ name, email, subject, message });
      res.status(201).json({ success: true, message: 'Your message has been received! I will reach out shortly.', item: savedMsg });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to deliver your inquiry.', details: err.message });
    }
  });

  app.get('/api/messages', authenticateAdmin, async (req, res) => {
    try {
      const messages = await db.getMessages();
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch incoming messages.', details: err.message });
    }
  });

  app.delete('/api/messages/:id', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await db.deleteMessage(id);
      if (!success) {
        return res.status(404).json({ error: 'Message not found.' });
      }
      res.json({ success: true, message: 'Message successfully archived.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to archive message.', details: err.message });
    }
  });

  app.post('/api/messages/:id/reply', authenticateAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { replyText } = req.body;
      if (!replyText || replyText.trim() === '') {
        return res.status(400).json({ error: 'Reply text cannot be empty.' });
      }

      const updated = await db.replyToMessage(id, replyText);
      if (!updated) {
        return res.status(404).json({ error: 'Message not found to submit a reply.' });
      }

      // Try sending actual outbound email via SMTP Relaying
      const emailResult = await sendOutboundReplyEmail(
        updated.email,
        updated.name,
        updated.subject,
        updated.message,
        replyText
      );

      if (emailResult.success) {
        return res.json({ 
          success: true, 
          message: 'Reply recorded and email successfully dispatched to the user!', 
          emailSent: true, 
          item: updated 
        });
      } else if (emailResult.error === 'SMTP_NOT_CONFIGURED') {
        return res.json({ 
          success: true, 
          message: 'Reply logged to database! To automatically send out actual emails when replying, please configure your SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS, etc.) in the platform Settings Secrets.', 
          emailSent: false, 
          smtpNotConfigured: true, 
          item: updated 
        });
      } else {
        return res.json({ 
          success: true, 
          message: `Reply logged to database, but SMTP delivery failed: ${emailResult.error}. Please inspect your SMTP server credentials.`, 
          emailSent: false, 
          emailError: emailResult.error, 
          item: updated 
        });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record reply.', details: err.message });
    }
  });

  // ----------------------------------------------------
  // VITE ENGINE INTEGRATION & CLIENT FRONTEND SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite routing adapter mounted for active development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static asset pipelines active.');
  }

  // Bind and listen explicitly required by sandboxed container requirements
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio Server running at http://localhost:${PORT} (and http://0.0.0.0:${PORT}) in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

initializeApp().catch(err => {
  console.error('Critical failure during server bootstrapping:', err);
});
