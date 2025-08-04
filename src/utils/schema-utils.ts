/**
 * Schema.org JSON-LD utilities for safe and valid schema generation
 * Prevents common issues like template literal interpolation and improper escaping
 */

/**
 * Safely encode a value for JSON-LD, handling all data types properly
 */
export function safeJsonEncode(value: any): any {
  if (value === null || value === undefined) {
    return null;
  }
  
  if (typeof value === 'string') {
    // Escape quotes and backslashes for safe JSON embedding
    return value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }
  
  if (typeof value === 'number') {
    // Ensure numbers are actual numbers, not strings
    return isNaN(value) ? null : value;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (Array.isArray(value)) {
    // Recursively encode array elements
    return value.map(item => safeJsonEncode(item)).filter(item => item !== null);
  }
  
  if (typeof value === 'object') {
    // Recursively encode object properties
    const encoded: any = {};
    for (const [key, val] of Object.entries(value)) {
      const encodedValue = safeJsonEncode(val);
      if (encodedValue !== null && encodedValue !== '') {
        encoded[key] = encodedValue;
      }
    }
    return encoded;
  }
  
  return null;
}

/**
 * Generate valid JSON-LD script content from schema object
 */
export function generateJsonLdScript(schema: any): string {
  // Ensure proper encoding of the entire schema
  const encodedSchema = safeJsonEncode(schema);
  
  // Convert to JSON with proper formatting
  const jsonString = JSON.stringify(encodedSchema, null, 2);
  
  return jsonString;
}

/**
 * Common schema generators with proper type safety
 */

export interface RatingSchema {
  '@type': 'Rating' | 'AggregateRating';
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
  ratingCount?: number;
  reviewCount?: number;
}

export function createRatingSchema(
  value: number,
  type: 'Rating' | 'AggregateRating' = 'Rating',
  count?: number
): RatingSchema {
  const schema: RatingSchema = {
    '@type': type,
    ratingValue: Number(value), // Ensure it's a number
    bestRating: 5,
    worstRating: 1
  };
  
  if (type === 'AggregateRating' && count) {
    schema.reviewCount = count;
  }
  
  return schema;
}

export interface PersonSchema {
  '@type': 'Person';
  '@id'?: string;
  name: string;
  jobTitle?: string;
  image?: string;
  description?: string;
  email?: string;
  sameAs?: string | string[];
  alumniOf?: any[];
  hasCredential?: any[];
  knowsAbout?: string[];
  worksFor?: any;
  author?: any[];
  address?: any;
}

export function createPersonSchema(person: {
  id?: string;
  name: string;
  title?: string;
  image?: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  education?: string[];
  certifications?: string[];
  specialties?: string[];
  publications?: string[];
  location?: string;
}): PersonSchema {
  const schema: PersonSchema = {
    '@type': 'Person',
    name: person.name
  };
  
  if (person.id) {
    schema['@id'] = `https://the1031center.com/team#${person.id}`;
  }
  
  if (person.title) {
    schema.jobTitle = person.title;
  }
  
  if (person.image) {
    schema.image = `https://the1031center.com${person.image}`;
  }
  
  if (person.bio) {
    schema.description = safeJsonEncode(person.bio) as string;
  }
  
  if (person.email) {
    schema.email = person.email;
  }
  
  if (person.linkedin) {
    schema.sameAs = person.linkedin;
  }
  
  if (person.education && person.education.length > 0) {
    schema.alumniOf = person.education.map(edu => {
      const parts = edu.split(',');
      return {
        '@type': 'EducationalOrganization',
        name: parts[1]?.trim() || edu
      };
    });
  }
  
  if (person.certifications && person.certifications.length > 0) {
    schema.hasCredential = person.certifications.map(cert => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert
    }));
  }
  
  if (person.specialties && person.specialties.length > 0) {
    schema.knowsAbout = person.specialties;
  }
  
  if (person.publications && person.publications.length > 0) {
    schema.author = person.publications.map(pub => ({
      '@type': 'Article',
      name: pub
    }));
  }
  
  if (person.location) {
    const [city, state] = person.location.split(', ');
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: state
    };
  }
  
  schema.worksFor = {
    '@id': 'https://the1031center.com/#organization'
  };
  
  return schema;
}

