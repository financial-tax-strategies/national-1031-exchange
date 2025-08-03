-- ============================================
-- Seed Team Members Data
-- Migrates hardcoded team data to database
-- ============================================

-- Ruth Benjamin
INSERT INTO team_members (
    slug,
    name,
    job_title,
    works_for,
    image,
    description,
    email,
    years_experience,
    knows_about,
    same_as,
    display_order,
    is_active
) VALUES (
    'ruth-benjamin',
    'Ruth Benjamin',
    'Chief Client Success Officer',
    'The 1031 Center',
    '/images/team/ruth-benjamin.jpg',
    'Ruth has an extensive background in real estate tax strategy with deep expertise in title, escrow, foreclosures, evictions, bankruptcy, mortgages, and legal matters. Over the past 35 years, she has served as president of two different 1031 Exchange Companies. Recognized throughout the industry as a subject matter expert in 1031 exchanges and tax-deferred cash-out strategies, Ruth''s approach is distinctive—she listens first, thinks creatively, and delivers elegant solutions to her clients.',
    'ruth.benjamin@the1031center.com',
    35,
    ARRAY['1031 exchanges', 'Tax-deferred strategies', 'Real estate tax strategy', 'Client success', 'Creative problem solving'],
    ARRAY['https://linkedin.com/in/ruthbenjamin1031'],
    1,
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    job_title = EXCLUDED.job_title,
    description = EXCLUDED.description,
    years_experience = EXCLUDED.years_experience,
    knows_about = EXCLUDED.knows_about;

-- Michael Chen
INSERT INTO team_members (
    slug,
    name,
    job_title,
    works_for,
    image,
    description,
    email,
    years_experience,
    knows_about,
    alumni_of,
    certifications,
    awards,
    same_as,
    display_order,
    is_active
) VALUES (
    'michael-chen',
    'Michael Chen',
    'Chief Operating Officer',
    'The 1031 Center',
    '/images/team/michael-chen.jpg',
    'Michael Chen oversees all exchange operations and client services at The 1031 Center. With 20 years in financial services and real estate, he ensures every exchange is executed flawlessly while maintaining the highest security standards.',
    'michael.chen@the1031center.com',
    20,
    ARRAY['Operations management', 'Technology integration', 'Security protocols', 'Process optimization'],
    ARRAY['M.B.A., Operations Management, MIT Sloan', 'B.S., Computer Science, UC Berkeley'],
    ARRAY['Certified Exchange Specialist (CES)', 'Project Management Professional (PMP)', 'Certified Information Security Manager (CISM)'],
    ARRAY['Excellence in Operations Award, FEA (2023)', 'Innovation in Exchange Services (2022)'],
    ARRAY['https://linkedin.com/in/michaelchen1031'],
    2,
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    job_title = EXCLUDED.job_title,
    description = EXCLUDED.description,
    years_experience = EXCLUDED.years_experience,
    knows_about = EXCLUDED.knows_about,
    alumni_of = EXCLUDED.alumni_of,
    certifications = EXCLUDED.certifications,
    awards = EXCLUDED.awards;

-- Jennifer Martinez
INSERT INTO team_members (
    slug,
    name,
    job_title,
    works_for,
    image,
    description,
    email,
    years_experience,
    knows_about,
    alumni_of,
    certifications,
    specializations,
    same_as,
    display_order,
    is_active
) VALUES (
    'jennifer-martinez',
    'Jennifer Martinez',
    'Senior Vice President, Exchange Services',
    'The 1031 Center',
    '/images/team/jennifer-martinez.jpg',
    'Jennifer Martinez leads our exchange services team with 18 years of specialized experience in qualified intermediary services. She has successfully facilitated over 5,000 exchanges totaling more than $2 billion in value.',
    'jennifer.martinez@the1031center.com',
    18,
    ARRAY['Delayed exchanges', 'Multi-property exchanges', 'Client relations', 'Exchange documentation'],
    ARRAY['M.S., Real Estate Finance, NYU Stern', 'B.A., Business Administration, UCLA'],
    ARRAY['Certified Exchange Specialist (CES)', 'Certified Commercial Investment Member (CCIM)', 'Real Estate License (CA, FL, TX)'],
    ARRAY['Facilitated 5,000+ successful exchanges', '$2B+ in exchange value processed', '99.8% client satisfaction rating'],
    ARRAY['https://linkedin.com/in/jennifermartinez1031'],
    3,
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    job_title = EXCLUDED.job_title,
    description = EXCLUDED.description,
    years_experience = EXCLUDED.years_experience,
    knows_about = EXCLUDED.knows_about,
    alumni_of = EXCLUDED.alumni_of,
    certifications = EXCLUDED.certifications,
    specializations = EXCLUDED.specializations;

-- David Thompson
INSERT INTO team_members (
    slug,
    name,
    job_title,
    works_for,
    image,
    description,
    email,
    years_experience,
    knows_about,
    alumni_of,
    certifications,
    publications,
    same_as,
    display_order,
    is_active
) VALUES (
    'david-thompson',
    'David Thompson',
    'Vice President, Reverse & Improvement Exchanges',
    'The 1031 Center',
    '/images/team/david-thompson.jpg',
    'David Thompson specializes in complex exchange structures including reverse and improvement exchanges. His expertise in Exchange Accommodation Titleholder (EAT) structures has helped hundreds of investors navigate challenging market conditions.',
    'david.thompson@the1031center.com',
    15,
    ARRAY['Reverse exchanges', 'Improvement exchanges', 'EAT structures', 'Complex timing issues'],
    ARRAY['J.D., Real Estate Law, Georgetown University', 'B.A., Finance, University of Pennsylvania'],
    ARRAY['Certified Exchange Specialist (CES)', 'Licensed Attorney (DC, MD, VA)', 'Advanced Exchange Structures Certification'],
    ARRAY['Reverse Exchange Strategies in Hot Markets (2023)', 'Improvement Exchanges: A Practitioner''s Guide (2022)'],
    ARRAY['https://linkedin.com/in/davidthompson1031'],
    4,
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    job_title = EXCLUDED.job_title,
    description = EXCLUDED.description,
    years_experience = EXCLUDED.years_experience,
    knows_about = EXCLUDED.knows_about,
    alumni_of = EXCLUDED.alumni_of,
    certifications = EXCLUDED.certifications,
    publications = EXCLUDED.publications;

-- Amanda Williams
INSERT INTO team_members (
    slug,
    name,
    job_title,
    works_for,
    image,
    description,
    email,
    years_experience,
    knows_about,
    alumni_of,
    certifications,
    specializations,
    same_as,
    display_order,
    is_active
) VALUES (
    'amanda-williams',
    'Amanda Williams',
    'Vice President, Client Success',
    'The 1031 Center',
    '/images/team/amanda-williams.jpg',
    'Amanda Williams ensures every client receives exceptional service throughout their exchange journey. With a background in wealth management and customer experience, she has built our industry-leading client support program.',
    'amanda.williams@the1031center.com',
    12,
    ARRAY['Client experience', 'Communication systems', 'Service excellence', 'Team leadership'],
    ARRAY['M.B.A., Customer Experience Management, Northwestern Kellogg', 'B.S., Psychology, Duke University'],
    ARRAY['Certified Exchange Specialist (CES)', 'Certified Customer Experience Professional (CCXP)', 'Six Sigma Black Belt'],
    ARRAY['Developed 48-hour response guarantee program', 'Achieved 98% client satisfaction score', 'Built team of 50+ exchange coordinators'],
    ARRAY['https://linkedin.com/in/amandawilliams1031'],
    5,
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    job_title = EXCLUDED.job_title,
    description = EXCLUDED.description,
    years_experience = EXCLUDED.years_experience,
    knows_about = EXCLUDED.knows_about,
    alumni_of = EXCLUDED.alumni_of,
    certifications = EXCLUDED.certifications,
    specializations = EXCLUDED.specializations;

-- Robert Garcia
INSERT INTO team_members (
    slug,
    name,
    job_title,
    works_for,
    image,
    description,
    email,
    years_experience,
    knows_about,
    alumni_of,
    certifications,
    specializations,
    same_as,
    display_order,
    is_active
) VALUES (
    'robert-garcia',
    'Robert Garcia',
    'Chief Financial Officer',
    'The 1031 Center',
    '/images/team/robert-garcia.jpg',
    'Robert Garcia oversees all financial operations and ensures the highest standards of fund security and accounting practices. His expertise in financial controls and segregated account management provides peace of mind to our clients.',
    'robert.garcia@the1031center.com',
    22,
    ARRAY['Fund security', 'Financial controls', 'Account segregation', 'Regulatory compliance'],
    ARRAY['M.B.A., Finance, Chicago Booth', 'B.S., Accounting, University of Texas'],
    ARRAY['Certified Public Accountant (CPA)', 'Certified Treasury Professional (CTP)', 'Certified Fraud Examiner (CFE)'],
    ARRAY['Implemented triple-redundancy security protocols', 'Zero security incidents in 10 years', 'Developed industry-leading reconciliation systems'],
    ARRAY['https://linkedin.com/in/robertgarcia1031'],
    6,
    true
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    job_title = EXCLUDED.job_title,
    description = EXCLUDED.description,
    years_experience = EXCLUDED.years_experience,
    knows_about = EXCLUDED.knows_about,
    alumni_of = EXCLUDED.alumni_of,
    certifications = EXCLUDED.certifications,
    specializations = EXCLUDED.specializations;