// ============================================================
// src/components/ui/ScaleWrapper.tsx
// Shared scale-to-fit wrapper for PDF preview
// Extracted from PreviewClient.tsx and cv/[shareId]/page.tsx
// ============================================================

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export const PDF_WIDTH_PX = 794
export const PDF_PAGE_HEIGHT_PX = 1123

interface ScaleWrapperProps {
  children: React.ReactNode
  pageCount: number
  /** Optional ref to the inner scaled div (for PDF export via html2canvas) */
  innerRef?: React.RefObject<HTMLDivElement>
}

/**
 * ScaleWrapper — scales a fixed-width PDF preview to fit the available container width.
 * Uses ResizeObserver to recalculate scale on container resize.
 */
export function ScaleWrapper({ children, pageCount, innerRef }: ScaleWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const updateScale = useCallback(() => {
    if (!containerRef.current) return
    const available = containerRef.current.clientWidth - 24
    setScale(Math.min(1, available / PDF_WIDTH_PX))
  }, [])

  useEffect(() => {
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [updateScale])

  const scaledHeight = pageCount * PDF_PAGE_HEIGHT_PX * scale

  return (
    <div ref={containerRef} className="w-full">
      <div style={{ height: `${scaledHeight}px` }} className="relative flex justify-center">
        <div
          ref={innerRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: PDF_WIDTH_PX,
            position: 'absolute',
            top: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}