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
  'SmartClaim Processing System',
  'Intelligent claims processing application with automated validation and approval workflows.',
  'An advanced claims processing system that leverages machine learning algorithms to automatically validate and process insurance claims. The system reduces manual intervention, improves processing speed, and ensures compliance with regulatory requirements. It includes fraud detection capabilities and integrates with multiple insurance providers.',
  '/SmartClaim.png',
  ARRAY['Mendix', 'AI/ML', 'PostgreSQL', 'REST API'],
  ARRAY[
    'AI-powered claim validation and fraud detection',
    'Automated document processing and OCR',
    'Real-time claim status tracking for customers',
    'Integration with multiple insurance providers',
    'Regulatory compliance and audit reporting',
    'Mobile-responsive customer portal',
    'Advanced analytics and performance metrics'
  ],
  '#',
  '#',
  true,
  4
);