// Company information constants
// Update these values to change company details throughout the site

export const COMPANY = {
  name: "National 1031 Center",
  legalName: "National 1031 Center LLC",
  tagline: "America's Most Trusted 1031 Exchange Partner",
  
  // Contact Information
  phone: {
    main: "(877) 483-0427",
    mainFormatted: "877-483-0427",
    emergency: "(877) 483-0427", // Same as main for now
    fax: "1-800-1031-FAX" // Keep existing
  },
  
  email: {
    main: "info@the1031center.com",
    support: "support@the1031center.com"
  },
  
  // Address
  address: {
    street: "1313 N. Milpitas Blvd, Suite 155",
    city: "Milpitas",
    state: "CA",
    stateCode: "CA",
    zip: "95035",
    country: "United States",
    countryCode: "US"
  },
  
  // Domain and URLs
  domain: "the1031center.com",
  url: "https://the1031center.com",
  
  // Business Information
  founded: "2024",
  licenseStates: 50,
  fidelityBond: "$100 million",
  exchanges: "10,000+",
  
  // Hours
  hours: {
    weekdays: "Monday-Friday 8am-6pm EST",
    weekend: "Closed",
    emergency: "24/7 Emergency Support Available"
  },
  
  // Schema.org structured data
  schema: {
    type: "Organization",
    logo: "https://the1031center.com/images/logo.png",
    description: "America's most trusted 1031 exchange qualified intermediary, facilitating tax-deferred property exchanges nationwide with industry-leading security and expertise."
  }
} as const;

// Utility functions
export const getFullAddress = () => {
  return `${COMPANY.address.street}, ${COMPANY.address.city}, ${COMPANY.address.state} ${COMPANY.address.zip}`;
};

export const getPhoneLink = (type: 'main' | 'emergency' = 'main') => {
  const phone = type === 'emergency' ? COMPANY.phone.emergency : COMPANY.phone.main;
  return `tel:+1${phone.replace(/[^0-9]/g, '')}`;
};

export const getEmailLink = (type: 'main' | 'support' = 'main') => {
  const email = type === 'support' ? COMPANY.email.support : COMPANY.email.main;
  return `mailto:${email}`;
};