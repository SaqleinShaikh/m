-- =====================================================
-- SEED DATA - Migrate Hardcoded Data to Database
-- Run this AFTER init.sql
-- =====================================================

-- =====================================================
-- BLOG POSTS DATA
-- =====================================================
INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, read_time, image, visible, published_date) VALUES
('Mendix Studio Pro Latest Release 11.0', 'Mendix-Studio-Pro-Latest-Release-11.0', 
 'Explore the powerful new features, enhancements, and productivity boosters introduced in the latest Mendix Studio Pro release.',
 E'Mendix has rolled out its latest Studio Pro release, delivering a host of features to accelerate low-code development and improve developer experience.\n\nKey Highlights:\n- Enhanced Performance Tools: The release brings optimized performance profiling, helping developers quickly identify and resolve bottlenecks in microflows.\n- Advanced Data Integration: Improved connectors and support for additional REST and OData features simplify data synchronization across enterprise systems.\n- UI/UX Improvements: New responsive templates and design-time previews allow developers to deliver better user experiences with less effort.\n- Collaboration Enhancements: Real-time collaboration updates improve multi-developer workflows, making it easier for teams to work on complex applications simultaneously.\n- Version Control Upgrades: Seamless Git-based project management ensures faster branching, merging, and CI/CD integration.\n\nWhy It Matters\nWith these updates, Mendix Studio Pro continues to empower developers—both citizen and professional—by offering more intuitive tools, greater flexibility, and enterprise-ready scalability.\n\nStay tuned for more detailed use cases and examples as the community begins leveraging these exciting new features.',
 'Mendix', ARRAY['mendix', 'studio-pro', 'low-code', 'release-notes'], '7 min', '/mendix-10.24.png', true, '2025-09-02'),

('Designing Better UX in Enterprise Apps', 'designing-better-ux-in-enterprise-apps',
 'Principles to create usable, accessible enterprise UIs.',
 E'Full article content goes here. Discuss UX heuristics, accessibility, and performance.\n\nDetails: ...',
 'UX', ARRAY['ux', 'accessibility', 'enterprise'], '7 min', '/placeholder.svg', true, '2024-08-10'),

('Python Scripting for Automation', 'python-scripting-for-automation',
 'Automate routine tasks with concise Python scripts.',
 E'Full article content goes here. Show examples of scripts and patterns.\n\nExamples: ...',
 'Python', ARRAY['python', 'automation', 'tips'], '6 min', '/placeholder.svg', true, '2024-09-05'),

('SQL Best Practices', 'sql-best-practices',
 'Write fast, maintainable queries with confidence.',
 E'Full article content goes here. Indexes, query plans, and schema design.\n\nChecklist: ...',
 'Database', ARRAY['sql', 'database', 'performance'], '8 min', '/placeholder.svg', true, '2024-09-18')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- PROJECTS DATA
-- =====================================================
INSERT INTO projects (title, short_description, full_description, image, technologies, functionality, github_url, live_url, visible, display_order) VALUES
('Quotation Evaluation System (QES)', 
 'Procurement system for evaluating vendor quotations and selecting the best option.',
 'Designed to evaluate quotations among four vendors by comparing order prices and assigning levels (L1-L4). Implemented workflows to finalize vendor selection and automate order placement.',
 '/QES.PNG', 
 ARRAY['Mendix', 'PostgreSQL', 'Microflows', 'Workflows'],
 ARRAY['Quotation comparison among multiple vendors', 'Automated vendor ranking (L1–L4)', 'Workflow-based vendor selection', 'Order placement automation'],
 '#', '#', true, 1),

('Nexus Layout',
 'Standard UI module providing reusable layouts and components.',
 'Developed a standardized UI layout module including page templates, widgets, and reusable UI components. Ensured consistency and responsiveness across multiple applications while meeting evolving UI/UX requirements.',
 '/NexusLayout.PNG',
 ARRAY['Mendix', 'CSS', 'JavaScript'],
 ARRAY['Reusable page templates', 'Widget and UI component library', 'Responsive design', 'Regular UI updates to meet business needs'],
 '#', '#', true, 2),

