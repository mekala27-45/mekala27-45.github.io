export type AnalyticsEvent =
  | 'resume_download'
  | 'email_copy'
  | 'phone_copy'
  | 'case_study_open'
  | 'palette_open'
  | 'eval_widget_interaction'
  | 'scroll_depth'
  | 'theme_toggle'

type Payload = Record<string, string | number | boolean | null>

/**
 * One entry point for custom events. The vendor module is imported on first
 * use rather than at module scope, so nothing analytics related sits in the
 * critical path and a blocked request can never break an interaction.
 */
export function track(event: AnalyticsEvent, payload?: Payload): void {
  if (typeof window === 'undefined') return
  void import('@vercel/analytics')
    .then((mod) => mod.track(event, payload))
    .catch(() => {
      // Reporting is best effort.
    })
}
