import type { CaseStudy, CaseStudySlug } from './schema'

/**
 * Every figure here is taken from the resume payload. The Context, What I
 * built and What I would do differently sections are the written source text.
 * Constraints, Architecture and Results are assembled from the same facts so
 * each case study reads as one narrative rather than a bullet dump.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: 'promotions-ai',
    eyebrow: 'PRICING ML',
    name: 'PromotionsAI',
    thesis:
      'Automated SKU selection for promotions across every customer touchpoint, pushing recommendations straight into the merchandising API.',
    summary:
      'Scores promotion candidates, selects the SKUs and writes the recommendations into the system merchandising already runs on.',
    metrics: [
      { value: '$5.5M', label: 'FIRST FULL FISCAL YEAR', tone: 'warm' },
      { value: '$2.3M', label: 'FOLLOWING QUARTER', tone: 'warm' },
      { value: 'Extended', label: 'TO FURTHER MERCHANDISING USE CASES', tone: 'accent' },
    ],
    tech: [
      'Python',
      'PySpark',
      'Azure Databricks',
      'Delta Lake',
      'MLflow',
      'XGBoost',
      'Docker',
      'Azure Pipelines',
    ],
    narrative: {
      context: [
        'Promotional SKU selection was manual and slow, and the merchandising teams could not evaluate candidate promotions across all touchpoints at once.',
        'That is a throughput problem before it is a modelling problem. The people making the calls were choosing from the slice of the catalogue they had time to look at, not from the whole of it.',
      ],
      constraints: [
        'The serving contract was fixed before the model was. Recommendations had to arrive in the merchandising API the teams already worked in, because an output that lands anywhere else does not get used.',
        'Nothing reaches production without passing through the MLflow registry, so the whole path had to be versioned and promotable rather than a notebook that happened to run.',
        'Revenue is the acceptance metric. An offline lift estimate is an argument, not evidence, which is the constraint that shaped the first two experiment cycles.',
      ],
      built: [
        'A model and serving path that scores promotion candidates, selects SKUs and writes recommendations directly into the merchandising API, with the whole path versioned through the MLflow registry.',
        'Candidate generation and scoring run as PySpark jobs on Azure Databricks over Delta Lake tables, so the training data and the serving features come out of the same versioned source.',
      ],
      architecture: [
        'Feature computation and candidate scoring run on the shared platform: PySpark on Azure Databricks reading Delta Lake, with feature registration automated rather than hand-run.',
        'The gradient boosted scorer is tracked in MLflow through training, so every promoted version carries its parameters, metrics and data lineage with it.',
        'Inference is Dockerized and released through Azure Pipelines on the same blue-green path as the rest of the platform, which is what makes a bad release a rollback instead of an incident.',
        'The output is a write into the merchandising API, not a dashboard. The recommendation shows up where the decision is already being made.',
      ],
      results: [
        '5.5 million dollars in incremental revenue in its first full fiscal year.',
        '2.3 million dollars in the following quarter.',
        'The approach has since been extended to additional merchandising use cases.',
      ],
      differently: [
        'Invest earlier in the offline-to-online metric correlation, because the first two experiment cycles were spent establishing that the offline lift estimate tracked the realized revenue lift.',
        'That work had to happen either way. Doing it first would have bought back two cycles of calendar time and made the first result easier to defend.',
      ],
    },
  },
  {
    slug: 'clearance-ai',
    eyebrow: 'PRICING ML',
    name: 'ClearanceAI',
    thesis:
      'A markdown price optimizer that sets regional markdowns twice a month by combining demand elasticity models with stock age heuristics.',
    summary:
      'Elasticity per product family, combined with how long stock has been sitting, streamed out as dynamic price feeds.',
    metrics: [
      { value: '4.6%', label: 'LIFT IN SELL-THROUGH', tone: 'accent' },
      { value: 'Bi-monthly', label: 'REGIONAL MARKDOWN CADENCE', tone: 'accent' },
      { value: 'Streamed', label: 'DYNAMIC PRICE FEEDS TO MERCHANDISING APIS', tone: 'accent' },
    ],
    tech: [
      'Python',
      'PySpark',
      'Delta Lake',
      'MLflow',
      'demand elasticity modeling',
      'FastAPI',
      'Kubernetes',
    ],
    narrative: {
      context: [
        'Markdown timing and depth were set by heuristics that did not account for regional demand differences or how long stock had been sitting.',
        'A markdown that is too shallow leaves inventory in the building, and one that is too deep gives away margin on units that would have sold anyway. Both failures are invisible unless the regions are compared against each other.',
      ],
      constraints: [
        'Markdowns are a scheduled business process, not a live auction. The model had to produce a defensible recommendation on a bi-monthly cadence rather than react continuously.',
        'Regional demand differences are the whole point, so a single national elasticity curve would have reproduced the problem the system was built to fix.',
        'Downstream systems consume price feeds, so the output had to be a stream the merchandising APIs could take, not a report someone re-keys.',
      ],
      built: [
        'Elasticity models per product family combined with stock age heuristics, producing regional markdown recommendations on a bi-monthly cadence, streamed as dynamic price feeds.',
        'The MLOps stack underneath it: training, registry promotion, serving and monitoring, on the same standard as the rest of the pricing platform.',
      ],
      architecture: [
        'Demand elasticity is estimated per product family from Delta Lake history with PySpark, so the unit of the model matches the unit merchandising actually reasons about.',
        'Stock age enters as a heuristic layer over the elasticity estimate rather than as another feature, which keeps the markdown recommendation explainable to the people signing off on it.',
        'Models are versioned in MLflow and served behind FastAPI on Kubernetes, and the recommendations leave as dynamic price feeds to the merchandising APIs.',
      ],
      results: [
        'Sell-through lifted 4.6 percent.',
        'Regional markdowns now set twice a month from the model rather than from a flat heuristic.',
        'Dynamic price feeds stream to the merchandising APIs on the same cadence.',
      ],
      differently: [
        'Build the regional holdout structure into the first release rather than retrofitting it, since clean regional controls are what made the sell-through number defensible.',
        'The measurement design is part of the product. Retrofitting it cost a cycle and made the early results harder to argue for than they needed to be.',
      ],
    },
  },
  {
    slug: 'ml-platform',
    eyebrow: 'PLATFORM',
    name: 'ML Platform and MLOps',
    thesis:
      "The Azure Databricks platform, ingestion layer and MLOps standard that PromotionsAI, ClearanceAI and the rest of the team's models run on.",
    summary:
      'The ingestion, feature, registry and release path underneath both pricing systems, plus the standard everyone else builds against.',
    metrics: [
      { value: '200K+', label: 'PREDICTIONS PER MONTH', tone: 'accent' },
      { value: '40%', label: 'CUT IN RESEARCH TO PRODUCTION LEAD TIME', tone: 'accent' },
      { value: '60%', label: 'FASTER EXPERIMENT TURNAROUND', tone: 'accent' },
      { value: '99.9%', label: 'SERVICE SLA', tone: 'accent' },
      { value: '70%', label: 'FASTER NEW SOURCE ONBOARDING', tone: 'accent' },
    ],
    tech: [
      'Azure Databricks',
      'Delta Lake',
      'MLflow',
      'Terraform',
      'PySpark',
      'Docker',
      'Kubernetes',
      'Kafka',
      'Azure Event Hubs',
      'Azure Pipelines',
      'Power BI',
    ],
    narrative: {
      context: [
        'Two pricing systems and the rest of the team needed the same things: clean ingested data, features that are computed the same way in training and serving, a registry that gates promotion, and a release path that can be rolled back.',
        'Built once as a platform, those are leverage. Built per project, they are four different ways to break production.',
      ],
      constraints: [
        'Infrastructure is provisioned in Terraform, so environments have to be reproducible rather than clicked together.',
        'The platform carries live pricing traffic, which puts a 99.9 percent service SLA on every change to it.',
        'Merchandising, finance and engineering all need to see the same numbers, so KPI impact, data lineage and model health had to be surfaced rather than explained on request.',
      ],
      built: [
        'Automated feature pipelines and model registry promotion, Dockerized inference, unified MLflow lineage, blue-green releases through Azure Pipelines, and an automated A/B testing harness.',
        'PySpark and Delta Lake ingestion with validation and enrichment, plus reusable connector and transformation libraries.',
        'Cookiecutter project templates, Databricks job scaffolds and distributed training playbooks for Spark clusters.',
        'Power BI and Azure-native dashboards surfacing KPI impact, data lineage and model health to merchandising, finance and engineering.',
        'The runbooks and reproducible notebooks that carry new engineers through onboarding and hold up under audit review.',
      ],
      architecture: [
        'Source systems land through PySpark ingestion with validation and enrichment, against reusable connector libraries rather than a new script per feed.',
        'Delta Lake is the versioned single source of truth, so training data and serving features are drawn from the same tables.',
        'Feature pipelines compute and register automatically, distributed training runs on Spark clusters from templated jobs, and MLflow holds lineage and gates promotion.',
        'Inference ships as Docker images through blue-green releases on Azure Pipelines, with monitoring and drift detection feeding back into retraining.',
      ],
      results: [
        'Over 200,000 predictions served per month.',
        'Research-to-production lead time cut 40 percent, experiment turnaround cut 60 percent.',
        'A 99.9 percent service SLA held, with incident MTTR halved.',
        'New source onboarding 70 percent faster on the reusable connector libraries.',
      ],
      differently: [
        'Ship the dashboards that show model health and data lineage at the same time as the first pipeline, not after it. The platform work is easier to fund and easier to defend once the people outside the team can see the same numbers you can.',
      ],
    },
  },
  {
    slug: 'evaluation',
    eyebrow: 'EVALUATION',
    name: 'Frontier Model Evaluation',
    thesis:
      'Four years authoring benchmarks, grading agent trajectories and producing alignment training data for the labs building frontier models.',
    summary:
      'Benchmark authoring, agent trajectory grading and preference data for Handshake AI, Snorkel AI, Mercor and Outlier.',
    metrics: [
      { value: '200+', label: 'GOLDEN SOLUTION ENGINEERING TASKS', tone: 'accent' },
      { value: '50+', label: 'ACCEPTED TERMINAL-BENCH ENVIRONMENTS', tone: 'accent' },
      { value: '3,000+', label: 'PREFERENCE COMPARISONS', tone: 'accent' },
      { value: '98%+', label: 'AGREEMENT WITH SENIOR REVIEWERS', tone: 'accent' },
      { value: '500+', label: 'AI-GENERATED PULL REQUESTS ADJUDICATED', tone: 'accent' },
      { value: '150+', label: 'VALIDATED MODEL-STUMPING PROMPTS', tone: 'accent' },
      { value: '800+', label: 'EXPERT CODING PROMPTS', tone: 'accent' },
    ],
    tech: [
      'RLHF',
      'DPO',
      'SFT',
      'Agentic Evaluation',
      'Terminal-Bench',
      'Rubric Design',
      'Red-Teaming',
      'Python',
      'TypeScript',
      'Go',
    ],
    narrative: {
      context: [
        'The labs training frontier models need problems the models cannot already solve, graded by someone who can tell a correct trajectory from a lucky one.',
        'It is close to code review, with one difference that changes the job: a failing agent does not throw. It produces a plausible run that quietly assumed shell state survived a runner boundary, and the grade has to say which of the two it was.',
      ],
      constraints: [
        'A benchmark task has to be hard for a frontier agent and still unambiguous and solvable, or it measures the prompt rather than the model.',
        'Preference data is only worth what its consistency is worth, which is why blind audit rounds against senior reviewers are the real acceptance test.',
        'Agent trajectories are long. Grading them means holding the whole run in view, not scoring the final answer.',
      ],
      built: [
        "Authored 200+ golden-solution software engineering tasks for Handshake AI's Project Helix, building multi-file repository problems with hidden test suites and graded difficulty tiers across Python, TypeScript and Go, and passed Helix Screening with a top-decile reviewer rating.",
        'Evaluated long-horizon coding-agent trajectories on real software workflows, scoring tool-use correctness, sub-goal decomposition, state tracking and recovery from failure, and surfaced systematic failures in tool-call sequencing and shell command grounding that fed directly into agent fine-tuning.',
        'Authored 50+ accepted Terminal-Bench tasks for Snorkel AI under the Terminus 2 agent scaffold: containerized environments with reference solutions and automated verification tests, calibrated to challenge frontier agents while staying unambiguous and solvable.',
        'Designed 150+ model-stumping prompts validated against GPT, Claude and Gemini-class baselines, plus graduate-level STEM question-answer pairs for Humanity’s Last Exam-class reasoning benchmarks that passed multi-layer expert review.',
        'Ran 3,000+ side-by-side preference comparisons producing RLHF and DPO training data across helpfulness, harmlessness, honesty and completeness.',
      ],
      architecture: [
        'A Terminal-Bench task is a container, a reference solution and an automated verification test. The verification test is the specification, so it is written before the task is called finished.',
        'Trajectory grading runs against a rubric with separate scores for tool-use correctness, sub-goal decomposition, state tracking and recovery from failure, which is what turns a failed run into a labelled failure mode.',
        'Preference comparisons are scored on helpfulness, harmlessness, honesty and completeness as separate axes, then reconciled against senior reviewers in blind audit rounds.',
        'Safety-tier review sits on top, flagging policy violations, jailbreak attempts and unsafe completions and recommending rewrites that hold policy without dropping helpfulness.',
      ],
      results: [
        '200+ golden-solution engineering tasks accepted, with a top-decile reviewer rating at Helix Screening.',
        '50+ Terminal-Bench environments accepted under the Terminus 2 scaffold.',
        '3,000+ preference comparisons at 98 percent or better agreement with senior reviewers.',
        '500+ AI-generated pull requests adjudicated, 150+ validated model-stumping prompts, 800+ expert coding prompts.',
        '20+ enterprise workflow environments simulating accounting, procurement and sales operations, with submissions accepted at scoring tiers up to 40 percent above baseline.',
      ],
      differently: [
        'Write the verification test before the task prose, every time. The tasks that came back for revision were almost always the ones where the test was written last and quietly allowed two readings of the problem.',
      ],
    },
  },
]

export const caseStudyBySlug = (slug: string): CaseStudy | undefined =>
  caseStudies.find((study) => study.slug === slug)

export const caseStudySlugs: CaseStudySlug[] = caseStudies.map((study) => study.slug)

/**
 * Only the fields the summary card paints. Handing a whole case study across
 * the server boundary would serialise all six narrative sections into the page
 * payload for text the card never shows.
 */
export type CaseStudyCardData = Pick<
  CaseStudy,
  'slug' | 'eyebrow' | 'name' | 'summary' | 'metrics' | 'tech'
>

export function toCardData(study: CaseStudy): CaseStudyCardData {
  return {
    slug: study.slug,
    eyebrow: study.eyebrow,
    name: study.name,
    summary: study.summary,
    metrics: study.metrics.slice(0, 3),
    tech: study.tech.slice(0, 6),
  }
}
