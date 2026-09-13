import 'server-only'
import {
  capabilitySchema,
  caseStudySchema,
  clientSchema,
  educationSchema,
  evaluationExampleSchema,
  identitySchema,
  metricSchema,
  navItemSchema,
  plannedPostSchema,
  platformEdgeSchema,
  platformNodeSchema,
  platformStageSchema,
  roleSchema,
  specRowSchema,
} from './schema'
import { identity, navItems } from './site'
import { specRows } from './about'
import { evaluationMetrics, heroMetrics } from './metrics'
import { caseStudies } from './case-studies'
import { platformEdges, platformNodes, platformStages } from './platform'
import { evaluationClients, evaluationExamples } from './evaluation'
import { education, roles } from './experience'
import { capabilities } from './capabilities'
import { plannedPosts } from './writing'

/**
 * Runs once, on the server, during the build. Zod never reaches the browser
 * because this module is server only and nothing in the client tree imports it.
 * A bad metric or a missing case study field fails `next build`.
 */
export function validateContent(): void {
  identitySchema.parse(identity)
  for (const item of navItems) navItemSchema.parse(item)
  for (const row of specRows) specRowSchema.parse(row)
  for (const metric of [...heroMetrics, ...evaluationMetrics]) metricSchema.parse(metric)
  for (const study of caseStudies) caseStudySchema.parse(study)
  for (const stage of platformStages) platformStageSchema.parse(stage)
  for (const node of platformNodes) platformNodeSchema.parse(node)
  for (const edge of platformEdges) platformEdgeSchema.parse(edge)
  for (const example of evaluationExamples) evaluationExampleSchema.parse(example)
  for (const client of evaluationClients) clientSchema.parse(client)
  for (const role of roles) roleSchema.parse(role)
  for (const entry of education) educationSchema.parse(entry)
  for (const capability of capabilities) capabilitySchema.parse(capability)
  for (const post of plannedPosts) plannedPostSchema.parse(post)
}

validateContent()
