const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tcrumuaehotwssovpkfb.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjcnVtdWFlaG90d3Nzb3Zwa2ZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM1MTQyOCwiZXhwIjoyMDg3OTI3NDI4fQ.oW8hzkMN5Wuu0RxdXI_EHNA1vTMskAi8mdHbmfTHVXY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const blog1Content = `
<p>The landscape of enterprise application development is undergoing a seismic shift. With the rise of <strong>Agentic AI</strong> — autonomous AI systems capable of reasoning, planning, and taking actions — platforms like <strong>Mendix</strong> are at the forefront of this transformation. But what exactly happens when you combine the power of low-code with intelligent AI agents? Let's explore.</p>

<h2>🤖 What is Agentic AI?</h2>

<p>Unlike traditional AI models that simply respond to prompts, <strong>Agentic AI</strong> systems can:</p>

<ul>
  <li><strong>Autonomously plan</strong> multi-step workflows to accomplish complex goals</li>
  <li><strong>Use tools</strong> — APIs, databases, search engines — to gather information and take actions</li>
  <li><strong>Self-correct</strong> when they encounter errors or unexpected results</li>
  <li><strong>Collaborate</strong> with other agents or human users to complete tasks</li>
</ul>

<p>Think of it as having an AI teammate that doesn't just answer questions — it actually <em>does the work</em>.</p>

<h2>⚡ How Mendix is Embracing Agentic AI</h2>

<p>Mendix has been rapidly integrating AI capabilities into its platform. Here's how Agentic AI is reshaping the Mendix development experience:</p>

<h3>1. Maia — Mendix's AI-Powered Assistant</h3>

<p>Mendix introduced <strong>Maia</strong>, an AI assistant that helps developers build applications faster. Maia can:</p>

<ul>
  <li>Generate microflows based on natural language descriptions</li>
  <li>Suggest data models and entity relationships</li>
  <li>Auto-create page layouts from requirements</li>
  <li>Debug and optimize existing logic</li>
</ul>

<p>With agentic capabilities, Maia is evolving from a simple suggestion engine to an <strong>autonomous development partner</strong> that can handle entire development subtasks independently.</p>

<h3>2. AI-Powered App Generation</h3>

<p>Imagine describing your business process in plain English and having an AI agent:</p>

<ol>
  <li>Analyze your requirements and identify entities, attributes, and relationships</li>
  <li>Generate the complete domain model</li>
  <li>Create CRUD pages with proper validation</li>
  <li>Build microflows for business logic</li>
  <li>Set up security roles and access rules</li>
  <li>Deploy the application to a test environment</li>
</ol>

<p>This is not science fiction — this is the direction Mendix is heading with agentic AI integration.</p>

<h3>3. Intelligent Testing Agents</h3>

<p>AI agents can now autonomously:</p>

<ul>
  <li>Generate comprehensive test scenarios from application specifications</li>
  <li>Execute automated testing cycles across different user roles</li>
  <li>Identify edge cases that human testers might miss</li>
  <li>Create regression test suites that evolve with your application</li>
</ul>

<h2>🏗️ Real-World Use Cases</h2>

<h3>Enterprise Process Automation</h3>

<p>A multinational company used Mendix + Agentic AI to build a <strong>procurement automation system</strong> in just 3 weeks. The AI agent:</p>

<ul>
  <li>Analyzed 500+ pages of procurement policies</li>
  <li>Generated a complete approval workflow with 12 decision points</li>
  <li>Created role-based dashboards for different stakeholders</li>
  <li>Integrated with SAP via REST APIs — all with minimal human intervention</li>
</ul>

<h3>Customer Service Intelligence</h3>

<p>By combining Mendix's frontend capabilities with agentic AI backends, companies are building:</p>

<ul>
  <li>Self-healing support systems that detect and resolve issues before customers notice</li>
  <li>Intelligent routing systems that understand context and urgency</li>
  <li>Predictive maintenance dashboards that prevent downtime</li>
</ul>

<h2>🔮 What's Next?</h2>

<p>The future of Mendix + Agentic AI includes:</p>

<ul>
  <li><strong>Multi-Agent Collaboration:</strong> Multiple AI agents working together — one for frontend design, another for backend logic, and a third for testing</li>
  <li><strong>Continuous Learning:</strong> AI agents that learn from your organization's coding patterns and best practices</li>
  <li><strong>Natural Language Deployment:</strong> Describing deployment requirements in plain language and having agents handle CI/CD pipelines</li>
  <li><strong>AI-Driven Optimization:</strong> Agents that continuously monitor app performance and automatically optimize microflows, queries, and UI rendering</li>
</ul>

<h2>💡 Key Takeaways</h2>

<p>The combination of  's low-code platform with Agentic AI represents a paradigm shift in how enterprise applications are built. As a Mendix developer, staying ahead of these trends means:</p>

<ol>
  <li><strong>Learning prompt engineering</strong> to effectively communicate with AI development assistants</li>
  <li><strong>Understanding AI agent architecture</strong> to build applications that leverage autonomous workflows</li>
  <li><strong>Embracing hybrid development</strong> where human creativity and AI efficiency work hand-in-hand</li>
  <li><strong>Upskilling in AI integration</strong> — REST APIs, webhooks, and event-driven architectures for connecting AI services</li>
</ol>

<p>The developers who embrace this shift will be the architects of the next generation of enterprise software. The question isn't whether AI will transform low-code development — it's how quickly you'll adapt to lead that transformation.</p>

<p><em>Stay tuned for more insights on how AI is reshaping the Mendix ecosystem. Follow me for the latest updates!</em></p>
`;

