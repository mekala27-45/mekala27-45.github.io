import type { Identity, NavItem } from './schema'

/** An unset CI variable arrives as an empty string, which `??` would not catch. */
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()

export const SITE_URL = (
  configuredUrl && configuredUrl.length > 0 ? configuredUrl : 'https://mekala27-45.github.io'
).replace(/\/$/, '')

export const identity: Identity = {
  name: 'Ajay Mekala',
  monogram: 'AM',
  title: 'AI/ML Engineer',
  subtitle: 'Production ML Platforms, MLOps, Frontier Model Evaluation',
  location: 'Teaneck, New Jersey',
  email: 'mekalaajayk@gmail.com',
  phone: '(862) 440-8042',
  phoneHref: 'tel:+18624408042',
  linkedin: 'linkedin.com/in/ajaymekala',
  linkedinUrl: 'https://www.linkedin.com/in/ajaymekala/',
  github: 'github.com/mekala27-45',
  githubUrl: 'https://github.com/mekala27-45',
  repoUrl: 'https://github.com/mekala27-45/mekala27-45.github.io',
  workAuth: 'Authorized to work in the US, F-1 OPT, no sponsorship required',
  status: 'Open to AI/ML Engineer roles, available immediately',
  resumePath: '/Ajay-Mekala-AI-ML-Engineer-Resume.pdf',
  resumeFileName: 'Ajay-Mekala-AI-ML-Engineer-Resume.pdf',
}

export const seo = {
  title: 'Ajay Mekala, AI/ML Engineer',
  description:
    'AI/ML Engineer at Walmart. Builds and operates the ML platform behind promotion and clearance pricing on Azure Databricks, Delta Lake and MLflow. Four years across production ML and frontier model evaluation.',
} as const

export const statusChip = {
  primary: 'OPEN TO AI/ML ENGINEER ROLES',
  secondary: ['F-1 OPT', 'NO SPONSORSHIP REQUIRED'],
} as const

export const hero = {
  roleLine: 'AI/ML ENGINEER',
  roleDetail: 'PRODUCTION ML PLATFORMS, MLOPS, FRONTIER MODEL EVALUATION',
  paragraph:
    "I build and operate the ML platform behind Walmart's promotion and clearance pricing. Four years shipping models into production, and evaluating the frontier models that are coming for the job.",
  primaryCta: { label: 'View the work', href: '#systems' },
  secondaryCta: { label: 'Download resume' },
} as const

export const navItems: NavItem[] = [
  { id: 'profile', label: 'Profile', href: '#profile' },
  { id: 'systems', label: 'Systems', href: '#systems' },
  { id: 'evaluation', label: 'Evaluation', href: '#evaluation' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'capabilities', label: 'Capabilities', href: '#capabilities' },
  { id: 'writing', label: 'Writing', href: '#writing' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export const trustBar = {
  label: 'WHERE THE WORK HAS SHIPPED',
  organizations: [
    'WALMART',
    'HANDSHAKE AI',
    'SNORKEL AI',
    'MERCOR',
    'OUTLIER AI',
    'ALIGNERR',
    'WELOCALIZE',
    'AFTERQUERY',
    'FLEETAI',
    'TECH MAHINDRA',
    'MONTCLAIR STATE UNIVERSITY',
  ],
} as const

export const contact = {
  headline: 'Currently open to AI/ML Engineer roles.',
  want: 'What I am looking for is production ML ownership, ideally in pricing, forecasting, recommendations, or model evaluation infrastructure.',
} as const

export const footer = {
  builtWith: 'BUILT WITH NEXT.JS, TAILWIND, MOTION AND WEBGL',
} as const
