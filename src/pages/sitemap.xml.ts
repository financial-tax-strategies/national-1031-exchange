// Dynamic sitemap generation for The 1031 Center
export async function GET() {
  const baseUrl = 'https://the1031center.com';
  
  // Pages to exclude from sitemap
  const excludedPaths = [
    '/admin',
    '/thank-you',
    '/404',
    '/_netlify',
    '/api',
    '/login'
  ];
  
  // Define all static pages
  const staticPages = [
    // High priority pages
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/complete-guide-1031-exchanges', priority: '1.0', changefreq: 'weekly' },
    { url: '/calculator', priority: '0.9', changefreq: 'monthly' },
    { url: '/contact', priority: '0.9', changefreq: 'monthly' },
    
    // Service pages
    { url: '/services/delayed-exchange', priority: '0.9', changefreq: 'monthly' },
    { url: '/services/reverse-exchange', priority: '0.9', changefreq: 'monthly' },
    { url: '/services/improvement-exchange', priority: '0.9', changefreq: 'monthly' },
    { url: '/services/partial-exchange', priority: '0.9', changefreq: 'monthly' },
    
    // Information pages
    { url: '/how-it-works', priority: '0.8', changefreq: 'monthly' },
    { url: '/timeline-calculator', priority: '0.8', changefreq: 'monthly' },
    { url: '/1031-exchange-timeline', priority: '0.8', changefreq: 'monthly' },
    { url: '/1031-exchange-rules', priority: '0.8', changefreq: 'monthly' },
    { url: '/types-of-1031-exchanges', priority: '0.8', changefreq: 'monthly' },
    { url: '/choosing-qualified-intermediary', priority: '0.8', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'weekly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/team', priority: '0.7', changefreq: 'monthly' },
    { url: '/testimonials', priority: '0.7', changefreq: 'weekly' },
    { url: '/trust-security', priority: '0.7', changefreq: 'monthly' },
    { url: '/comparisons', priority: '0.7', changefreq: 'monthly' },
    { url: '/start-exchange', priority: '0.9', changefreq: 'monthly' },
    { url: '/schedule', priority: '0.8', changefreq: 'monthly' },
    
    // Hub pages
    { url: '/property-types', priority: '0.8', changefreq: 'weekly' },
    { url: '/scenarios', priority: '0.8', changefreq: 'weekly' },
    
    // Location pages (all 50 states)
    { url: '/locations', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/alabama', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/alaska', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/arizona', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/arkansas', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/california', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/colorado', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/connecticut', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/delaware', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/florida', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/georgia', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/hawaii', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/idaho', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/illinois', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/indiana', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/iowa', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/kansas', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/kentucky', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/louisiana', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/maine', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/maryland', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/massachusetts', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/michigan', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/minnesota', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/mississippi', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/missouri', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/montana', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/nebraska', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/nevada', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/new-hampshire', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/new-jersey', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/new-mexico', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/new-york', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/north-carolina', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/north-dakota', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/ohio', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/oklahoma', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/oregon', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/pennsylvania', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/rhode-island', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/south-carolina', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/south-dakota', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/tennessee', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/texas', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/utah', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/vermont', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/virginia', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/washington', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/west-virginia', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/wisconsin', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/wyoming', priority: '0.7', changefreq: 'monthly' },
    
    // Legal pages
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
  ];

  // Define dynamic property type pages
  const propertyTypes = [
    'residential-rental', 'commercial-real-estate', 'multi-family', 'industrial-properties',
    'land-investments', 'retail-properties', 'hospitality-properties', 'office-buildings',
    'self-storage', 'mobile-home-parks', 'medical-properties', 'mixed-use',
    'agricultural', 'senior-housing', 'student-housing', 'data-centers',
    'parking-facilities', 'manufactured-housing', 'specialty-properties', 'vacation-rentals'
  ];
  
  const propertyTypePages = propertyTypes.map(type => ({
    url: `/property-types/${type}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  // Define dynamic scenario pages
  const scenarios = [
    'exchange-multiple-properties', 'exchange-into-different-state', 'exchange-with-mortgage',
    'exchange-rental-to-primary-residence', 'exchange-inherited-property', 'exchange-partnership-property',
    'exchange-vacant-land', 'exchange-foreign-property', 'exchange-to-retire',
    'emergency-exchange', 'exchange-business-property', 'exchange-to-downsize',
    'exchange-with-partners', 'exchange-development-property', 'exchange-mixed-use-property',
    'exchange-franchise-property', 'exchange-partial-interest', 'exchange-hotel-property',
    'exchange-senior-housing', 'exchange-industrial-property', 'exchange-self-storage',
    'exchange-mobile-home-park', 'exchange-parking-facilities', 'exchange-agricultural-property',
    'exchange-retail-property', 'exchange-office-building', 'exchange-student-housing',
    'exchange-medical-property', 'exchange-data-center', 'exchange-dst-investment'
  ];
  
  const scenarioPages = scenarios.map(scenario => ({
    url: `/scenarios/${scenario}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  // Define dynamic competitor comparison pages
  const competitors = [
    'ipx1031', 'asset-preservation', 'exeter-1031', 'chicago-deferred-exchange',
    'first-american-exchange', 'realty-exchange-corporation', 'republic-1031',
    'strategic-property-exchanges', 'vantage-1031', 'madison-1031',
    'equity-advantage', 'crestcore-realty', 'jct-1031', 'api-1031', 'accruit'
  ];
  
  const competitorPages = competitors.map(competitor => ({
    url: `/comparisons/${competitor}`,
    priority: '0.6',
    changefreq: 'monthly'
  }));

  // Combine all pages
  const pages = [
    ...staticPages,
    ...propertyTypePages,
    ...scenarioPages,
    ...competitorPages
  ];
  
  // Filter out excluded pages
  const filteredPages = pages.filter(page => {
    return !excludedPaths.some(excluded => 
      page.url.startsWith(excluded) || 
      page.url === excluded
    );
  });
  
  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${filteredPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}