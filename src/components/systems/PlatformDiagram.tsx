import {
  PLATFORM_VIEWBOX,
  feedbackLabel,
  platformEdges,
  platformNodes,
  platformTitle,
} from '@/content'

type PlatformDiagramProps = {
  /** Highest stage reached, 1 to 7. Everything below it stays lit. */
  stage: number
}

const stateFor = (target: number, stage: number): 'idle' | 'past' | 'active' => {
  if (target === stage) return 'active'
  return target < stage ? 'past' : 'idle'
}

/**
 * Every activation state is a data attribute, so the scroll sequence only
 * swaps attributes and all of the paint work stays in CSS.
 */
export function PlatformDiagram({ stage }: PlatformDiagramProps) {
  return (
    <svg
      viewBox={`0 0 ${PLATFORM_VIEWBOX.width} ${PLATFORM_VIEWBOX.height}`}
      role="img"
      aria-labelledby="platform-diagram-title"
      className="platform-svg h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="platform-diagram-title">{platformTitle}</title>

      <defs>
        <marker
          id="p-arrow"
          viewBox="0 0 8 8"
          refX="6.5"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M1 1 L7 4 L1 7 z" fill="currentColor" />
        </marker>
      </defs>

      <g className="p-edges">
        {platformEdges.map((edge) => (
          <path
            key={edge.id}
            className="p-edge"
            data-edge={edge.id}
            data-stage={edge.stage}
            data-state={edge.stage <= stage ? 'on' : 'idle'}
            data-dashed={edge.dashed ? 'true' : 'false'}
            d={edge.d}
            pathLength={1}
            fill="none"
            markerEnd={edge.dashed ? undefined : 'url(#p-arrow)'}
          />
        ))}
      </g>

      <text className="p-loop-label" data-state={stage >= 7 ? 'on' : 'idle'} x={1022} y={352}>
        {feedbackLabel.map((line, index) => (
          <tspan key={line} x={1022} dy={index === 0 ? 0 : 15}>
            {line}
          </tspan>
        ))}
      </text>

      {platformNodes.map((node) => {
        const centerX = node.x + node.w / 2
        const centerY = node.y + node.h / 2
        const firstOffset = node.lines.length === 1 ? 4 : -3
        return (
          <g
            key={node.id}
            className="p-node"
            data-node={node.id}
            data-stage={node.stage ?? ''}
            data-kind={node.kind}
            data-state={stateFor(node.stage ?? 1, stage)}
          >
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={9} />
            {node.kind === 'stage' ? (
              <text className="p-node-index" x={node.x + 12} y={node.y + 18}>
                {String(node.stage).padStart(2, '0')}
              </text>
            ) : null}
            <text className="p-node-label" x={centerX} y={centerY} textAnchor="middle">
              {node.lines.map((line, index) => (
                <tspan key={line} x={centerX} dy={index === 0 ? firstOffset : 15}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
