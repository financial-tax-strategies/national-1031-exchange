# Slack + Netlify + GitHub Integration Guide

## Overview
This guide walks you through setting up automated Slack notifications for your National 1031 Center project, connecting GitHub, Netlify, and Slack for seamless team communication.

## Prerequisites
- Admin access to your Slack workspace
- Admin access to your Netlify team
- Admin access to your GitHub repository
- The Slack channel already created (e.g., #national-1031-seo)

## Part 1: Netlify → Slack Notifications

### Step 1: Access Netlify Notification Settings
1. Log in to [Netlify](https://app.netlify.com)
2. Select your site (National 1031 Center)
3. Go to **Site settings** → **Build & deploy** → **Deploy notifications**

### Step 2: Add Slack Incoming Webhook
1. Click **Add notification** → **Slack incoming webhook**
2. Choose the event type:
   - **Deploy started** - Know when builds begin
   - **Deploy succeeded** - Celebrate successful deployments
   - **Deploy failed** - Get alerted to issues immediately
   - **Deploy locked** - Track production locks
   - **Deploy unlocked** - Know when deploys resume

### Step 3: Configure Slack Webhook
1. When prompted, click **Add to Slack**
2. Choose your workspace
3. Select the channel (#national-1031-seo)
4. Click **Add Incoming WebHooks Integration**
5. Copy the Webhook URL provided by Slack
6. Paste it back into Netlify's webhook URL field
7. Click **Save**

### Recommended Netlify Notifications:
```
✅ Deploy succeeded → #national-1031-seo
❌ Deploy failed → #national-1031-seo (with @channel mention)
🔨 Deploy preview ready → #national-1031-dev
📝 Form submission → #national-1031-leads
⚡ Function invocation error → #national-1031-dev
```

## Part 2: GitHub → Slack Notifications

### Step 1: Install GitHub Slack App
1. Go to your Slack workspace
2. Click **Apps** → Search for **GitHub**
3. Click **Add to Slack**
4. Authorize GitHub to access your workspace

### Step 2: Connect Repository
In Slack, type:
```
/github subscribe owner/repository
```
Example:
```
/github subscribe matthewdnye/national-1031-exchange
```

### Step 3: Customize Notifications
Choose what events to receive:
```
/github subscribe owner/repository issues pulls commits releases deployments reviews comments
```

Or unsubscribe from specific events:
```
/github unsubscribe owner/repository issues
```

### Recommended GitHub Notifications:
```
✅ Pull requests (reviews needed)
✅ Commits to main branch
✅ Issue creation/closing
✅ Deployment status
❌ Individual comments (too noisy)
```

## Part 3: Form Submissions → Slack

### Step 1: Set Up Netlify Forms
1. In Netlify dashboard → **Forms** → **Form notifications**
2. Click **Add notification** → **Slack incoming webhook**
3. Use the same webhook URL from Part 1
4. Configure message format

### Step 2: Customize Form Notification
Example webhook payload:
```json
{
  "text": "New 1031 Exchange Lead! 🎉",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Name:* {{name}}\n*Email:* {{email}}\n*Phone:* {{phone}}\n*Property Value:* {{property_value}}\n*Message:* {{message}}"
      }
    }
  ]
}
```

## Part 4: Performance Monitoring → Slack

### Using Netlify Analytics
1. Enable Netlify Analytics (paid feature)
2. Set up webhook for performance degradation
3. Create custom alerts for:
   - Traffic spikes (>1000 visits/hour)
   - High server error rate (>5%)
   - Slow page loads (>3s average)

### Alternative: Uptime Monitoring
1. Use a service like UptimeRobot or Pingdom
2. Add Slack integration
3. Monitor:
   - Site availability
   - Response time
   - SSL certificate expiration

## Part 5: Custom Integrations

### Build Status Badge in Slack
Add to channel topic or pinned message:
```
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)
```

### Weekly Report Automation
Using Zapier or n8n:
1. **Trigger**: Weekly schedule (Fridays 3pm)
2. **Actions**:
   - Pull Netlify Analytics
   - Pull Google Analytics
   - Format report
   - Post to Slack

## Part 6: Channel Organization

### Recommended Channel Setup
```
#national-1031-seo (Main channel)
├── Pinned: Project roadmap link
├── Pinned: Staging URL
├── Pinned: Production URL
└── Topic: Build status badge

#national-1031-dev (Technical)
├── Deploy previews
├── Build errors
└── Function logs

#national-1031-content (Content team)
├── Content calendar
├── Publishing notifications
└── SEO updates

#national-1031-leads (Sales)
├── Form submissions
├── Lead quality alerts
└── Conversion tracking
```

## Part 7: Notification Best Practices

### Do's ✅
- Use thread replies for detailed discussions
- Set up different notification levels per channel
- Use @here sparingly, @channel only for emergencies
- Include preview URLs in deploy notifications
- Add context to error messages

### Don'ts ❌
- Don't flood channels with every commit
- Don't send sensitive data (use secure links)
- Don't ignore failed build notifications
- Don't duplicate notifications across tools

## Troubleshooting

### Common Issues:

**1. Webhook not working**
- Verify webhook URL is correct
- Check Slack app permissions
- Ensure channel is public or bot is invited

**2. Too many notifications**
- Adjust GitHub subscription settings
- Filter Netlify notifications by type
- Use different channels for different priorities

**3. Missing notifications**
- Check Netlify notification settings
- Verify GitHub webhook is active
- Ensure Slack app is not disabled

## Security Considerations

1. **Webhook URLs are sensitive** - Don't commit to public repos
2. **Use environment variables** for any API keys
3. **Rotate webhooks** if team members leave
4. **Limit channel access** to relevant team members
5. **Don't expose** customer PII in notifications

## Next Steps

1. Set up basic deploy notifications first
2. Add form notifications once forms are live
3. Configure GitHub notifications for active development
4. Add performance monitoring as traffic grows
5. Customize based on team feedback

## Quick Reference

### Netlify Webhook Events:
- `deploy-started`
- `deploy-succeeded`
- `deploy-failed`
- `submission-created`
- `split-test-activated`

### GitHub Webhook Events:
- `push`
- `pull_request`
- `issues`
- `release`
- `deployment_status`

### Useful Slack Commands:
- `/github subscribe owner/repo`
- `/github unsubscribe owner/repo`
- `/remind #channel to check deploys every Friday at 3pm`
- `/topic Build Status: [status badge]`

---

This integration will keep your entire team informed about the project's development progress, deployments, and user interactions without overwhelming them with notifications. Adjust the settings based on your team's preferences and workflow.