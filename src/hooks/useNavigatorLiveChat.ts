import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

export interface NavTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const NAVIGATOR_STARTERS = [
  'Why did retention dip this week on my focused game?',
  'Summarize open risks across all live titles',
  'Draft a player-facing note about tomorrow’s maintenance',
  'What should I test first in Studio playtest for Sector B?',
] as const;

const RETENTION_EXACT = NAVIGATOR_STARTERS[0].toLowerCase();

function isRetentionQuery(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (t === RETENTION_EXACT) return true;
  return t.includes('retention') && (t.includes('dip') || t.includes('dropped') || t.includes('down'));
}

const THOUGHT_STEPS = [
  'Correlating 7-day retention with Sector B funnel and session replays…',
  'Timing guard dialogue against drop-off heatmaps (first 12s after spawn)…',
  'Diffing last night’s agent rollout vs. the pacing regression window…',
  'Drafting a non-blocking guide + optional skip with new telemetry hooks…',
] as const;

export const RETENTION_REPLY = (title: string) =>
  `For **${title}**, 1-day retention is down about **1.4 points** vs. last week — mostly from **Sector B** right after the guard line. Players are leaving within ~8s of that dialogue; matchmaking and store look flat, so this is almost certainly **pacing / friction in-world**, not acquisition.

**Likely causes**
• The guard reads as a hard stop before players understand the objective.
• Last night’s agent tweak lengthened VO; median time-to-first-action crossed a cliff.
• No alternate path — curious players bounce instead of skipping.

**Recommendations**
1. Shorten the guard to two lines + a **visible objective beacon** (you can verify in playtest).
2. Add a **soft skip** for repeat sessions (still log the choice).
3. Ship behind \`exp_sector_b_v2\` to **5% canary** and watch Sector B survival for 24h.

When you’re ready, I can turn (1) and (2) into a concrete Studio patch for you to review.`;

export const SOLUTION_SUMMARY =
  '**Proposed patch (prototype):** Replace the blocking guard with a **hologram guide** — 2-line VO, optional skip, and a pulsing beacon on the objective. I’ll pin the dialogue in Build so you can edit tone; telemetry events `sector_b_gate_start` / `sector_b_gate_skip` are stubbed for you. Use **Publish & deploy** when it looks right.';

export type NavDemoPhase =
  | 'idle'
  | 'retention_answering'
  | 'awaiting_implement'
  | 'implementing'
  | 'solution_ready';

export function useNavigatorLiveChat() {
  const navigate = useNavigate();
  const { selectedExperience, workspaceName } = useWorkspace();
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<NavTurn[]>([]);
  const [pending, setPending] = useState(false);
  const [demoPhase, setDemoPhase] = useState<NavDemoPhase>('idle');
  const [thoughtVisible, setThoughtVisible] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const thoughtTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, pending, demoPhase, thoughtVisible]);

  useEffect(() => {
    return () => {
      if (thoughtTimerRef.current) clearInterval(thoughtTimerRef.current);
    };
  }, []);

  const pushAssistant = useCallback((text: string) => {
    setTurns((t) => [...t, { id: `a-${Date.now()}`, role: 'assistant', text }]);
    setPending(false);
  }, []);

  const runGenericReply = useCallback(
    (trimmed: string) => {
      window.setTimeout(() => {
        pushAssistant(
          `I’m grounded on **${selectedExperience.title}** (${workspaceName}). For “${trimmed.slice(0, 52)}${trimmed.length > 52 ? '…' : ''}”, I’d pull live metrics, recent deploys, and funnel slices — hook real data for production. Want a template for player comms or a Studio test plan?`,
        );
      }, 650);
    },
    [pushAssistant, selectedExperience.title, workspaceName],
  );

  const sendWithText = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || pending) return;
      if (demoPhase === 'implementing') return;

      setInput('');
      setTurns((t) => [...t, { id: `u-${Date.now()}`, role: 'user', text: trimmed }]);
      setPending(true);

      if (isRetentionQuery(trimmed) && demoPhase === 'idle') {
        setDemoPhase('retention_answering');
        window.setTimeout(() => {
          pushAssistant(RETENTION_REPLY(selectedExperience.title));
          setDemoPhase('awaiting_implement');
        }, 900);
        return;
      }

      if (demoPhase === 'idle') {
        runGenericReply(trimmed);
        return;
      }

      window.setTimeout(() => {
        pushAssistant(
          `Got it. If you’re mid–Sector B fix, open **Build** from the ribbon — I’ll stay in the side panel and we can iterate on the guard flow together.`,
        );
      }, 600);
    },
    [pending, demoPhase, pushAssistant, runGenericReply, selectedExperience.title],
  );

  const send = useCallback(() => sendWithText(input), [input, sendWithText]);

  const onImplementFix = useCallback(() => {
    if (demoPhase !== 'awaiting_implement') return;
    setDemoPhase('implementing');
    setThoughtVisible(0);
    if (thoughtTimerRef.current) clearInterval(thoughtTimerRef.current);
    let step = 0;
    thoughtTimerRef.current = setInterval(() => {
      step += 1;
      setThoughtVisible(step);
      if (step >= THOUGHT_STEPS.length) {
        if (thoughtTimerRef.current) clearInterval(thoughtTimerRef.current);
        thoughtTimerRef.current = null;
        window.setTimeout(() => {
          setDemoPhase('solution_ready');
          setPending(false);
        }, 500);
      }
    }, 1100);
  }, [demoPhase]);

  const onContinueToBuild = useCallback(() => {
    sessionStorage.setItem('demoStudioCollab', '1');
    navigate('/studio');
  }, [navigate]);

  return {
    workspaceName,
    title: selectedExperience.title,
    input,
    setInput,
    turns,
    pending,
    demoPhase,
    thoughtVisible,
    thoughtSteps: THOUGHT_STEPS,
    listRef,
    send,
    sendWithText,
    onImplementFix,
    onContinueToBuild,
    starters: NAVIGATOR_STARTERS,
  };
}
