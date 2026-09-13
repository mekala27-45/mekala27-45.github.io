import { z } from 'zod'

/**
 * Every content module is validated against these schemas at import time,
 * which means a typo in a metric or a missing case study field fails the
 * build instead of shipping.
 */

const nonEmpty = z.string().min(1)

export const identitySchema = z.object({
  name: nonEmpty,
  monogram: nonEmpty,
  title: nonEmpty,
  subtitle: nonEmpty,
  location: nonEmpty,
  email: z.string().email(),
  phone: nonEmpty,
  phoneHref: nonEmpty,
  linkedin: nonEmpty,
  linkedinUrl: z.string().url(),
  github: nonEmpty,
  githubUrl: z.string().url(),
  repoUrl: z.string().url(),
  workAuth: nonEmpty,
  status: nonEmpty,
  resumePath: nonEmpty,
  resumeFileName: nonEmpty,
})

export const metricSchema = z.object({
  value: nonEmpty,
  label: nonEmpty,
  /** Numeric target for the count up. Null means the value never animates. */
  countTo: z.number().nullable(),
  prefix: z.string(),
  suffix: z.string(),
  decimals: z.number().int().min(0).max(2),
  tone: z.enum(['accent', 'warm']),
})

export const navItemSchema = z.object({
  id: nonEmpty,
  label: nonEmpty,
  href: nonEmpty,
})

export const specRowSchema = z.object({
  label: nonEmpty,
  values: z.array(nonEmpty).min(1),
})

export const caseStudyMetricSchema = z.object({
  value: nonEmpty,
  label: nonEmpty,
  tone: z.enum(['accent', 'warm']),
})

export const caseStudySchema = z.object({
  slug: z.enum(['promotions-ai', 'clearance-ai', 'ml-platform', 'evaluation']),
  eyebrow: z.enum(['PRICING ML', 'PLATFORM', 'EVALUATION']),
  name: nonEmpty,
  thesis: nonEmpty,
  summary: nonEmpty,
  metrics: z.array(caseStudyMetricSchema).min(2),
  tech: z.array(nonEmpty).min(3),
  narrative: z.object({
    context: z.array(nonEmpty).min(1),
    constraints: z.array(nonEmpty).min(1),
    built: z.array(nonEmpty).min(1),
    architecture: z.array(nonEmpty).min(1),
    results: z.array(nonEmpty).min(1),
    differently: z.array(nonEmpty).min(1),
  }),
})

export const platformStageSchema = z.object({
  index: z.number().int().min(1).max(7),
  title: nonEmpty,
  caption: nonEmpty,
})

export const platformNodeSchema = z.object({
  id: nonEmpty,
  stage: z.number().int().min(1).max(7).nullable(),
  lines: z.array(nonEmpty).min(1).max(3),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  kind: z.enum(['stage', 'sink']),
})

export const platformEdgeSchema = z.object({
  id: nonEmpty,
  /** The stage number that lights this edge. */
  stage: z.number().int().min(1).max(8),
  d: nonEmpty,
  dashed: z.boolean(),
})

export const evaluationExampleSchema = z.object({
  id: nonEmpty,
  source: nonEmpty,
  brief: nonEmpty,
  prompt: nonEmpty,
  responses: z
    .array(
      z.object({
        key: z.enum(['A', 'B']),
        model: nonEmpty,
        text: z.array(nonEmpty).min(1),
      }),
    )
    .length(2),
  winner: z.enum(['A', 'B']),
  rubric: z
    .array(
      z.object({
        dimension: z.enum(['Helpfulness', 'Honesty', 'Completeness', 'Harmlessness']),
        a: z.number().int().min(1).max(5),
        b: z.number().int().min(1).max(5),
      }),
    )
    .length(4),
  annotation: z.object({
    verdict: nonEmpty,
    why: nonEmpty,
    failureMode: nonEmpty,
  }),
})

export const clientSchema = z.object({
  name: nonEmpty,
  contribution: nonEmpty,
})

export const roleSchema = z.object({
  id: nonEmpty,
  title: nonEmpty,
  company: nonEmpty,
  location: nonEmpty,
  dates: nonEmpty,
  clients: z.array(nonEmpty).optional(),
  bullets: z.array(nonEmpty).min(3).max(5),
  tech: z.array(nonEmpty).min(3),
})

export const educationSchema = z.object({
  degree: nonEmpty,
  school: nonEmpty,
  location: nonEmpty,
  date: nonEmpty,
})

export const capabilitySchema = z.object({
  name: nonEmpty,
  group: z.enum([
    'Machine Learning',
    'MLOps and Infrastructure',
    'Data Engineering',
    'Cloud and Storage',
    'Evaluation',
    'Analytics',
    'Languages',
  ]),
  depth: z.enum(['daily', 'working']),
})

export const plannedPostSchema = z.object({
  title: nonEmpty,
  slug: nonEmpty,
})

export type Identity = z.infer<typeof identitySchema>
export type Metric = z.infer<typeof metricSchema>
export type NavItem = z.infer<typeof navItemSchema>
export type SpecRow = z.infer<typeof specRowSchema>
export type CaseStudy = z.infer<typeof caseStudySchema>
export type CaseStudySlug = CaseStudy['slug']
export type CaseStudyMetric = z.infer<typeof caseStudyMetricSchema>
export type PlatformStage = z.infer<typeof platformStageSchema>
export type PlatformNode = z.infer<typeof platformNodeSchema>
export type PlatformEdge = z.infer<typeof platformEdgeSchema>
export type EvaluationExample = z.infer<typeof evaluationExampleSchema>
export type Client = z.infer<typeof clientSchema>
export type Role = z.infer<typeof roleSchema>
export type Education = z.infer<typeof educationSchema>
export type Capability = z.infer<typeof capabilitySchema>
export type CapabilityGroup = Capability['group']
export type PlannedPost = z.infer<typeof plannedPostSchema>
