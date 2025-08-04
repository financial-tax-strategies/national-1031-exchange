function safeJsonEncode(value) {
  if (value === null || value === void 0) {
    return null;
  }
  if (typeof value === "string") {
    return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
  }
  if (typeof value === "number") {
    return isNaN(value) ? null : value;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => safeJsonEncode(item)).filter((item) => item !== null);
  }
  if (typeof value === "object") {
    const encoded = {};
    for (const [key, val] of Object.entries(value)) {
      const encodedValue = safeJsonEncode(val);
      if (encodedValue !== null && encodedValue !== "") {
        encoded[key] = encodedValue;
      }
    }
    return encoded;
  }
  return null;
}
function generateJsonLdScript(schema) {
  const encodedSchema = safeJsonEncode(schema);
  const jsonString = JSON.stringify(encodedSchema, null, 2);
  return jsonString;
}
function createRatingSchema(value, type = "Rating", count) {
  const schema = {
    "@type": type,
    ratingValue: Number(value),
    // Ensure it's a number
    bestRating: 5,
    worstRating: 1
  };
  if (type === "AggregateRating" && count) {
    schema.reviewCount = count;
  }
  return schema;
}
function createPersonSchema(person) {
  const schema = {
    "@type": "Person",
    name: person.name
  };
  if (person.id) {
    schema["@id"] = `https://the1031center.com/team#${person.id}`;
  }
  if (person.title) {
    schema.jobTitle = person.title;
  }
  if (person.image) {
    schema.image = `https://the1031center.com${person.image}`;
  }
  if (person.bio) {
    schema.description = safeJsonEncode(person.bio);
  }
  if (person.email) {
    schema.email = person.email;
  }
  if (person.linkedin) {
    schema.sameAs = person.linkedin;
  }
  if (person.education && person.education.length > 0) {
    schema.alumniOf = person.education.map((edu) => {
      const parts = edu.split(",");
      return {
        "@type": "EducationalOrganization",
        name: parts[1]?.trim() || edu
      };
    });
  }
  if (person.certifications && person.certifications.length > 0) {
    schema.hasCredential = person.certifications.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert
    }));
  }
  if (person.specialties && person.specialties.length > 0) {
    schema.knowsAbout = person.specialties;
  }
  if (person.publications && person.publications.length > 0) {
    schema.author = person.publications.map((pub) => ({
      "@type": "Article",
      name: pub
    }));
  }
  if (person.location) {
    const [city, state] = person.location.split(", ");
    schema.address = {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state
    };
  }
  schema.worksFor = {
    "@id": "https://the1031center.com/#organization"
  };
  return schema;
}
function createReviewSchema(review) {
  const schema = {
    "@type": "Review",
    "@id": `https://the1031center.com/testimonials#${review.id}`,
    datePublished: review.date,
    author: {
      "@type": "Person",
      name: review.author
    },
    reviewRating: createRatingSchema(review.rating),
    name: review.headline,
    reviewBody: safeJsonEncode(review.review),
    itemReviewed: {
      "@type": "Service",
      name: review.exchangeType && review.propertyType ? `${review.exchangeType} - ${review.propertyType}` : "1031 Exchange Services",
      provider: {
        "@id": "https://the1031center.com/#organization"
      }
    }
  };
  if (review.location) {
    const [city, state] = review.location.split(", ");
    schema.author.address = {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state
    };
  }
  return schema;
}
function createBreadcrumbSchema(items) {
  const schemaItems = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url ? `https://the1031center.com${item.url}` : void 0
  })).filter((item) => item.name);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems
  };
}
function createArticleSchema(article) {
  const schema = {
    "@type": article.type || "Article",
    headline: safeJsonEncode(article.headline),
    description: safeJsonEncode(article.description),
    image: Array.isArray(article.image) ? article.image.map((img) => img.startsWith("http") ? img : `https://the1031center.com${img}`) : article.image.startsWith("http") ? article.image : `https://the1031center.com${article.image}`,
    author: typeof article.author === "string" ? { "@type": "Person", name: article.author } : article.author,
    publisher: {
      "@type": "Organization",
      name: "National 1031 Center",
      logo: {
        "@type": "ImageObject",
        url: "https://the1031center.com/images/logo.png"
      }
    },
    datePublished: article.datePublished
  };
  if (article.dateModified) {
    schema.dateModified = article.dateModified;
  }
  if (article.url) {
    schema.url = article.url.startsWith("http") ? article.url : `https://the1031center.com${article.url}`;
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
  if (article.url) {
    schema.mainEntityOfPage = {
      "@type": "WebPage",
      "@id": schema.url
    };
  }
  return schema;
}
function createFAQPageSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: safeJsonEncode(faq.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: safeJsonEncode(faq.answer)
      }
    }))
  };
}
function createHowToSchema(howTo) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: safeJsonEncode(howTo.name),
    description: safeJsonEncode(howTo.description),
    step: howTo.steps.map((step) => ({
      "@type": "HowToStep",
      name: safeJsonEncode(step.name),
      text: safeJsonEncode(step.text),
      url: step.url ? step.url.startsWith("http") ? step.url : `https://the1031center.com${step.url}` : void 0,
      image: step.image ? step.image.startsWith("http") ? step.image : `https://the1031center.com${step.image}` : void 0
    }))
  };
  if (howTo.image) {
    schema.image = Array.isArray(howTo.image) ? howTo.image.map((img) => img.startsWith("http") ? img : `https://the1031center.com${img}`) : howTo.image.startsWith("http") ? howTo.image : `https://the1031center.com${howTo.image}`;
  }
  if (howTo.totalTime) {
    schema.totalTime = howTo.totalTime;
  }
  if (howTo.estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: howTo.estimatedCost.currency,
      value: String(howTo.estimatedCost.value)
    };
  }
  if (howTo.supplies && howTo.supplies.length > 0) {
    schema.supply = howTo.supplies.map((supply) => ({
      "@type": "HowToSupply",
      name: safeJsonEncode(supply)
    }));
  }
  if (howTo.tools && howTo.tools.length > 0) {
    schema.tool = howTo.tools.map((tool) => ({
      "@type": "HowToTool",
      name: safeJsonEncode(tool)
    }));
  }
  return schema;
}
function createEventSchema(event) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: safeJsonEncode(event.name),
    description: safeJsonEncode(event.description),
    organizer: {
      "@type": "Organization",
      name: "National 1031 Center",
      url: "https://the1031center.com",
      telephone: "+1-800-555-1031",
      email: "info@the1031center.com"
    }
  };
  if (event.startDate) {
    schema.startDate = event.startDate;
  }
  if (event.endDate) {
    schema.endDate = event.endDate;
  }
  if (event.duration) {
    schema.duration = event.duration;
  }
  if (event.attendanceMode) {
    schema.eventAttendanceMode = `https://schema.org/${event.attendanceMode}`;
  }
  if (event.status) {
    schema.eventStatus = `https://schema.org/${event.status}`;
  }
  if (event.location) {
    if (event.location.type === "virtual") {
      schema.location = {
        "@type": "VirtualLocation",
        url: event.location.url || "https://the1031center.com/schedule"
      };
    } else {
      schema.location = {
        "@type": "Place",
        name: event.location.name || "National 1031 Center",
        address: event.location.address ? {
          "@type": "PostalAddress",
          streetAddress: event.location.address
        } : void 0
      };
    }
  }
  if (event.price !== void 0) {
    schema.offers = {
      "@type": "Offer",
      price: String(event.price),
      priceCurrency: event.priceCurrency || "USD",
      availability: event.availability || "https://schema.org/InStock",
      url: event.bookingUrl || "https://the1031center.com/schedule"
    };
    if (event.validFrom) {
      schema.offers.validFrom = event.validFrom;
    }
  }
  if (event.maxCapacity) {
    schema.maximumAttendeeCapacity = event.maxCapacity;
  }
  if (event.remainingCapacity) {
    schema.remainingAttendeeCapacity = event.remainingCapacity;
  }
  schema.performer = {
    "@type": "Organization",
    name: "National 1031 Center Exchange Specialists"
  };
  return schema;
}
function createServiceSchema(service) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: safeJsonEncode(service.name),
    description: safeJsonEncode(service.description),
    provider: {
      "@type": "Organization",
      name: "National 1031 Center",
      url: "https://the1031center.com",
      telephone: "+1-800-555-1031",
      email: "info@the1031center.com"
    }
  };
  if (service.serviceType) {
    schema.serviceType = service.serviceType;
  }
  if (service.category) {
    schema.category = service.category;
  }
  {
    schema.offers = {
      "@type": "Offer",
      price: String(service.price),
      priceCurrency: service.priceCurrency || "USD",
      availability: service.availability || "https://schema.org/InStock",
      url: service.serviceUrl || "https://the1031center.com"
    };
    if (service.validFrom) {
      schema.offers.validFrom = service.validFrom;
    }
  }
  if (service.areaServed) {
    schema.areaServed = {
      "@type": "Country",
      name: service.areaServed
    };
  }
  if (service.audienceType) {
    schema.audience = {
      "@type": "Audience",
      audienceType: service.audienceType
    };
  }
  if (service.hoursAvailable && service.hoursAvailable.length > 0) {
    schema.hoursAvailable = service.hoursAvailable.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.dayOfWeek,
      opens: hours.opens,
      closes: hours.closes
    }));
  }
  return schema;
}
function createLocalBusinessSchema(business) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: safeJsonEncode(business.description),
    url: business.url,
    telephone: business.telephone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: business.address.country
    }
  };
  if (business.id) {
    schema["@id"] = business.id;
  }
  if (business.alternateName) {
    schema.alternateName = business.alternateName;
  }
  if (business.logo) {
    schema.logo = business.logo.startsWith("http") ? business.logo : `https://the1031center.com${business.logo}`;
  }
  if (business.image) {
    schema.image = Array.isArray(business.image) ? business.image.map((img) => img.startsWith("http") ? img : `https://the1031center.com${img}`) : business.image.startsWith("http") ? business.image : `https://the1031center.com${business.image}`;
  }
  if (business.faxNumber) {
    schema.faxNumber = business.faxNumber;
  }
  if (business.coordinates) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: business.coordinates.latitude,
      longitude: business.coordinates.longitude
    };
  }
  if (business.hours && business.hours.length > 0) {
    schema.openingHoursSpecification = business.hours.map((hour) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hour.days,
      opens: hour.opens,
      closes: hour.closes
    }));
  }
  if (business.priceRange) {
    schema.priceRange = business.priceRange;
  }
  if (business.areaServed) {
    schema.areaServed = {
      "@type": "Country",
      name: business.areaServed
    };
  }
  if (business.socialMedia && business.socialMedia.length > 0) {
    schema.sameAs = business.socialMedia;
  }
  if (business.contactPoints && business.contactPoints.length > 0) {
    schema.contactPoint = business.contactPoints.map((contact) => ({
      "@type": "ContactPoint",
      telephone: contact.telephone,
      contactType: contact.type,
      areaServed: contact.areaServed,
      availableLanguage: contact.languages,
      contactOption: contact.options
    }));
  }
  return schema;
}
function wrapInWebPageSchema(pageUrl, pageTitle, pageDescription, mainEntity) {
  const schema = {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageTitle,
    isPartOf: { "@id": "https://the1031center.com/#website" },
    inLanguage: "en-US"
  };
  if (pageDescription) {
    schema.description = pageDescription;
  }
  if (mainEntity) {
    schema.mainEntity = mainEntity;
  }
  return schema;
}

export { createFAQPageSchema as a, createPersonSchema as b, createArticleSchema as c, createLocalBusinessSchema as d, createBreadcrumbSchema as e, createHowToSchema as f, generateJsonLdScript as g, createEventSchema as h, createServiceSchema as i, createRatingSchema as j, createReviewSchema as k, wrapInWebPageSchema as w };
