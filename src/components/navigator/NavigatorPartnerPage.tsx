import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Send, Sparkles } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import AgentShell from '../shell/AgentShell';
import styles from './NavigatorPartnerPage.module.css';

interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const STARTERS = [
  'Why did retention dip this week on my focused game?',
  'Summarize open risks across all live titles',
  'Draft a player-facing note about tomorrow’s maintenance',
  'What should I test first in Studio playtest for Sector B?',
];

/**
 * Full-screen Navigator partner — type or talk (UI only) with workspace context.
 */
export default function NavigatorPartnerPage() {
  const { selectedExperience, workspaceName } = useWorkspace();
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, pending]);

  const pushAssistant = useCallback((text: string) => {
    setTurns((t) => [
      ...t,
      { id: `a-${Date.now()}`, role: 'assistant', text },
    ]);
    setPending(false);
  }, []);

  const send = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || pending) return;
    setInput('');
    setTurns((t) => [...t, { id: `u-${Date.now()}`, role: 'user', text: trimmed }]);
    setPending(true);
    window.setTimeout(() => {
      pushAssistant(
        `Prototype reply — I’m grounded on **${selectedExperience.title}** (${workspaceName}). ` +
          `For “${trimmed.slice(0, 48)}${trimmed.length > 48 ? '…' : ''}”, I’d pull live metrics, ` +
          `check recent deploys, and suggest the next best experiment. Hook me to your data for real answers.`,
      );
    }, 650);
  }, [input, pending, pushAssistant, selectedExperience.title, workspaceName]);

  return (
    <AgentShell>
      <div className={styles.page}>
        <div className={styles.backdrop} aria-hidden />

        <div className={styles.inner}>
          <header className={styles.hero}>
            <div className={styles.heroGlyph} aria-hidden>
              <Sparkles size={28} strokeWidth={2} />
            </div>
            <h1 className={styles.title}>Navigator</h1>
            <p className={styles.subtitle}>
              Your AI partner for anything — live ops, building, localization, or studio workflow.
              Context: <strong>{selectedExperience.title}</strong> · {workspaceName}
            </p>
          </header>

          {turns.length > 0 && (
            <div className={styles.thread} ref={listRef} role="log" aria-live="polite">
              {turns.map((m) => (
                <div
                  key={m.id}
                  className={m.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant}
                >
                  {m.text}
                </div>
              ))}
              {pending && <div className={styles.typing}>Navigator is thinking…</div>}
            </div>
          )}

          <div className={styles.composerWrap}>
            <div className={styles.chips} role="group" aria-label="Suggestions">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={styles.chip}
                  onClick={() => setInput(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className={styles.composer}>
              <textarea
                className={styles.textarea}
                placeholder="Ask anything… or use voice when available"
                rows={turns.length === 0 ? 3 : 2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                aria-label="Message Navigator"
              />
              <div className={styles.composerActions}>
                <button type="button" className={styles.micBtn} aria-label="Voice input (prototype)">
                  <Mic size={20} />
                </button>
                <button
                  type="button"
                  className={styles.sendBtn}
                  onClick={send}
                  disabled={!input.trim() || pending}
                  aria-label="Send"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
            <p className={styles.hint}>
              Enter to send · Shift+Enter for newline · Full-page chat (left <strong>Chat</strong> tab) —
              different from the ribbon <strong>sparkles</strong>, which toggles the side panel.
            </p>
          </div>
        </div>
      </div>
    </AgentShell>
  );
}
