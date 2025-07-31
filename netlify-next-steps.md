# Netlify Next Steps

## ✅ What We've Done

1. Created a feature branch called `astro-site`
2. Moved the Astro site to the root directory
3. Pushed the branch to GitHub

## 🚀 What You Need to Do in Netlify

### 1. Enable Branch Deploys
1. Go to your [Netlify dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
4. Find **Branch deploys** section
5. Click **Edit settings**
6. Add `astro-site` to the list of branches
7. Click **Save**

### 2. Wait for Build
- Netlify will automatically detect the new branch and start building
- You'll get a preview URL like: `astro-site--[your-site-name].netlify.app`
- The build should take 2-3 minutes

### 3. Test the Preview Site
Once built, check:
- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] All service pages load
- [ ] Complete Guide page displays properly
- [ ] Mobile responsive design works
- [ ] Page speed is good

### 4. View Build Logs
If there are any issues:
1. Go to **Deploys** tab in Netlify
2. Click on the `astro-site` branch deploy
3. View the build logs for any errors

## 🎯 Current Preview URLs

Once Netlify builds, you'll have:
- **Production (React)**: `[your-site-name].netlify.app` 
- **Preview (Astro)**: `astro-site--[your-site-name].netlify.app`

## ✅ When Ready to Go Live

After testing the preview site, you can merge to production:

```bash
# In your terminal
git checkout main
git merge astro-site
git push origin main
```

Or create a Pull Request on GitHub for review.

## 🔧 Troubleshooting

### If Build Fails:
1. Check Node version (needs 18+)
2. Verify build command is `npm run build`
3. Ensure publish directory is `dist`

### To Add Environment Variables:
1. Go to **Site settings** → **Environment variables**
2. Add any needed variables
3. Trigger a new deploy

## 📱 Share Preview for Feedback

The preview URL is perfect for:
- Getting team approval
- Testing on different devices
- SEO validation tools
- Performance testing

## Need Help?

- Check build logs in Netlify
- Review the `astro-migration-guide.md` for more details
- The site is safely on a separate branch, so no risk to production!