const blog2Content = `
<p>As a Mendix developer, you've probably needed a custom widget at some point — something the marketplace doesn't offer. Traditionally, building Mendix pluggable widgets meant hours of boilerplate setup, React configuration, and trial-and-error debugging. But with AI coding assistants like <strong>Claude</strong> and <strong>OpenAI Codex</strong>, you can now build production-ready Mendix widgets in a fraction of the time.</p>

<p>In this guide, I'll walk you through the entire process of creating a custom Mendix widget using AI tools — from concept to deployment.</p>

<h2>🛠️ Prerequisites</h2>

<ul>
  <li>Node.js (v18+) and npm installed</li>
  <li>Mendix Studio Pro (9.x or 10.x)</li>
  <li>Basic knowledge of React and TypeScript</li>
  <li>Access to Claude (Anthropic) or ChatGPT/Codex (OpenAI)</li>
  <li>Mendix Pluggable Widget Generator (<code>@mendix/pluggable-widget-generator</code>)</li>
</ul>

<h2>📦 Step 1: Scaffold Your Widget</h2>

<p>Start by generating the widget boilerplate using Mendix's official generator:</p>

<pre><code>npx @mendix/pluggable-widget-generator
? Widget name: SmartDataTable
? Widget Description: An intelligent data table with search, sort, and export
? Organization Name: com.mycompany
? Programming Language: TypeScript
? Widget Type: Web
? Widget Template: Full Boilerplate
? Unit Tests: Yes</code></pre>

<p>This creates the standard folder structure with <code>src/</code>, <code>typings/</code>, and configuration files.</p>

<h2>🤖 Step 2: Use Claude to Design Your Widget API</h2>

<p>Here's where AI becomes invaluable. Open Claude and describe what you want:</p>

<pre><code>Prompt to Claude:
"I'm building a Mendix pluggable widget called SmartDataTable. 
It should:
- Accept a data source (list of objects)  
- Display data in a sortable, searchable table
- Support column configuration via widget properties
- Include export to CSV functionality
- Have responsive design for mobile

Generate the widget XML configuration file (SmartDataTable.xml) 
with all necessary properties and the main React component 
(SmartDataTableComponent.tsx)."</code></pre>

<p>Claude will generate a complete XML configuration with proper Mendix property types:</p>

<pre><code>&lt;?xml version="1.0" encoding="utf-8" ?&gt;
&lt;widget id="com.mycompany.smartdatatable" 
        pluginWidget="true" 
        needsEntityContext="true"
        supportedPlatform="Web"&gt;
  &lt;name&gt;Smart Data Table&lt;/name&gt;
  &lt;description&gt;Intelligent data table with search and export&lt;/description&gt;
  
  &lt;properties&gt;
    &lt;propertyGroup caption="Data Source"&gt;
      &lt;property key="dataSource" type="datasource" isList="true"&gt;
        &lt;caption&gt;Data source&lt;/caption&gt;
      &lt;/property&gt;
      &lt;property key="columns" type="widgets" 
               dataSource="dataSource"&gt;
        &lt;caption&gt;Columns&lt;/caption&gt;
      &lt;/property&gt;
    &lt;/propertyGroup&gt;
    
    &lt;propertyGroup caption="Features"&gt;
      &lt;property key="enableSearch" type="boolean" 
               defaultValue="true"&gt;
        &lt;caption&gt;Enable Search&lt;/caption&gt;
      &lt;/property&gt;
      &lt;property key="enableExport" type="boolean" 
               defaultValue="true"&gt;
        &lt;caption&gt;Enable CSV Export&lt;/caption&gt;
      &lt;/property&gt;
      &lt;property key="pageSize" type="integer" 
               defaultValue="10"&gt;
        &lt;caption&gt;Rows Per Page&lt;/caption&gt;
      &lt;/property&gt;
    &lt;/propertyGroup&gt;
  &lt;/properties&gt;
&lt;/widget&gt;</code></pre>

<h2>⚡ Step 3: Generate Component Logic with Codex</h2>

<p>For complex component logic, OpenAI Codex (via ChatGPT or the API) excels at generating React code. Give it specific context:</p>

<pre><code>Prompt to Codex/ChatGPT:
"Generate a React TypeScript component for a Mendix pluggable 
widget that displays a data table. Include:
- useState for search query, sort column, sort direction, 
  current page
- useMemo for filtered and sorted data
- Search input with debounced filtering
- Clickable column headers for sorting (asc/desc toggle)
- Pagination with configurable page size
- CSV export function that downloads filtered data
- Responsive design using CSS modules
- Proper TypeScript types for Mendix widget props"</code></pre>

<p>The AI will generate a comprehensive component. Here's a simplified version of what you'll get:</p>

<pre><code>import { ReactElement, createElement, useState, useMemo } from "react";
import { SmartDataTableContainerProps } from "../typings/SmartDataTableProps";

export function SmartDataTable(
  props: SmartDataTableContainerProps
): ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState&lt;string | null&gt;(null);
  const [sortDirection, setSortDirection] = useState&lt;"asc" | "desc"&gt;("asc");
  const [currentPage, setCurrentPage] = useState(0);

  const filteredData = useMemo(() =&gt; {
    if (!props.dataSource?.items) return [];
    let items = [...props.dataSource.items];
    
    // Apply search filter
    if (searchQuery) {
      items = items.filter(item =&gt;
        Object.values(item).some(val =&gt;
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    return items;
  }, [props.dataSource, searchQuery, sortColumn, sortDirection]);

  const exportToCSV = () =&gt; {
    // AI-generated CSV export logic
    const csvContent = filteredData
      .map(row =&gt; Object.values(row).join(","))
      .join("\\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.csv";
    a.click();
  };

  return (
    &lt;div className="smart-data-table"&gt;
      {props.enableSearch &amp;&amp; (
        &lt;input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e =&gt; setSearchQuery(e.target.value)}
          className="sdt-search-input"
        /&gt;
      )}
      {/* Table rendering logic */}
    &lt;/div&gt;
  );
}</code></pre>

<h2>🎨 Step 4: AI-Assisted Styling</h2>

<p>Ask Claude to generate matching CSS modules:</p>

<pre><code>Prompt: "Generate CSS module styles for a modern data table 
widget. Include styles for:
- Clean table with alternating row colors
- Hover effects on rows
- Responsive design that converts to card layout on mobile
- Animated sort indicators
- Styled search input with icon
- Pagination buttons
Use a professional blue/gray color scheme."</code></pre>

<p>Claude will generate production-ready CSS with responsive breakpoints, animations, and proper BEM-style class naming — saving you hours of manual styling work.</p>

<h2>🧪 Step 5: AI-Generated Unit Tests</h2>

<p>Don't skip testing! Ask Claude or Codex to generate tests:</p>

<pre><code>Prompt: "Generate Jest + React Testing Library unit tests for 
my SmartDataTable Mendix widget component. Test:
- Renders without crashing
- Search filtering works correctly
- Sort toggle changes direction
- Pagination displays correct items
- CSV export generates proper output
- Empty state displays correctly"</code></pre>

<p>The AI will generate comprehensive test suites that cover edge cases you might not have considered.</p>

<h2>📦 Step 6: Build and Deploy</h2>

<pre><code># Build the widget
npm run build

# The .mpk file is generated in dist/
# Copy it to your Mendix project's widgets/ folder

# In Mendix Studio Pro:
# 1. Press F4 to synchronize
# 2. Find your widget in the toolbox
# 3. Drag it onto a page
# 4. Configure the properties</code></pre>

<h2>💡 Pro Tips for Using AI in Widget Development</h2>

<h3>1. Be Specific with Context</h3>
<p>Always tell the AI you're building a <strong>Mendix pluggable widget</strong>. This ensures it uses the correct APIs, property types, and patterns specific to the Mendix widget framework.</p>

<h3>2. Iterate Incrementally</h3>
<p>Don't try to generate everything at once. Build feature by feature:</p>
<ul>
  <li>First: Basic rendering</li>
  <li>Then: Search functionality</li>
  <li>Next: Sorting logic</li>
  <li>Finally: Export and pagination</li>
</ul>

<h3>3. Use AI for Debugging</h3>
<p>When you hit errors, paste the error message along with your code into Claude. It's remarkably good at identifying Mendix-specific issues like property binding problems, lifecycle hook issues, and TypeScript type mismatches.</p>

<h3>4. Review and Understand the Code</h3>
<p>AI-generated code is a starting point, not the final product. Always:</p>
<ul>
  <li>Review for security vulnerabilities</li>
  <li>Check for proper error handling</li>
  <li>Ensure Mendix-specific patterns are followed</li>
  <li>Validate performance with large datasets</li>
</ul>

<h2>🎯 Conclusion</h2>

<p>AI tools like Claude and Codex have fundamentally changed how we approach Mendix widget development. What used to take days can now be accomplished in hours. The key is knowing how to effectively communicate your requirements to these AI assistants and then applying your Mendix expertise to refine the output.</p>

<p>The combination of low-code platform knowledge + AI-assisted coding is a superpower that every modern Mendix developer should have in their toolkit.</p>

<p><em>Have you tried building widgets with AI assistance? Share your experience in the comments below!</em></p>
`;

