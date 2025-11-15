# Ocean Dance Pre-Save System - Complete Setup Guide

## 🎯 System Overview

**What it does:**
1. User clicks "Pre-Save Ocean Dance" button
2. Modal opens with 2-step process:
   - Step 1: Pre-save on Spotify
   - Step 2: Enter email to get Cyprus Sun
3. Email sent automatically with Cyprus Sun download link
4. User data stored for analytics

---

## 📋 Components Created

### Frontend Files (✅ Already added):
- `/js/presave.js` - Pre-save modal logic
- `/css/presave.css` - Modal styling
- `index.html` - Updated with script includes

### Backend (TO DO):
- Cloudflare Worker for email sending
- Resend API integration
- D1 Database for email storage

---

## 🚀 Setup Instructions

### Step 1: Create Resend Account (FREE)

**Resend** is the easiest way to send emails from Cloudflare Workers.

1. **Go to**: https://resend.com/signup
2. **Sign up** (Free: 3,000 emails/month, 100/day)
3. **Verify your domain** `tini.ai`:
   - Go to Domains → Add Domain
   - Add DNS records to Cloudflare:
     ```
     Type: TXT
     Name: resend._domainkey
     Value: [Provided by Resend]
     ```
4. **Create API Key**:
   - Go to API Keys → Create API Key
   - Copy the key (starts with `re_...`)
   - Save it securely!

### Step 2: Create Cloudflare Worker

**Option A: Using Wrangler CLI (RECOMMENDED)**

```bash
# Navigate to webapp directory
cd /home/user/webapp

# Create new worker directory
mkdir presave-api
cd presave-api

# Initialize worker
npm create cloudflare@latest -- presave-worker --type=worker

# Install dependencies
npm install resend

# Create worker code (see worker.js below)
```

**Option B: Cloudflare Dashboard (GUI)**

1. Go to: https://dash.cloudflare.com
2. Workers & Pages → Create Application → Create Worker
3. Name: `tini-presave-api`
4. Edit code (paste worker code below)

### Step 3: Worker Code

**File**: `presave-api/src/worker.js`

