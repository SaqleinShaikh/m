-- Clear existing projects first (optional - remove this line if you want to keep existing data)
DELETE FROM projects;

-- Insert sample projects with correct image paths
INSERT INTO projects (
  title, 
  short_description, 
  full_description, 
  image, 
  technologies, 
  functionality, 
  github_url, 
  live_url, 
  visible, 
  display_order
) VALUES 
(
  'Quotation Evaluation System (QES)',
  'Procurement system for evaluating vendor quotations and selecting the best offers based on multiple criteria.',
  'A comprehensive procurement management system designed to streamline the vendor quotation evaluation process. The system allows procurement teams to input multiple vendor quotes, automatically calculate scores based on predefined criteria, and generate detailed comparison reports. Features include automated scoring algorithms, vendor performance tracking, and integration with existing ERP systems.',
  '/QES.png',
  ARRAY['Mendix', 'PostgreSQL', 'REST API', 'JavaScript'],
  ARRAY[
    'Multi-criteria vendor evaluation with weighted scoring',
    'Automated quotation comparison and ranking',
    'Real-time dashboard with procurement analytics',
    'Vendor performance history tracking',
    'Integration with ERP systems for seamless data flow',
    'Customizable evaluation criteria and scoring models',
    'Automated report generation and export functionality'
  ],
  '#',
  '#',
  true,
  1
),
(
  'Nexus Layout',
  'Standard UI module providing reusable layouts and components for consistent application design.',
  'A comprehensive UI framework built for Mendix applications that provides standardized layouts, components, and design patterns. This module ensures consistency across multiple applications while reducing development time through reusable components. It includes responsive design patterns, accessibility features, and customizable themes.',
  '/NexusLayout.png',
  ARRAY['Mendix', 'CSS', 'JavaScript', 'SASS'],
  ARRAY[
    'Responsive grid system for all screen sizes',
    'Pre-built UI components library',
    'Consistent design system and style guide',
    'Accessibility compliance (WCAG 2.1)',
    'Customizable themes and branding options',
    'Cross-browser compatibility testing',
    'Documentation and usage guidelines'
  ],
  '#',
  '#',
  true,
  2
),
(
  'Global Requisition Process (GRP)',
  'Accounting application for estimation and approval workflows in global procurement processes.',
  'An enterprise-level accounting and procurement application that manages global requisition processes from initial request to final approval. The system handles multi-currency transactions, complex approval hierarchies, and integrates with various financial systems. It provides real-time tracking of requisitions and automated workflow management.',
  '/GRP.png',
  ARRAY['Mendix', 'Oracle DB', 'SOAP', 'XML'],
  ARRAY[
    'Multi-currency support for global operations',
    'Complex approval workflow engine',
    'Real-time requisition tracking and status updates',
    'Integration with SAP and Oracle financial systems',
    'Automated budget validation and checking',
    'Comprehensive audit trail and reporting',
    'Role-based access control and permissions'
  ],
  '#',
  '#',
  true,
  3
),
(
  'Limit of Authority (LOA)',
  'Finance application to automate warranty extension and approval processes.',
  'Built an application to automate approval workflows for extending warranties and retention periods for products. Managed complex business logic to ensure accurate approvals and efficient system functioning. The system streamlines the entire approval chain with role-based authorization levels and comprehensive audit trails.',
  '/LOA.png',
  ARRAY['Mendix', 'Workflows', 'Microflows', 'PostgreSQL'],
  ARRAY[
    'Automated warranty extension process',
    'Retention period approval workflows',
    'Complex business logic handling',
    'Workflow automation with multi-level approvals',
    'Role-based authorization levels',
    'Comprehensive audit trail and reporting'
  ],
  '#',
  '#',
  true,
  4
),
(
  'Employee Separation Process',
  'Application to streamline employee exit workflows and resignation management.',
  'Led the development of an application to manage employee resignation processes. Delivered within a one-month deadline by designing complex workflows, UI pages, automated notifications, jobs, and business logic. The system handles the complete separation lifecycle from resignation initiation to final clearance.',
  '/SEP.png',
  ARRAY['Mendix', 'PostgreSQL', 'Microflows', 'CSS'],
  ARRAY[
    'Employee resignation initiation and tracking',
    'Multi-level approval workflows',
    'Custom UI pages with responsive design',
    'Automated email notifications and reminders',
    'Scheduled jobs for process automation',
    'Comprehensive business logic implementation'
  ],
  '#',
  '#',
  true,
  5
),
(
  'Smart Claims / Debit Note',
  'Finance application for handling claims and debit notes in FMCG domain.',
  'Developed an application from scratch for a large FMCG client to manage B2B/B2C claims, sanctioning, expense ID generation, and PO creation. Designed business logic, workflows, validations, and visibility rules to enhance system capabilities.',
  '/SmartClaim.png',
  ARRAY['Mendix', 'PostgreSQL', 'Microflows', 'REST API'],
  ARRAY[
    'Claims and debit note management',
    'B2B and B2C workflow processing',
    'Automated sanctioning and PO generation',
    'Expense ID generation system',
    'Validations and visibility control rules',
    'Comprehensive reporting and analytics'
  ],
  '#',
  '#',
  true,
  6
),
(
  'Centralized User Application',
  'Application for managing user terminations and compliance across the enterprise.',
  'Designed and maintained an enterprise-level application to manage user termination processes. Implemented audit trail mechanisms, performed root cause analysis, and optimized complex pre-developed jobs to ensure compliance and performance.',
  '/CUA.png',
  ARRAY['Mendix', 'PostgreSQL', 'Microflows', 'Workflows'],
  ARRAY[
    'Automated user termination process',
    'Audit trail mechanism for compliance',
    'Impact analysis and documentation',
    'Root cause analysis and debugging tools',
    'Change request implementation workflow',
    'Performance optimization for batch jobs'
  ],
  '#',
  '#',
  true,
  7
);