('Global Requisition Process (GRP)',
 'Accounting application for estimation and approval workflows.',
 'Developed an application for Japan and Taiwan clients to estimate product costs and manage approval cycles. Handled large-scale data imports and optimized the application for successful Go-Live after prior development issues.',
 '/GRP.PNG',
 ARRAY['Mendix', 'PostgreSQL'],
 ARRAY['Product estimation functionality', 'Custom approval cycle selection', 'Heavy data import and processing', 'Performance optimization and stabilization'],
 '#', '#', true, 3),

('Limit of Authority (LOA)',
 'Finance application to automate warranty extension and approval processes.',
 'Built an application to automate approval workflows for extending warranties and retention periods for products. Managed complex business logic to ensure accurate approvals and efficient system functioning.',
 '/LOA.PNG',
 ARRAY['Mendix', 'Workflows', 'Microflows'],
 ARRAY['Automated warranty extension process', 'Retention period approval', 'Complex business logic handling', 'Workflow automation'],
 '#', '#', true, 4),

('Employee Separation Process',
 'Application to streamline employee exit workflows.',
 'Led the development of an application to manage employee resignation processes. Delivered within a one-month deadline by designing complex workflows, UI pages, automated notifications, jobs, and business logic.',
 '/SEP.PNG',
 ARRAY['Mendix', 'PostgreSQL', 'Microflows', 'CSS'],
 ARRAY['Employee resignation initiation', 'Approval workflows', 'UI pages and business logic', 'Automated notifications and scheduled jobs'],
 '#', '#', true, 5),

('Smart Claims / Debit Note',
 'Finance application for handling claims and debit notes in FMCG domain.',
 'Developed an application from scratch for a large FMCG client to manage B2B/B2C claims, sanctioning, expense ID generation, and PO creation. Designed business logic, workflows, validations, and visibility rules to enhance system capabilities.',
 '/SmartClaim.PNG',
 ARRAY['Mendix', 'PostgreSQL', 'Microflows'],
 ARRAY['Claims and debit note management', 'B2B and B2C workflows', 'Sanctioning and PO generation', 'Validations and visibility control'],
 '#', '#', true, 6),

('Centralized User Application',
 'Application for managing user terminations and compliance.',
 'Designed and maintained an enterprise-level application to manage user termination processes. Implemented audit trail mechanisms, performed root cause analysis, and optimized complex pre-developed jobs to ensure compliance and performance.',
 '/CUA.PNG',
 ARRAY['Mendix', 'PostgreSQL', 'Microflows', 'Workflows'],
 ARRAY['Automated user termination process', 'Audit trail mechanism for compliance', 'Impact analysis and documentation', 'Root cause analysis and debugging', 'Change request implementation'],
 '#', '#', true, 7);

-- =====================================================
-- CERTIFICATIONS DATA
-- =====================================================
INSERT INTO certifications (title, issuer, issue_date, image, description, credential_url, type, visible, display_order) VALUES
('Mendix Advanced Developer Certification', 'Mendix', '2025',
 '/advancecertification.PNG',
 'Advanced certification demonstrating expertise in Mendix platform development and architecture.',
 '/advancecertification.PNG', 'certification', true, 1),

('Mendix Intermediate Developer Certification', 'Mendix', '2022',
 '/InterMediate.PNG',
 'Certified Mendix Intermediate Developer with proven skills in building scalable, low-code applications. Earned on 25 Oct 2022 · Certificate No. 42753.',
 '/InterMediate.PNG', 'certification', true, 2),

('HackerRank Problem Solving (Basic) Certificate', 'HackerRank', '2024',
 '/HackerRankProblemSolving.PNG',
 'Certificate recognizing foundational problem-solving skills validated through the HackerRank coding assessment.',
 '/HackerRankProblemSolving.PNG', 'certification', true, 3),

