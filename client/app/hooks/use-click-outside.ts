"use client"

import { useEffect, RefObject } from "react"

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
function handleClickOutside(event: MouseEvent) {
      if (event.target instanceof Node && ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [ref, handler])
}

