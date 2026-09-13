'use client'

import { useEffect, useLayoutEffect } from 'react'

/** Layout effect in the browser, plain effect on the server, no warning. */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
