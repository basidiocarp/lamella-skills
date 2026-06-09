import { type PreCompactPayload, type PreCompactHandler } from "./lib.ts"

export const PRECOMPACT_REFLECT_NUDGE = "Before context is compacted, consider running /reflexion:reflect to capture lessons and decisions from this session."

/**
 * PreCompact handler - called when Claude is about to compact the conversation
 * Emits a nudge to run /reflexion:reflect via systemMessage and hookSpecificOutput
 * for BOTH auto and manual triggers, without blocking compaction
 */
export const preCompact: PreCompactHandler = async (payload: PreCompactPayload) => {
  return {
    systemMessage: PRECOMPACT_REFLECT_NUDGE,
    hookSpecificOutput: {
      hookEventName: 'PreCompact',
      additionalContext: PRECOMPACT_REFLECT_NUDGE,
    },
  }
}
