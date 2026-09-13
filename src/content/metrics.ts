import type { Metric } from './schema'

/** The four cells under the hero. Numbers come from the resume, unrounded. */
export const heroMetrics: Metric[] = [
  {
    value: '$7.8M',
    label: 'INCREMENTAL REVENUE FROM ML',
    countTo: 7.8,
    prefix: '$',
    suffix: 'M',
    decimals: 1,
    tone: 'warm',
  },
  {
    value: '200K+',
    label: 'PREDICTIONS SERVED MONTHLY',
    countTo: 200,
    prefix: '',
    suffix: 'K+',
    decimals: 0,
    tone: 'accent',
  },
  {
    value: '99.9%',
    label: 'PLATFORM SERVICE SLA',
    countTo: 99.9,
    prefix: '',
    suffix: '%',
    decimals: 1,
    tone: 'accent',
  },
  {
    value: '4 YRS',
    label: 'PRODUCTION ML AND EVALUATION',
    countTo: 4,
    prefix: '',
    suffix: ' YRS',
    decimals: 0,
    tone: 'accent',
  },
]

/** The four cells inside the evaluation section. */
export const evaluationMetrics: Metric[] = [
  {
    value: '200+',
    label: 'GOLDEN SOLUTION TASKS',
    countTo: 200,
    prefix: '',
    suffix: '+',
    decimals: 0,
    tone: 'accent',
  },
  {
    value: '50+',
    label: 'TERMINAL-BENCH ENVIRONMENTS ACCEPTED',
    countTo: 50,
    prefix: '',
    suffix: '+',
    decimals: 0,
    tone: 'accent',
  },
  {
    value: '3,000+',
    label: 'PREFERENCE COMPARISONS',
    countTo: 3000,
    prefix: '',
    suffix: '+',
    decimals: 0,
    tone: 'accent',
  },
  {
    value: '98%+',
    label: 'SENIOR REVIEWER AGREEMENT',
    countTo: 98,
    prefix: '',
    suffix: '%+',
    decimals: 0,
    tone: 'accent',
  },
]