export interface ReviewSchema {
  '@type': 'Review';
  '@id'?: string;
  datePublished: string;
  author: PersonSchema | { '@type': 'Person'; name: string; address?: any };
  reviewRating: RatingSchema;
  name: string;
  reviewBody: string;
  itemReviewed: any;
}

export function createReviewSchema(review: {
  id: string;
  author: string;
  location?: string;
  date: string;
  rating: number;
  headline: string;
  review: string;
  propertyType?: string;
  exchangeType?: string;
}): ReviewSchema {
  const schema: ReviewSchema = {
    '@type': 'Review',
    '@id': `https://the1031center.com/testimonials#${review.id}`,
    datePublished: review.date,
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: createRatingSchema(review.rating),
    name: review.headline,
    reviewBody: safeJsonEncode(review.review) as string,
    itemReviewed: {
      '@type': 'Service',
      name: review.exchangeType && review.propertyType 
        ? `${review.exchangeType} - ${review.propertyType}`
        : '1031 Exchange Services',
      provider: {
        '@id': 'https://the1031center.com/#organization'
      }
    }
  };
  
  if (review.location) {
    const [city, state] = review.location.split(', ');
    (schema.author as any).address = {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: state
    };
  }
  
  return schema;
}

export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export function createBreadcrumbSchema(items: Array<{
  name: string;
  url?: string;
}>): BreadcrumbSchema {
  const schemaItems = items
    .map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: item.url ? `https://the1031center.com${item.url}` : undefined
    }))
    .filter(item => item.name); // Ensure we have valid items
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaItems
  };
}

/**
 * Validate schema object for common issues
 */
export function validateSchema(schema: any): { 
  isValid: boolean; 
  errors: string[] 
} {
  const errors: string[] = [];
  
  try {
    // Check if it can be stringified
    const jsonString = JSON.stringify(schema);
    
    // Check for template literal patterns that indicate improper encoding
    if (jsonString.includes('${')) {
      errors.push('Schema contains template literal syntax');
    }
    
    // Parse to ensure valid JSON
    JSON.parse(jsonString);
    
    // Check for required properties
    if (!schema['@type'] && !schema['@context']) {
      errors.push('Schema missing @type or @context');
    }
    
    // Check for common type issues
    checkSchemaTypes(schema, errors);
    
  } catch (e) {
    errors.push(`Invalid JSON: ${e.message}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function checkSchemaTypes(obj: any, errors: string[], path: string = ''): void {
  if (obj === null || obj === undefined) return;
  
  // Check rating values are numbers
  if (obj['@type'] === 'Rating' || obj['@type'] === 'AggregateRating') {
    if (typeof obj.ratingValue === 'string') {
      errors.push(`${path}ratingValue should be a number, not a string`);
    }
    if (obj.reviewCount && typeof obj.reviewCount === 'string') {
      errors.push(`${path}reviewCount should be a number, not a string`);
    }
  }
  
  // Recursively check nested objects
  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        checkSchemaTypes(value, errors, `${path}${key}.`);
      }
    }
  }
}

/**
 * Article schema with all required and optional fields
 */
export interface ArticleSchema {
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description: string;
  image: string | string[];
  author: PersonSchema | { '@type': 'Person'; name: string };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  url?: string;
  wordCount?: number;
  articleSection?: string;
  keywords?: string;
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export function createArticleSchema(article: {
  type?: 'Article' | 'BlogPosting' | 'NewsArticle';
  headline: string;
  description: string;
  image: string | string[];
  author: string | PersonSchema;
  datePublished: string;
  dateModified?: string;
  url?: string;
  wordCount?: number;
  articleSection?: string;
  keywords?: string;
}): ArticleSchema {
  const schema: ArticleSchema = {
    '@type': article.type || 'Article',
    headline: safeJsonEncode(article.headline) as string,
    description: safeJsonEncode(article.description) as string,
    image: Array.isArray(article.image) 
      ? article.image.map(img => img.startsWith('http') ? img : `https://the1031center.com${img}`)
      : article.image.startsWith('http') ? article.image : `https://the1031center.com${article.image}`,
    author: typeof article.author === 'string' 
      ? { '@type': 'Person', name: article.author }
      : article.author,
    publisher: {
      '@type': 'Organization',
      name: 'National 1031 Center',
      logo: {
        '@type': 'ImageObject',
        url: 'https://the1031center.com/images/logo.png'
      }
    },
    datePublished: article.datePublished
  };

  if (article.dateModified) {
    schema.dateModified = article.dateModified;
  }

  if (article.url) {
    schema.url = article.url.startsWith('http') ? article.url : `https://the1031center.com${article.url}`;
  }

  if (article.wordCount) {
    schema.wordCount = article.wordCount;
  }

  if (article.articleSection) {
    schema.articleSection = article.articleSection;
  }

  if (article.keywords) {
    schema.keywords = article.keywords;
  }

  // Add mainEntityOfPage if URL is provided
  if (article.url) {
    schema.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': schema.url
    };
  }

  return schema;
}

