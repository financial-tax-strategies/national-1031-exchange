# The 1031 Center

[![CI/CD Pipeline](https://github.com/matthewdnye/national-1031-exchange/actions/workflows/ci.yml/badge.svg)](https://github.com/matthewdnye/national-1031-exchange/actions/workflows/ci.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)

America's most trusted 1031 exchange qualified intermediary website, built with Astro for optimal performance and SEO.

_Last updated: January 31, 2025_

## 🚀 Features

- **SEO/AEO Optimized**: Built for both search engines and AI answer engines
- **Tax Savings Calculator**: Interactive calculator with lead capture
- **Comprehensive Guides**: 4000+ word pillar content on 1031 exchanges
- **Service Pages**: Detailed pages for all exchange types
- **Performance First**: Sub-3 second load times with Core Web Vitals optimization
- **Lead Generation**: HighLevel CRM integration for automated lead capture

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) with TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Netlify with edge functions
- **CRM**: HighLevel (GoHighLevel) integration
- **Analytics**: Google Analytics 4

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Netlify CLI (optional)
- HighLevel API credentials (for lead capture)

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/matthewdnye/national-1031-exchange.git
   cd national-1031-exchange
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your credentials:
   ```
   HIGHLEVEL_API_KEY=your-api-key
   HIGHLEVEL_LOCATION_ID=your-location-id
   GA_MEASUREMENT_ID=your-ga-id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
national-1031-exchange/
├── src/
│   ├── components/       # Reusable components
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route pages
│   ├── lib/            # Utilities and calculations
│   └── styles/         # Global styles
├── public/             # Static assets
├── netlify/
│   └── functions/      # Serverless functions
└── dist/              # Build output
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro check` - TypeScript checking

## 🚢 Deployment

The site automatically deploys to Netlify on push to main branch.

### Manual Deployment
```bash
netlify deploy --prod
```

## 🔒 Security

- All forms use Netlify's built-in spam protection
- API keys stored in environment variables
- Regular dependency updates via Dependabot
- Security scanning with npm audit

## 📈 Performance

- Lighthouse scores: 95+ across all metrics
- Core Web Vitals: All green
- Page load: < 3 seconds on 3G
- Time to Interactive: < 2 seconds

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and build
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

For support, email support@national1031center.com or call 1-800-1031-TAX.

---

Built with ❤️ by National 1031 Center
