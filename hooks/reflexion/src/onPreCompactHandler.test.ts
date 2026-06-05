import { describe, it, expect } from 'vitest'
import type { PreCompactPayload } from './lib'
import { preCompact, PRECOMPACT_REFLECT_NUDGE } from './onPreCompactHandler'

const createMockPayload = (trigger: 'auto' | 'manual'): PreCompactPayload => ({
  session_id: 'test-session-123',
  transcript_path: '/tmp/transcript.jsonl',
  hook_event_name: 'PreCompact',
  trigger,
})

describe('onPreCompactHandler', () => {
  describe('auto trigger', () => {
    it('should return systemMessage and hookSpecificOutput for auto trigger', async () => {
      const payload = createMockPayload('auto')

      const result = await preCompact(payload, [])

      expect(result).toHaveProperty('systemMessage')
      expect(result).toHaveProperty('hookSpecificOutput')
      expect(result.systemMessage).toBe(PRECOMPACT_REFLECT_NUDGE)
      expect(result.hookSpecificOutput).toEqual({
        hookEventName: 'PreCompact',
        additionalContext: PRECOMPACT_REFLECT_NUDGE,
      })
    })

    it('should not block compaction for auto trigger', async () => {
      const payload = createMockPayload('auto')

      const result = await preCompact(payload, [])

      expect(result.decision).toBeUndefined()
      expect(result.continue).toBeUndefined()
      expect(result.stopReason).toBeUndefined()
    })
  })

  describe('manual trigger', () => {
    it('should return systemMessage and hookSpecificOutput for manual trigger', async () => {
      const payload = createMockPayload('manual')

      const result = await preCompact(payload, [])

      expect(result).toHaveProperty('systemMessage')
      expect(result).toHaveProperty('hookSpecificOutput')
      expect(result.systemMessage).toBe(PRECOMPACT_REFLECT_NUDGE)
      expect(result.hookSpecificOutput).toEqual({
        hookEventName: 'PreCompact',
        additionalContext: PRECOMPACT_REFLECT_NUDGE,
      })
    })

    it('should not block compaction for manual trigger', async () => {
      const payload = createMockPayload('manual')

      const result = await preCompact(payload, [])

      expect(result.decision).toBeUndefined()
      expect(result.continue).toBeUndefined()
      expect(result.stopReason).toBeUndefined()
    })
  })

  describe('consistency', () => {
    it('should return identical response for both triggers', async () => {
      const autoResult = await preCompact(createMockPayload('auto'), [])
      const manualResult = await preCompact(createMockPayload('manual'), [])

      expect(autoResult).toEqual(manualResult)
    })
  })

  describe('nudge message', () => {
    it('should contain reference to /reflexion:reflect command', async () => {
      const payload = createMockPayload('auto')

      const result = await preCompact(payload, [])

      expect(result.systemMessage).toContain('/reflexion:reflect')
      expect(result.hookSpecificOutput?.additionalContext).toContain('/reflexion:reflect')
    })

    it('should have same message in both systemMessage and additionalContext', async () => {
      const payload = createMockPayload('auto')

      const result = await preCompact(payload, [])

      expect(result.systemMessage).toBe(result.hookSpecificOutput?.additionalContext)
    })
  })
})
