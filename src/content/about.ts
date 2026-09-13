import type { SpecRow } from './schema'

/**
 * Marked up for the About column only. `**term**` renders as a named system
 * in primary ink, `##figure##` renders as a number in the accent colour.
 * The underlying sentences are the resume copy, unchanged.
 */
export const aboutParagraphs: readonly string[] = [
  'I am an **AI/ML Engineer** with ##four years## across production machine learning, data platform engineering and frontier model evaluation. I build systems that set prices for one of the largest retailers in the world, and I spend the rest of my time finding out where the newest language models break.',
  'At **Walmart** I built and operate the ML platform behind promotion and clearance pricing, running on **Azure Databricks**, **Delta Lake** and **MLflow** with infrastructure provisioned in **Terraform**. It serves over ##200,000## predictions per month. **PromotionsAI** and **ClearanceAI** sit on top of it and have driven ##7.8 million## dollars in incremental revenue. Standardizing MLOps across those pipelines cut research-to-production lead time by ##40 percent## and experiment turnaround by ##60 percent##.',
  'Alongside that, I evaluate and stress-test frontier models on contract for **Handshake AI**, **Snorkel AI**, **Mercor** and **Outlier**. I have authored more than ##200## golden-solution engineering tasks and over ##50## accepted **Terminal-Bench** environments. I am completing an **MS in Data Science** at **Montclair State University** in May 2026.',
] as const

export const specRows: SpecRow[] = [
  { label: 'ROLE', values: ['AI/ML Engineer, Walmart'] },
  { label: 'BASED', values: ['Teaneck, New Jersey'] },
  { label: 'WORK AUTH', values: ['US work authorized, no sponsorship required'] },
  {
    label: 'EDUCATION',
    values: [
      'MS Data Science, Montclair State (May 2026)',
      'BTech AI and Data Science, KL University (2024)',
    ],
  },
  { label: 'FOCUS', values: ['Production ML platforms, MLOps, model evaluation'] },
  { label: 'STACK', values: ['Python, PySpark, Databricks, MLflow, Terraform, Kubernetes'] },
  { label: 'AVAILABLE', values: ['Immediately, remote or hybrid in the NYC metro'] },
]