('Star of the Quarter', 'TCS', 'Q1 2023',
 '/StartOfTheQuarter.PNG',
 'Recognized for outstanding performance and client satisfaction',
 '/StartOfTheQuarter.PNG', 'award', true, 4),

('Star Team Award', 'TCS', '03 Aug 2023',
 '/StarTeamAward.PNG',
 'Recognized for exceptional teamwork and project delivery',
 '/StarTeamAward.PNG', 'award', true, 5),

('Special Initiative Award', 'TCS', '2022',
 '/SIA.PNG',
 'Honored for taking innovative initiatives that contributed significantly to the organization, showcasing creativity, dedication.',
 '/SIA.PNG', 'award', true, 6),

('Service and Commitment Award', 'TCS', '2024',
 '/SCA.PNG',
 'Recognized for 3 years of dedicated service, reflecting consistent commitment, loyalty, and valuable contributions to the organization.',
 '/SCA.PNG', 'award', true, 7),

('On The Spot Award', 'TCS', '2024',
 '/OSA.PNG',
 'Recognized for outstanding contribution and immediate impact through quick initiative.',
 '/OSA.PNG', 'award', true, 8);

-- =====================================================
-- EXPERIENCE DATA
-- =====================================================
INSERT INTO experience (company, position, duration, location, description, technologies, is_current, visible, display_order) VALUES
('Deloitte', 'Mendix Developer', 'Nov 2024 – Present', 'Pune, India',
 'Working on enterprise-level Mendix applications, focusing on digital transformation projects and delivering scalable solutions for global clients.',
 ARRAY['Mendix', 'PostgreSQL', 'REST APIs', 'Putty', 'pgAdmin'],
 true, true, 1),

('TCS (Tata Consultancy Services)', 'Mendix Developer', 'July 2021 – Oct 2024', 'Pune, India',
 'Developed and led UI-driven Mendix applications by transforming legacy Java systems. Delivered multiple successful go-lives, managed UATs and change requests, and provided 24/7 support through ServiceNow. Mentored junior developers and ensured responsive, UX-compliant designs.',
 ARRAY['Mendix', 'pgAdmin', 'REST APIs', 'SQL', 'HTML/CSS', 'Python'],
 false, true, 2);

-- =====================================================
-- EDUCATION DATA
-- =====================================================
INSERT INTO education (degree, year, location, description, icon, visible, display_order) VALUES
('BE Computer Science', '2021', 'Pune University',
 'Bachelor of Engineering in Computer Science with a strong focus on software development. Graduated with distinction, demonstrating consistent academic excellence and technical proficiency.',
 'GraduationCap', true, 1),

('HSC (Higher Secondary Certificate)', '2017', 'Nashik',
 'Higher Secondary education with science stream.',
 'Award', true, 2),

('SSC (Secondary School Certificate)', '2015', 'Nashik',
 'Secondary education with excellent academic performance.',
 'Award', true, 3);

-- =====================================================
-- SKILLS DATA
-- =====================================================
INSERT INTO skills (name, proficiency, category, subcategory, visible, display_order) VALUES
('Mendix', 90, 'language', 'Low Code', true, 1),
('Python', 80, 'language', 'Language', true, 2),
('Java', 75, 'language', 'Language', true, 3),
('HTML/CSS', 85, 'language', 'Language', true, 4),
('C++', 80, 'language', 'Language', true, 5),
('SQL', 85, 'language', 'Database', true, 6),
('Mendix Studio Pro', 95, 'tool', 'Tool', true, 7),
('PostgreSQL', 80, 'tool', 'Tool', true, 8),
('DBeaver', 75, 'tool', 'Tool', true, 9),
('PgAdmin', 70, 'tool', 'Tool', true, 10),
('Putty', 65, 'tool', 'Tool', true, 11),
('React.js', 70, 'tool', 'Tool', true, 12);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Seed data inserted successfully!';
    RAISE NOTICE 'Data inserted for: blog_posts, projects, certifications, experience, education, skills';
END $$;