/**
 * FAQPage schema
 */
export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export function createFAQPageSchema(faqs: Array<{
  question: string;
  answer: string;
}>): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: safeJsonEncode(faq.question) as string,
      acceptedAnswer: {
        '@type': 'Answer',
        text: safeJsonEncode(faq.answer) as string
      }
    }))
  };
}

/**
 * HowTo schema
 */
export interface HowToSchema {
  '@context': 'https://schema.org';
  '@type': 'HowTo';
  name: string;
  description: string;
  image?: string | string[];
  totalTime?: string;
  estimatedCost?: {
    '@type': 'MonetaryAmount';
    currency: string;
    value: string | number;
  };
  supply?: Array<{
    '@type': 'HowToSupply';
    name: string;
  }>;
  tool?: Array<{
    '@type': 'HowToTool';
    name: string;
  }>;
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>;
}

export function createHowToSchema(howTo: {
  name: string;
  description: string;
  image?: string | string[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string | number;
  };
  supplies?: string[];
  tools?: string[];
  steps: Array<{
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>;
}): HowToSchema {
  const schema: HowToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: safeJsonEncode(howTo.name) as string,
    description: safeJsonEncode(howTo.description) as string,
    step: howTo.steps.map(step => ({
      '@type': 'HowToStep',
      name: safeJsonEncode(step.name) as string,
      text: safeJsonEncode(step.text) as string,
      url: step.url ? (step.url.startsWith('http') ? step.url : `https://the1031center.com${step.url}`) : undefined,
      image: step.image ? (step.image.startsWith('http') ? step.image : `https://the1031center.com${step.image}`) : undefined
    }))
  };

  if (howTo.image) {
    schema.image = Array.isArray(howTo.image) 
      ? howTo.image.map(img => img.startsWith('http') ? img : `https://the1031center.com${img}`)
      : howTo.image.startsWith('http') ? howTo.image : `https://the1031center.com${howTo.image}`;
  }

  if (howTo.totalTime) {
    schema.totalTime = howTo.totalTime;
  }

  if (howTo.estimatedCost) {
    schema.estimatedCost = {
      '@type': 'MonetaryAmount',
      currency: howTo.estimatedCost.currency,
      value: String(howTo.estimatedCost.value)
    };
  }

  if (howTo.supplies && howTo.supplies.length > 0) {
    schema.supply = howTo.supplies.map(supply => ({
      '@type': 'HowToSupply',
      name: safeJsonEncode(supply) as string
    }));
  }

  if (howTo.tools && howTo.tools.length > 0) {
    schema.tool = howTo.tools.map(tool => ({
      '@type': 'HowToTool',
      name: safeJsonEncode(tool) as string
    }));
  }

  return schema;
}

/**
 * Helper to add WebPage schema wrapper
 */
export interface WebPageSchema {
  '@type': 'WebPage';
  '@id': string;
  url: string;
  name: string;
  isPartOf: { '@id': string };
  datePublished?: string;
  dateModified?: string;
  description?: string;
  breadcrumb?: { '@id': string };
  inLanguage?: string;
  potentialAction?: any[];
  mainEntity?: any;
}

export function wrapInWebPageSchema(
  pageUrl: string,
  pageTitle: string,
  pageDescription?: string,
  mainEntity?: any
): WebPageSchema {
  const schema: WebPageSchema = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageTitle,
    isPartOf: { '@id': 'https://the1031center.com/#website' },
    inLanguage: 'en-US'
  };
  
  if (pageDescription) {
    schema.description = pageDescription;
  }
  
  if (mainEntity) {
    schema.mainEntity = mainEntity;
  }
  
  return schema;
}