async function replaceBlogs() {
  const { data: existingBlogs, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug')
    .order('created_at', { ascending: false });

  if (fetchError) {
    console.error('Error fetching existing blogs:', fetchError);
    return;
  }

  console.log('Current blogs:', existingBlogs.map(b => b.title));

  const pythonBlog = existingBlogs.find(b => b.slug === 'python-scripting-for-automation');
  const sqlBlog = existingBlogs.find(b => b.slug === 'sql-best-practices');

  if (pythonBlog) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', pythonBlog.id);
    if (error) console.error('Error deleting Python blog:', error);
    else console.log('Deleted: Python Scripting for Automation');
  }
  if (sqlBlog) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', sqlBlog.id);
    if (error) console.error('Error deleting SQL blog:', error);
    else console.log('Deleted: SQL Best Practices');
  }

  const newBlogs = [
    {
      title: 'Mendix Meets Agentic AI: The Future of Low-Code Development',
      slug: 'mendix-meets-agentic-ai-future-of-low-code',
      excerpt: 'Discover how Agentic AI is revolutionizing Mendix development — from autonomous app generation to intelligent testing agents that build, test, and optimize applications with minimal human intervention.',
      content: blog1Content,
      category: 'Mendix',
      tags: ['mendix', 'agentic-ai', 'low-code', 'artificial-intelligence', 'automation'],
      read_time: '10 min',
      image: '/mendix-agentic-ai.png',
      author: 'Saqlein Shaikh',
      visible: true,
      published_date: '2026-03-10'
    },
    {
      title: 'How to Create Mendix Widgets with Claude & Codex: A Developer Guide',
      slug: 'create-mendix-widgets-with-claude-and-codex',
      excerpt: 'A step-by-step guide to building custom Mendix pluggable widgets using AI coding assistants like Claude and OpenAI Codex — from scaffolding to deployment, with real prompts and code examples.',
      content: blog2Content,
      category: 'Mendix',
      tags: ['mendix', 'claude', 'codex', 'ai-coding', 'widgets', 'react', 'tutorial'],
      read_time: '12 min',
      image: '/mendix-widget-ai.png',
      author: 'Saqlein Shaikh',
      visible: true,
      published_date: '2026-03-14'
    }
  ];

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(newBlogs)
    .select();

  if (error) {
    console.error('Error inserting new blogs:', error);
  } else {
    console.log('\nSuccessfully added ' + data.length + ' new blogs!');
    data.forEach(b => console.log('  - ' + b.title + ' (' + b.slug + ')'));
  }

  const { data: allBlogs } = await supabase
    .from('blog_posts')
    .select('title, slug, category, published_date')
    .order('created_at', { ascending: false });

  console.log('\nAll blogs now:');
  allBlogs.forEach((b, i) => console.log('  ' + (i + 1) + '. [' + b.category + '] ' + b.title + ' (' + b.published_date + ')'));
}

replaceBlogs();
