import { identity, seo, SITE_URL } from '@/content'

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: identity.name,
  url: SITE_URL,
  jobTitle: identity.title,
  description: seo.description,
  email: `mailto:${identity.email}`,
  telephone: '+1-862-440-8042',
  worksFor: { '@type': 'Organization', name: 'Walmart' },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Montclair State University',
      address: { '@type': 'PostalAddress', addressLocality: 'Montclair', addressRegion: 'NJ' },
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'KL University',
      address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressCountry: 'IN' },
    },
  ],
  knowsAbout: [
    'Machine learning engineering',
    'MLOps',
    'Azure Databricks',
    'Delta Lake',
    'MLflow',
    'PySpark',
    'Demand elasticity modeling',
    'Price optimization',
    'Frontier model evaluation',
    'RLHF',
    'Agentic trajectory evaluation',
  ],
  sameAs: [identity.linkedinUrl, identity.githubUrl],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Teaneck',
    addressRegion: 'NJ',
    addressCountry: 'US',
  },
}

export function PersonSchema() {
  return (
    <script
      type="application/ld+json"
      // Serialized from a local object, so there is no untrusted input here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  )
}
