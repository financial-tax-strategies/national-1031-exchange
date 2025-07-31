// Dynamic sitemap generation for National 1031 Center
export async function GET() {
  const baseUrl = 'https://national1031center.com';
  
  // Define all pages with their priorities and change frequencies
  const pages = [
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
    { url: '/timeline', priority: '0.7', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'weekly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    
    // Location pages (major states)
    { url: '/locations', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/california', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/texas', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/florida', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/new-york', priority: '0.8', changefreq: 'monthly' },
    { url: '/locations/illinois', priority: '0.7', changefreq: 'monthly' },
    { url: '/locations/arizona', priority: '0.7', changefreq: 'monthly' },
    
    // Legal pages
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
  ];
  
  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
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