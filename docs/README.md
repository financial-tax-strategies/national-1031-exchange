# National 1031 Center Documentation

Welcome to the National 1031 Center technical documentation. This repository contains comprehensive guides for all aspects of the website and its integrations.

## 📚 Documentation Index

### Core Documentation
- [Analytics Implementation](./ANALYTICS.md) - Google Analytics 4 and Tag Manager setup

### HighLevel CRM Integration
Complete documentation for the appointment booking system integration:

**⚠️ IMPORTANT: [Environment Variables Setup](./HIGHLEVEL_ENV_SETUP.md)** - **Start here!**
   - Required environment variables configuration
   - How to obtain API keys and IDs
   - Common configuration errors and solutions

**🚀 [Netlify Deployment Guide](./NETLIFY_DEPLOYMENT.md)** - **Essential for Production!**
   - How to deploy environment variables securely
   - Step-by-step Netlify configuration
   - Security best practices and warnings

1. **[HighLevel Integration Overview](./HIGHLEVEL_INTEGRATION.md)**
   - Architecture overview and system design
   - Key features and capabilities
   - Data flow and security considerations

2. **[Setup Guide](./HIGHLEVEL_SETUP.md)**
   - Step-by-step installation instructions
   - Environment configuration
   - Initial setup and testing

3. **[API Reference](./HIGHLEVEL_API.md)**
   - Service class documentation
   - Method signatures and examples
   - Error handling patterns

4. **[Component Documentation](./HIGHLEVEL_COMPONENTS.md)**
   - React component usage guide
   - Props reference and examples
   - Customization and styling

5. **[Webhook Configuration](./HIGHLEVEL_WEBHOOKS.md)**
   - Edge Function setup
   - Security and verification
   - Testing and monitoring

6. **[Troubleshooting Guide](./HIGHLEVEL_TROUBLESHOOTING.md)**
   - Common issues and solutions
   - Debugging techniques
   - Recovery procedures

7. **[Booking Analytics](./HIGHLEVEL_ANALYTICS.md)**
   - Event tracking reference
   - Funnel analysis setup
   - Performance optimization

## 🚀 Quick Start

### For Developers
1. Start with the [Setup Guide](./HIGHLEVEL_SETUP.md) to configure the integration
2. Review the [API Reference](./HIGHLEVEL_API.md) for implementation details
3. Use the [Component Documentation](./HIGHLEVEL_COMPONENTS.md) for UI integration

### For Operations
1. Check the [Troubleshooting Guide](./HIGHLEVEL_TROUBLESHOOTING.md) for issue resolution
2. Monitor system health using the [Webhook Configuration](./HIGHLEVEL_WEBHOOKS.md) guide
3. Track performance with the [Analytics Guide](./HIGHLEVEL_ANALYTICS.md)

## 📊 System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Tax Calculator │────▶│ Booking Component│────▶│ HighLevel API   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │                           │
                               ▼                           ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │    Supabase DB   │◀────│ Webhook Handler │
                        └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │ Real-time Updates│
                        └──────────────────┘
```

## 🔧 Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Static Site**: Astro
- **Database**: Supabase (PostgreSQL)
- **Edge Functions**: Netlify Edge Functions
- **CRM**: HighLevel API v2
- **Analytics**: Google Analytics 4, Google Tag Manager
- **Hosting**: Netlify

## 📈 Key Features

- ✅ Seamless calculator-to-booking flow
- ✅ Real-time appointment updates
- ✅ Webhook + polling reliability
- ✅ Comprehensive error handling
- ✅ Mobile-responsive design
- ✅ Full analytics tracking
- ✅ Performance optimized

## 🛠️ Maintenance

### Daily Tasks
- Monitor webhook delivery rates
- Check appointment assignment success
- Review error logs

### Weekly Tasks
- Analyze booking funnel performance
- Clear expired cache entries
- Review API usage vs limits

### Monthly Tasks
- Update dependencies
- Rotate API keys
- Performance optimization review

## 📞 Support

### Development Issues
- Check relevant documentation section
- Review error logs in Supabase/Netlify
- Contact development team with details

### Integration Support
- **HighLevel**: API and CRM issues
- **Supabase**: Database and real-time
- **Netlify**: Deployment and Edge Functions

## 🔄 Version History

- **v1.0.0** (January 2025) - Initial HighLevel integration release
  - Complete booking flow implementation
  - Analytics tracking integration
  - Comprehensive documentation

## 📝 Contributing

When updating documentation:
1. Keep examples current with code
2. Update screenshots when UI changes
3. Test all code snippets
4. Update the version history

---

*Last Updated: January 2025*
*Documentation Version: 1.0.0*