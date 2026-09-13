'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { evaluationExamples } from '@/content'
import { track } from '@/lib/analytics'
import { renderInlineCode } from '@/lib/inline-code'
import { cn } from '@/lib/cn'

type Choice = 'A' | 'B'

const RUBRIC_MAX = 5

function ScoreDots({ score, label }: { score: number; label: string }) {
  return (
    <span
      role="img"
      className="inline-flex items-center gap-1"
      aria-label={`${label}, ${score} out of 5`}
    >
      {Array.from({ length: RUBRIC_MAX }, (_, index) => (
        <span
          key={index}
          aria-hidden
          className={cn('size-[6px] rounded-[1px]', index < score ? 'bg-accent' : 'bg-edge')}
        />
      ))}
    </span>
  )
}

export function RatingWidget() {
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState<Choice | null>(null)
  const example = evaluationExamples[index]

  if (!example) return null

  const answered = choice !== null
  const correct = choice === example.winner

  const pick = (next: Choice) => {
    if (answered) return
    setChoice(next)
    track('eval_widget_interaction', { example: example.id, choice: next })
  }

  const goTo = (next: number) => {
    setIndex(
      ((next % evaluationExamples.length) + evaluationExamples.length) % evaluationExamples.length,
    )
    setChoice(null)
  }

  return (
    <div className="lit @container rounded-[var(--radius-card)]">
      <div className="border-edge flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-7">
        <p className="label">{example.source}</p>
        <div className="flex items-center gap-2" role="group" aria-label="Choose an example">
          {evaluationExamples.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(itemIndex)}
              aria-current={itemIndex === index ? 'true' : undefined}
              className={cn(
                'mono grid h-11 w-11 place-items-center rounded-lg border text-[0.75rem] transition-colors',
                itemIndex === index
                  ? 'border-accent text-ink bg-accent-soft'
                  : 'border-edge-control text-ink-3 hover:text-ink',
              )}
            >
              <span aria-hidden>{String(itemIndex + 1).padStart(2, '0')}</span>
              <span className="sr-only">
                Example {itemIndex + 1}: {item.brief}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7">
        <p className="label mb-3">PROMPT</p>
        <p className="bg-sunken border-edge text-ink-2 mono rounded-lg border p-4 text-[0.8125rem] leading-relaxed">
          {renderInlineCode(example.prompt)}
        </p>

        <p className="label mt-8 mb-3">
          {answered ? 'THE ANNOTATED COMPARISON' : 'WHICH RESPONSE IS STRONGER'}
        </p>

        <div className="grid gap-4 @[46rem]:grid-cols-2">
          {example.responses.map((response) => {
            const isChosen = choice === response.key
            const isWinner = example.winner === response.key
            return (
              <button
                key={response.key}
                type="button"
                onClick={() => pick(response.key)}
                aria-pressed={isChosen}
                disabled={answered}
                className={cn(
                  'border-edge-control bg-canvas flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors disabled:cursor-default',
                  !answered && 'hover:border-accent/60',
                  answered && isWinner && 'border-accent',
                  answered && !isWinner && 'opacity-70',
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="mono text-ink text-[0.75rem] tracking-[0.14em]">
                    {response.model}
                  </span>
                  {answered ? (
                    <span
                      className={cn(
                        'mono flex items-center gap-1.5 text-[0.6875rem] tracking-[0.08em] uppercase',
                        isWinner ? 'text-accent' : 'text-ink-3',
                      )}
                    >
                      {isWinner ? <Check aria-hidden size={13} /> : null}
                      {isWinner ? 'Stronger' : 'Weaker'}
                    </span>
                  ) : null}
                </span>
                {response.text.map((paragraph) => (
                  <span
                    key={paragraph.slice(0, 20)}
                    className="text-ink-2 block text-[0.875rem] leading-relaxed"
                  >
                    {renderInlineCode(paragraph)}
                  </span>
                ))}
              </button>
            )
          })}
        </div>

        <div className="border-edge mt-6 border-t pt-5">
          <p className="label mb-4">RUBRIC</p>
          <ul className="grid gap-3 @[36rem]:grid-cols-2">
            {example.rubric.map((row) => (
              <li key={row.dimension} className="flex items-center justify-between gap-4">
                <span className="mono text-ink-2 text-[0.75rem]">{row.dimension}</span>
                {answered ? (
                  <span className="flex items-center gap-4">
                    <span className="mono text-ink-3 flex items-center gap-2 text-[0.6875rem]">
                      A <ScoreDots score={row.a} label={`Response A ${row.dimension}`} />
                    </span>
                    <span className="mono text-ink-3 flex items-center gap-2 text-[0.6875rem]">
                      B <ScoreDots score={row.b} label={`Response B ${row.dimension}`} />
                    </span>
                  </span>
                ) : (
                  <span className="mono text-ink-3 text-[0.6875rem]">scored after you choose</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div role="status" aria-live="polite" className="mt-6">
          {answered ? (
            <div className="bg-sunken border-edge rounded-xl border p-5">
              <p className="mono text-accent mb-3 text-[0.6875rem] tracking-[0.14em] uppercase">
                {correct
                  ? `You picked ${choice}. That matches the annotation.`
                  : `You picked ${choice}. The annotation went the other way.`}
              </p>
              <p className="text-ink mb-3 text-[0.9375rem] font-medium">
                {example.annotation.verdict}
              </p>
              <p className="text-ink-2 mb-3 text-[0.9375rem] leading-relaxed">
                {example.annotation.why}
              </p>
              <p className="label mb-2">FAILURE MODE IN THE WEAKER ANSWER</p>
              <p className="text-ink-2 text-[0.9375rem] leading-relaxed">
                {example.annotation.failureMode}
              </p>
            </div>
          ) : null}
        </div>

        {answered ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="mono border-edge-control text-ink hover:border-accent hover:text-accent inline-flex h-11 items-center rounded-full border px-5 text-[0.75rem] tracking-[0.08em] uppercase transition-colors"
            >
              Next example
            </button>
            <button
              type="button"
              onClick={() => setChoice(null)}
              className="mono text-ink-3 hover:text-ink inline-flex h-11 items-center px-2 text-[0.75rem] tracking-[0.08em] uppercase transition-colors"
            >
              Reset this one
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