\`\`\`javascript
import { Resend } from 'resend';

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS request (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    try {
      // Parse request body
      const { email, timestamp, source } = await request.json();

      if (!email || !email.includes('@')) {
        return new Response(JSON.stringify({ error: 'Invalid email' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Initialize Resend
      const resend = new Resend(env.RESEND_API_KEY);

      // Send Cyprus Sun email
      const data = await resend.emails.send({
        from: 'TINI <hello@tini.ai>',
        to: [email],
        subject: '🎵 Your Cyprus Sun Bonus Track is Here!',
        html: \`
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .button {
            display: inline-block;
            background: #1DB954;
            color: white;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌊 Thank You for Pre-Saving!</h1>
    </div>
    <div class="content">
        <h2>Your Cyprus Sun Bonus Track 🎵</h2>
        <p>Hey there!</p>
        <p>Thank you SO much for pre-saving <strong>Ocean Dance</strong> on Spotify! 🎉</p>
        <p>As promised, here's your exclusive bonus track <strong>"Cyprus Sun"</strong> - a Mediterranean summer vibe created just for early supporters like you!</p>
        
        <div style="text-align: center;">
            <a href="https://tini.ai/audio/cyprus-sun-bonus-HQ.mp3" class="button">
                ⬇️ Download Cyprus Sun (320kbps MP3)
            </a>
        </div>

        <h3>What happens next?</h3>
        <ul>
            <li>✅ Ocean Dance will be automatically added to your Spotify library on <strong>December 6, 2025</strong></li>
            <li>✅ You'll receive a reminder email on release day</li>
            <li>✅ You're now part of the TINI Records family!</li>
        </ul>

        <p>Can't wait to share Ocean Dance with you! 🌊💃</p>
        <p>Much love,<br><strong>TINI</strong></p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
            P.S. Follow me on <a href="https://instagram.com/tini.aii" style="color: #667eea;">Instagram @tini.aii</a> for behind-the-scenes content!
        </p>
    </div>
    <div class="footer">
        <p>&copy; 2025 TINI • Dance & Joy from Cyprus</p>
        <p><a href="https://tini.ai" style="color: #999;">tini.ai</a></p>
    </div>
</body>
</html>
        \`,
      });

      // Store email in D1 database (optional)
      if (env.DB) {
        await env.DB.prepare(
          'INSERT INTO presaves (email, timestamp, source, resend_id) VALUES (?, ?, ?, ?)'
        ).bind(email, timestamp, source, data.id).run();
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Email sent successfully' 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
\`\`\`

### Step 4: Configure Worker

**File**: `presave-api/wrangler.toml`

\`\`\`toml
name = "tini-presave-api"
main = "src/worker.js"
compatibility_date = "2024-01-01"

# Environment variables (secrets)
[vars]
# RESEND_API_KEY will be added as secret

# Optional: D1 Database for storing emails
[[d1_databases]]
binding = "DB"
database_name = "tini-presaves"
database_id = "YOUR_DATABASE_ID"
\`\`\`

### Step 5: Set Resend API Key as Secret

\`\`\`bash
cd presave-api
wrangler secret put RESEND_API_KEY
# Paste your Resend API key when prompted
\`\`\`

### Step 6: Deploy Worker

\`\`\`bash
cd presave-api
wrangler deploy
\`\`\`

You'll get a URL like:
\`\`\`
https://tini-presave-api.pascal.workers.dev
\`\`\`

### Step 7: Update Frontend API Endpoint

**File**: `/js/presave.js` (line 6)

Change:
\`\`\`javascript
this.apiEndpoint = 'https://tini-presave-api.pascal-workers.workers.dev/api/presave';
\`\`\`

To your actual worker URL.

---

## 🎵 Cyprus Sun High-Quality File

Create a high-quality version of Cyprus Sun:

\`\`\`bash
cd /home/user/webapp/audio

# Convert to 320kbps MP3 (High Quality)
ffmpeg -i cyprus-sun-bonus-track-MASTER.wav -codec:a libmp3lame -b:a 320k cyprus-sun-bonus-HQ.mp3
\`\`\`

This file will be linked in the email for download.

---

## 🔒 Optional: D1 Database Setup

If you want to store emails in a database:

\`\`\`bash
# Create D1 database
wrangler d1 create tini-presaves

# Create table
wrangler d1 execute tini-presaves --command="
CREATE TABLE presaves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  source TEXT,
  resend_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
"
\`\`\`

---

## ✅ Testing the System

1. **Deploy all files** to tini.ai
2. **Visit** https://tini.ai
3. **Click** "Pre-Save on Spotify" button
4. **Modal opens** → Follow steps
5. **Enter test email** (your own email)
6. **Check inbox** for Cyprus Sun email

---

## 📊 Analytics (Optional)

Add Google Analytics tracking to presave.js:

\`\`\`javascript
// In showSuccess() function
gtag('event', 'presave_complete', {
  'event_category': 'music',
  'event_label': 'ocean_dance'
});
\`\`\`

---

## 💰 Costs Breakdown

### Resend (Email):
- **Free tier**: 3,000 emails/month, 100/day
- **Paid**: $20/month for 50,000 emails
- **For Ocean Dance**: FREE (unless you get 3000+ pre-saves!)

### Cloudflare Workers:
- **Free tier**: 100,000 requests/day
- **Paid**: $5/month for 10M requests
- **For Ocean Dance**: FREE

### Cloudflare D1 (Database):
- **Free tier**: 5GB storage, 5M reads/day
- **For Ocean Dance**: FREE

**Total cost: $0** 🎉

---

## 🎯 Timeline

**Now - Nov 24:**
- ✅ Frontend files added
- ⏳ Set up Resend account
- ⏳ Create Cloudflare Worker
- ⏳ Deploy and test

**Nov 25:**
- 🚀 Launch pre-save campaign
- 📧 Emails start sending automatically

**Dec 6:**
- 🎵 Ocean Dance releases on Spotify
- 📈 Track conversions and analytics

---

## 🆘 Troubleshooting

**Email not sending?**
- Check Resend API key is set correctly
- Verify domain is verified in Resend
- Check worker logs: `wrangler tail`

**Modal not opening?**
- Check browser console for errors
- Verify presave.js is loaded
- Check CORS settings

**Need help?**
- Contact hello@tini.ai
- Check Resend docs: https://resend.com/docs
- Check Cloudflare docs: https://developers.cloudflare.com/workers

---

**Created by**: Claude (AI Assistant)  
**Date**: November 15, 2025  
**For**: TINI - Ocean Dance Pre-Save Campaign

Let's make this launch amazing! 🎵🚀
