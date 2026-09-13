import type { PlannedPost } from './schema'

export const writingEmptyState = 'First posts landing soon'

/** The two posts that exist as drafts in /content/posts. */
export const plannedPosts: PlannedPost[] = [
  {
    title: 'What breaks when you put a pricing model in front of 200,000 predictions a month',
    slug: 'what-breaks-at-200k-predictions',
  },
  {
    title: 'Writing Terminal-Bench tasks that frontier agents actually fail',
    slug: 'terminal-bench-tasks-that-fail-agents',
  },
]
