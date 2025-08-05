// SEO Keywords for The 1031 Center
// Comprehensive keyword strategy for all page types

export const seoKeywords = {
  // Homepage
  homepage: "1031 exchange, tax deferred exchange, qualified intermediary, capital gains tax deferral, like-kind exchange, 1031 exchange services, property exchange, investment property exchange, 1031 exchange company, defer capital gains",
  
  // Service Pages
  services: {
    delayed: "delayed 1031 exchange, forward exchange, standard 1031 exchange, 45 day identification period, 180 day exchange deadline, sell then buy exchange, deferred exchange, traditional 1031 exchange, capital gains deferral, investment property sale",
    
    reverse: "reverse 1031 exchange, buy first exchange, reverse exchange parking arrangement, exchange accommodation titleholder, EAT structure, buy before sell exchange, replacement property first, competitive market exchange, reverse 1031 timeline, complex exchange",
    
    improvement: "improvement exchange, build to suit 1031, construction exchange, 1031 exchange improvements, property improvements exchange, value-add exchange, renovation exchange, development exchange, construction 1031, improvement structure",
    
    partial: "partial 1031 exchange, cash out exchange, boot in 1031 exchange, partial tax deferral, strategic cash out, blended exchange, partial proceeds, cash boot, taxable boot, partial exchange strategy"
  },
  
  // Information Pages
  info: {
    guide: "complete 1031 exchange guide, 1031 exchange rules, like-kind exchange guide, tax deferred exchange guide, 1031 requirements, exchange deadlines, qualified intermediary guide, 1031 exchange process, comprehensive 1031 guide, exchange strategies",
    
    rules: "1031 exchange rules, IRS section 1031, like-kind property rules, exchange requirements, 1031 regulations, tax code 1031, qualified property rules, exchange restrictions, 1031 compliance, IRS guidelines",
    
    timeline: "1031 exchange timeline, 45 day rule, 180 day deadline, exchange deadlines, identification period, exchange period, 1031 calendar, critical dates, timeline calculator, exchange schedule",
    
    howItWorks: "how 1031 exchange works, 1031 process, exchange steps, qualified intermediary process, 1031 exchange procedure, step by step exchange, exchange workflow, 1031 mechanics, exchange explanation, process guide",
    
    choosingQI: "choosing qualified intermediary, selecting QI, 1031 exchange company, qualified intermediary selection, QI requirements, intermediary qualifications, exchange facilitator, QI comparison, selecting exchange company, trusted intermediary",
    
    types: "types of 1031 exchanges, exchange options, 1031 exchange types, delayed reverse improvement partial, exchange structures, 1031 variations, exchange methods, different exchanges, exchange comparison, 1031 options"
  },
  
  // Location Pages (template)
  locationTemplate: (state: string) => `${state} 1031 exchange, ${state} qualified intermediary, ${state} property exchange, ${state} tax deferred exchange, ${state} investment property, ${state} capital gains deferral, ${state} real estate exchange, ${state} 1031 services, ${state} exchange company, local 1031 expert`,
  
  // Property Type Pages (template)  
  propertyTypeTemplate: (type: string) => `${type} 1031 exchange, exchange ${type}, ${type} property exchange, ${type} investment property, ${type} tax deferral, ${type} like-kind exchange, ${type} replacement property, ${type} capital gains, ${type} property swap, ${type} exchange rules`,
  
  // Scenario Pages (template)
  scenarioTemplate: (scenario: string) => `${scenario} 1031 exchange, ${scenario} tax strategy, ${scenario} property exchange, ${scenario} investment strategy, ${scenario} exchange rules, ${scenario} tax deferral, ${scenario} exchange process, ${scenario} qualified intermediary, ${scenario} exchange guide, ${scenario} 1031 strategy`,
  
  // Comparison Pages (template)
  comparisonTemplate: (competitor: string) => `${competitor} vs national 1031, ${competitor} comparison, ${competitor} alternative, better than ${competitor}, ${competitor} competitor, 1031 exchange comparison, qualified intermediary comparison, ${competitor} review, choose national 1031, why not ${competitor}`,
  
  // Other Pages
  other: {
    about: "about national 1031 center, 1031 exchange experts, qualified intermediary team, exchange company history, trusted QI, experienced intermediary, 1031 professionals, exchange specialists, company background, why choose us",
    
    team: "1031 exchange team, qualified intermediary experts, exchange specialists, CES certified, 1031 professionals, experienced team, exchange advisors, QI experts, professional team, certified specialists",
    
    testimonials: "1031 exchange reviews, client testimonials, exchange success stories, customer reviews, 1031 feedback, client experiences, success stories, exchange testimonials, customer satisfaction, client results",
    
    trust: "secure 1031 exchange, bonded insured, segregated accounts, exchange security, client protection, trust security, safe exchange, protected funds, secure QI, financial security",
    
    faq: "1031 exchange FAQ, frequently asked questions, exchange questions, 1031 answers, common questions, exchange help, 1031 information, question answer, exchange FAQ, 1031 queries",
    
    contact: "contact 1031 exchange, qualified intermediary contact, exchange consultation, free consultation, contact QI, exchange help, 1031 support, get started, contact us, exchange inquiry",
    
    calculator: "1031 exchange calculator, tax savings calculator, exchange savings, calculate deferral, tax calculator, savings estimator, exchange benefits, roi calculator, investment calculator, tax deferral calculator",
    
    schedule: "schedule consultation, book appointment, free consultation, exchange consultation, meet expert, consultation booking, appointment scheduler, expert meeting, consultation request, book call",
    
    startExchange: "start 1031 exchange, begin exchange, initiate 1031, start process, exchange application, get started, begin 1031, start tax deferral, initiate exchange, commence 1031"
  }
};

// Helper function to get keywords for a specific page
export function getKeywords(pageType: string, subType?: string): string {
  switch(pageType) {
    case 'homepage':
      return seoKeywords.homepage;
    
    case 'service':
      return subType ? seoKeywords.services[subType as keyof typeof seoKeywords.services] : seoKeywords.homepage;
    
    case 'info':
      return subType ? seoKeywords.info[subType as keyof typeof seoKeywords.info] : seoKeywords.info.guide;
    
    case 'location':
      return subType ? seoKeywords.locationTemplate(subType) : seoKeywords.homepage;
    
    case 'property':
      return subType ? seoKeywords.propertyTypeTemplate(subType) : seoKeywords.homepage;
    
    case 'scenario':
      return subType ? seoKeywords.scenarioTemplate(subType) : seoKeywords.homepage;
    
    case 'comparison':
      return subType ? seoKeywords.comparisonTemplate(subType) : seoKeywords.homepage;
    
    case 'other':
      return subType ? seoKeywords.other[subType as keyof typeof seoKeywords.other] : seoKeywords.homepage;
    
    default:
      return seoKeywords.homepage;
  }
}