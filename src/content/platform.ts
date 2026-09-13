import type { PlatformEdge, PlatformNode, PlatformStage } from './schema'

export const PLATFORM_VIEWBOX = { width: 1200, height: 520 } as const

/**
 * Seven stages, in order. Each caption names the decision behind the stage
 * rather than restating what the stage does, because the decisions are what a
 * hiring manager is reading the diagram for. Every figure is from the resume.
 */
export const platformStages: PlatformStage[] = [
  {
    index: 1,
    title: 'SOURCE SYSTEMS',
    caption:
      'Merchandising, inventory and transaction feeds arrive from several upstream systems. The call was to treat this boundary as the place bad data stops rather than as glue between systems, so validation lives here and not three layers down.',
  },
  {
    index: 2,
    title: 'PYSPARK INGEST AND VALIDATION',
    caption:
      'I built reusable connector and transformation libraries instead of a script per feed, which turned a new source into configuration and cut onboarding one by 70 percent.',
  },
  {
    index: 3,
    title: 'DELTA LAKE',
    caption:
      'Training data and serving features read the same versioned tables. Choosing ACID storage over a file drop is what makes a model reproducible months later, when someone asks what it actually saw.',
  },
  {
    index: 4,
    title: 'FEATURE PIPELINES',
    caption:
      'Feature computation and registration are automated rather than hand run, so a feature has one implementation instead of one for training and another for serving. That decision is where 40 percent of the research-to-production lead time went.',
  },
  {
    index: 5,
    title: 'MODEL TRAINING',
    caption:
      'Distributed training on Spark clusters, templated. I chose job scaffolds over documentation, which took standing up a new experiment from days to under an hour.',
  },
  {
    index: 6,
    title: 'MLFLOW REGISTRY',
    caption:
      'Promotion is gated rather than conventional. Nothing serves traffic without a registry version carrying its parameters, metrics and lineage, which is what makes "which model priced this SKU" a lookup instead of an investigation.',
  },
  {
    index: 7,
    title: 'DOCKERIZED INFERENCE AND MONITORING',
    caption:
      'Blue-green releases through Azure Pipelines, built before anyone asked for them, so a bad model is a rollback and not an incident. 200,000+ predictions per month at a 99.9 percent SLA, with drift detection wired back into retraining rather than into a dashboard.',
  },
]

const NODE_H = 72

export const platformNodes: PlatformNode[] = [
  {
    id: 'source',
    stage: 1,
    lines: ['SOURCE SYSTEMS'],
    x: 40,
    y: 64,
    w: 210,
    h: NODE_H,
    kind: 'stage',
  },
  {
    id: 'ingest',
    stage: 2,
    lines: ['PYSPARK INGEST', 'AND VALIDATION'],
    x: 310,
    y: 64,
    w: 300,
    h: NODE_H,
    kind: 'stage',
  },
  { id: 'delta', stage: 3, lines: ['DELTA LAKE'], x: 675, y: 64, w: 200, h: NODE_H, kind: 'stage' },
  {
    id: 'features',
    stage: 4,
    lines: ['FEATURE PIPELINES'],
    x: 660,
    y: 224,
    w: 230,
    h: NODE_H,
    kind: 'stage',
  },
  {
    id: 'training',
    stage: 5,
    lines: ['MODEL TRAINING'],
    x: 360,
    y: 224,
    w: 230,
    h: NODE_H,
    kind: 'stage',
  },
  {
    id: 'registry',
    stage: 6,
    lines: ['MLFLOW REGISTRY'],
    x: 40,
    y: 224,
    w: 300,
    h: NODE_H,
    kind: 'stage',
  },
  {
    id: 'inference',
    stage: 7,
    lines: ['DOCKERIZED INFERENCE', 'AND MONITORING'],
    x: 40,
    y: 384,
    w: 300,
    h: NODE_H,
    kind: 'stage',
  },
  {
    id: 'api',
    stage: 7,
    lines: ['MERCHANDISING API'],
    x: 400,
    y: 384,
    w: 250,
    h: NODE_H,
    kind: 'sink',
  },
]

export const platformEdges: PlatformEdge[] = [
  { id: 'e1', stage: 2, d: 'M250 100 H310', dashed: false },
  { id: 'e2', stage: 3, d: 'M610 100 H675', dashed: false },
  { id: 'e3', stage: 4, d: 'M775 136 V224', dashed: false },
  { id: 'e4', stage: 5, d: 'M660 260 H590', dashed: false },
  { id: 'e5', stage: 6, d: 'M360 260 H340', dashed: false },
  { id: 'e6', stage: 7, d: 'M190 296 V384', dashed: false },
  { id: 'e7', stage: 7, d: 'M340 420 H400', dashed: false },
  { id: 'feedback', stage: 7, d: 'M650 420 H1010 V330 H475 V296', dashed: true },
]

export const feedbackLabel = ['MONITORING AND', 'DRIFT DETECTION'] as const

export const platformTitle =
  'Walmart pricing ML platform, from source systems to the merchandising API'
