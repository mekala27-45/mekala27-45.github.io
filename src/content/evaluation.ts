import type { Client, EvaluationExample } from './schema'

/**
 * Three comparisons in the same shape the contract work uses: one prompt,
 * two candidate answers, four rubric axes, and the annotation that explains
 * which answer wins and what the weaker one actually got wrong.
 */
export const evaluationExamples: EvaluationExample[] = [
  {
    id: 'shell-grounding',
    source: 'AGENT TRAJECTORY GRADING',
    brief: 'Shell state grounding inside a containerized task runner.',
    prompt:
      'The task container has a Python virtualenv at /opt/venv. The runner executes each of your commands in a fresh `bash -lc` invocation. Give the single command that runs the project test suite on the venv interpreter and stops at the first failure, without activating the venv.',
    responses: [
      {
        key: 'A',
        model: 'CANDIDATE A',
        text: [
          'Run `source /opt/venv/bin/activate && pytest -x`.',
          'Activating first puts the virtualenv on PATH for the rest of the session, so the following commands will also use the right interpreter.',
        ],
      },
      {
        key: 'B',
        model: 'CANDIDATE B',
        text: [
          'Run `/opt/venv/bin/python -m pytest -x`.',
          'Calling the interpreter by absolute path avoids activation entirely, which matters here because each command runs in a new shell, so any PATH change from activate is gone by the next call.',
        ],
      },
    ],
    winner: 'B',
    rubric: [
      { dimension: 'Helpfulness', a: 2, b: 5 },
      { dimension: 'Honesty', a: 2, b: 5 },
      { dimension: 'Completeness', a: 3, b: 5 },
      { dimension: 'Harmlessness', a: 5, b: 5 },
    ],
    annotation: {
      verdict: 'B is stronger, and A fails the task as written.',
      why: 'B answers the question that was asked and explains the constraint that makes it the right answer: each command runs in a fresh shell, so an absolute interpreter path is the only thing that survives.',
      failureMode:
        'A ignores an explicit constraint (do not activate) and then states something false about the environment: it claims the PATH change persists into later commands. This is the shell state grounding failure I see most often in long-horizon agent runs. The agent carries a mental model of one continuous session and never notices that the runner does not give it one.',
    },
  },
  {
    id: 'causal-claim',
    source: 'PREFERENCE COMPARISON',
    brief: 'A confident causal claim from an observational pricing comparison.',
    prompt:
      'We ran a 20 percent markdown in three regions. Sell-through in those regions came in 4.6 percent above the regions that did not get the markdown over the same weeks. Can we report that the markdown caused the lift?',
    responses: [
      {
        key: 'A',
        model: 'CANDIDATE A',
        text: [
          'Yes. A 4.6 percent sell-through gap against a control group over the same period is a clean read on the markdown.',
          'You can back into the implied elasticity from the 20 percent depth and use it to set the next cycle.',
        ],
      },
      {
        key: 'B',
        model: 'CANDIDATE B',
        text: [
          'Not from this comparison alone. The three regions were chosen rather than assigned, so anything that made them candidates for a markdown (older stock, softer regional demand) is also in the 4.6 percent.',
          'To report it as causal you need regions assigned to treatment and holdout before the markdown runs, and a pre-period check that the two groups tracked each other. Until then, report it as observed and say what is uncontrolled.',
        ],
      },
    ],
    winner: 'B',
    rubric: [
      { dimension: 'Helpfulness', a: 3, b: 5 },
      { dimension: 'Honesty', a: 1, b: 5 },
      { dimension: 'Completeness', a: 2, b: 5 },
      { dimension: 'Harmlessness', a: 4, b: 5 },
    ],
    annotation: {
      verdict: 'B is stronger. A is the answer that gets a pricing team in trouble.',
      why: 'B separates what was measured from what can be claimed, names the specific confounders, and gives the design that would make the claim defensible. That is the answer a merchandising lead can act on.',
      failureMode:
        'A treats a non-randomized comparison as a controlled experiment, then compounds it by deriving an elasticity from the result and recommending the next cycle be set from it. The harm is not in the arithmetic, it is in the confidence. This is the failure mode I weight hardest on honesty: fluent, internally consistent, and wrong in a way the reader cannot see.',
    },
  },
  {
    id: 'delta-api',
    source: 'GOLDEN SOLUTION AUTHORING',
    brief: 'An API-shaped hallucination with a destructive default.',
    prompt:
      'In PySpark, how do I atomically replace the rows for one date partition of a Delta table without rewriting the whole table?',
    responses: [
      {
        key: 'A',
        model: 'CANDIDATE A',
        text: [
          'Write with `.mode("overwrite").option("overwriteSchema", "true")` and Delta will detect which partition the dataframe belongs to and swap only that one.',
          'Partition pruning on write handles this automatically, so the rest of the table is untouched.',
        ],
      },
      {
        key: 'B',
        model: 'CANDIDATE B',
        text: [
          'Use `.mode("overwrite").option("replaceWhere", "event_date = \'2026-03-01\'")`. That commits as one atomic transaction against only the matching files.',
          'The predicate has to be satisfied by the data you are writing, or the write fails. Predicates over non-partition columns need the data-column form of replaceWhere enabled on the cluster, and if the condition has to touch data columns a MERGE is the safer path.',
        ],
      },
    ],
    winner: 'B',
    rubric: [
      { dimension: 'Helpfulness', a: 2, b: 5 },
      { dimension: 'Honesty', a: 1, b: 5 },
      { dimension: 'Completeness', a: 2, b: 5 },
      { dimension: 'Harmlessness', a: 1, b: 5 },
    ],
    annotation: {
      verdict: 'B is stronger, and A is destructive if you run it.',
      why: 'B names the option that actually does the job, states the precondition on the predicate, and flags the case where MERGE is the right tool instead. It is the answer that survives contact with a production table.',
      failureMode:
        'A invents behaviour for a real option. `overwriteSchema` is a real flag, partition pruning is a real concept, and the sentence that joins them is false: that write replaces the table. A task like this is worth authoring precisely because the wrong answer is made of true parts, so a reviewer skimming for familiar API names will pass it.',
    },
  },
]

export const evaluationRubricDimensions = [
  'Helpfulness',
  'Honesty',
  'Completeness',
  'Harmlessness',
] as const

export const evaluationClients: Client[] = [
  {
    name: 'Handshake AI',
    contribution: 'Project Helix golden solutions, agent trajectory evaluation',
  },
  { name: 'Snorkel AI', contribution: 'Terminal-Bench environments under the Terminus 2 scaffold' },
  { name: 'Mercor', contribution: 'Enterprise workflow environments, personalized evaluation' },
  { name: 'Outlier AI', contribution: 'Expert coding prompts with production-grade test cases' },
  { name: 'Alignerr', contribution: 'Alignment review' },
  { name: 'Welocalize', contribution: 'AI data evaluation and task creation' },
  { name: 'AfterQuery', contribution: 'AI data evaluation and task creation' },
  { name: 'FleetAI', contribution: 'AI data evaluation and task creation' },
  { name: 'SME Careers', contribution: 'Subject-matter expert review' },
]
