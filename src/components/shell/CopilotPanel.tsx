import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronRight,
  Mic,
  Send,
  PanelRightClose,
  PanelRightOpen,
  Radio,
  ArrowRight,
} from 'lucide-react';
import {
  useNavigatorLiveChat,
  SOLUTION_SUMMARY,
  type NavTurn,
} from '../../hooks/useNavigatorLiveChat';
import styles from './CopilotPanel.module.css';

export type CopilotMode = 'ops' | 'build' | 'manage' | 'lexicon';

interface CopilotPanelProps {
  mode: CopilotMode;
  open: boolean;
  onToggle: () => void;
  workspaceLine?: string;
  demoBuildCollaboration?: boolean;
}

const BUILD_CHIPS = ['Soften NPC aggro', 'Patch from playtest', 'Revert last agent edit'];
const MANAGE_CHIPS = ['Prioritize by revenue', 'Who owns what?', 'Localization gaps'];
const LEX_CHIPS = ['Audit JA strings', 'Flag tone issues', 'Ship glossary v2'];

function FormattedNavLine({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i, arr) => (
        <span key={i}>
          {line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('`') && part.endsWith('`')) {
              return (
                <code key={j} className={styles.inlineCode}>
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          })}
          {i < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

function OpsTurnBubble({ turn }: { turn: NavTurn }) {
  const cls = turn.role === 'user' ? styles.bubbleUser : styles.bubbleAgent;
  return (
    <div className={`${styles.bubble} ${cls}`}>
      <FormattedNavLine text={turn.text} />
    </div>
  );
}

export default function CopilotPanel({
  mode,
  open,
  onToggle,
  workspaceLine,
  demoBuildCollaboration = false,
}: CopilotPanelProps) {
  const [draft, setDraft] = useState('');
  const navigate = useNavigate();
  const liveChat = useNavigatorLiveChat();

  const chips =
    mode === 'build'
      ? BUILD_CHIPS
      : mode === 'manage'
        ? MANAGE_CHIPS
        : mode === 'lexicon'
          ? LEX_CHIPS
          : [];

  const headline =
    mode === 'build'
      ? 'Navigator · Build'
      : mode === 'manage'
        ? 'Navigator · Setup'
        : mode === 'lexicon'
          ? 'Navigator · Localization'
          : 'Navigator · Live';

  const openLiveNavigator = () => {
    navigate('/home#live-navigator');
  };

  return (
    <div className={styles.dockRoot}>
      <aside
        className={`${styles.panel} ${open ? styles.panelOpen : styles.panelCollapsed}`}
        aria-label="Navigator — same assistant across all your games"
      >
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleRow}>
            <span className={styles.panelGlyph} aria-hidden="true">
              <Sparkles size={16} strokeWidth={2.2} />
            </span>
            <div>
              <div className={styles.panelTitle}>{headline}</div>
              <div className={styles.panelSub}>
                {mode === 'ops'
                  ? `Chat here · ${liveChat.title}`
                  : 'Navigator · follows the title in focus · one thread across Live, Setup & Build'}
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={onToggle}
            aria-label={open ? 'Collapse Navigator panel' : 'Expand Navigator panel'}
          >
            {open ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </button>
        </div>

        {open && (
          <>
            {mode !== 'ops' ? (
              <div className={styles.fullScreenRow}>
                <button type="button" className={styles.fullScreenBtn} onClick={openLiveNavigator}>
                  <Radio size={14} aria-hidden />
                  Open Live pulse
                </button>
              </div>
            ) : null}
            {workspaceLine ? (
              <div className={styles.contextRibbon} role="status">
                {workspaceLine}
              </div>
            ) : null}

            <div className={styles.thread} ref={mode === 'ops' ? liveChat.listRef : undefined}>
              {mode === 'ops' && (
                <>
                  {liveChat.turns.length === 0 && !liveChat.pending && (
                    <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                      Ask about <strong>{liveChat.title}</strong> — retention, funnel, or what to ship
                      next. Tap a prompt below or type your own.
                    </div>
                  )}
                  {liveChat.turns.map((t) => (
                    <OpsTurnBubble key={t.id} turn={t} />
                  ))}
                  {liveChat.pending && (
                    <div className={styles.opsTyping}>Navigator is thinking…</div>
                  )}
                  {liveChat.demoPhase === 'awaiting_implement' && !liveChat.pending && (
                    <div className={styles.opsFlowActions}>
                      <button
                        type="button"
                        className={styles.opsImplementBtn}
                        onClick={liveChat.onImplementFix}
                      >
                        Implement that fix
                      </button>
                    </div>
                  )}
                  {liveChat.demoPhase === 'implementing' && (
                    <div className={styles.opsThinking} role="status" aria-live="polite">
                      <div className={styles.opsThinkingLabel}>Working through it</div>
                      {liveChat.thoughtSteps.map((label, i) => (
                        <div
                          key={label}
                          className={`${styles.opsThinkingStep} ${
                            i < liveChat.thoughtVisible - 1
                              ? styles.opsThinkingDone
                              : i === liveChat.thoughtVisible - 1
                                ? styles.opsThinkingActive
                                : ''
                          }`}
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                  {liveChat.demoPhase === 'solution_ready' && (
                    <div className={styles.opsSolution}>
                      <div className={styles.opsSolutionTitle}>Suggested change</div>
                      <p className={styles.opsSolutionBody}>
                        <FormattedNavLine text={SOLUTION_SUMMARY} />
                      </p>
                      <button
                        type="button"
                        className={styles.opsContinueBtn}
                        onClick={liveChat.onContinueToBuild}
                      >
                        Continue to Build
                        <ArrowRight size={14} aria-hidden />
                      </button>
                    </div>
                  )}
                </>
              )}
              {mode === 'build' && (
                <>
                  {demoBuildCollaboration ? (
                    <>
                      <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                        Picking up from <strong>Live</strong>: I’ve staged the Sector B guard swap —{' '}
                        <strong>hologram guide</strong>, 2-line VO, optional skip, and the two telemetry
                        events. You’re in <strong>Playtest</strong>; click in-world to tweak copy or
                        pacing and I’ll patch live.
                      </div>
                      <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                        Make the guide sound encouraging, not tutorial-y.
                      </div>
                      <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                        Done — warmer verbs, shorter second line. When it feels right, use{' '}
                        <strong>Publish &amp; deploy</strong> and I’ll run the preflight checks with you.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                        I’m <strong>Navigator</strong> in Build — same assistant as Live and Setup. Use
                        Playtest to mirror players, point at anything in-world, and I’ll propose patches
                        before you publish.
                      </div>
                      <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                        The guard still feels rude. Can we make them helpful, not blocking?
                      </div>
                      <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                        On it. Draft: 2-line VO + optional skip. Want me to bias toward{' '}
                        <em>speedrun</em> or <em>story</em> players?
                      </div>
                    </>
                  )}
                </>
              )}
              {mode === 'manage' && (
                <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                  For the <strong>focused game</strong>, I can prioritize localization gaps, draft string
                  variants, and sanity-check analytics before you ship the next locale or build.
                </div>
              )}
              {mode === 'lexicon' && (
                <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                  Glossary rules are in sync with JA rollout. Two marketing strings still use informal
                  “you” — I can propose formal alternatives for the store page.
                </div>
              )}
            </div>

            {mode === 'ops' ? (
              <>
                <div className={styles.opsChipWrap} role="group" aria-label="Suggested prompts">
                  {liveChat.starters.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={styles.opsChip}
                      onClick={() => liveChat.sendWithText(s)}
                      disabled={liveChat.pending || liveChat.demoPhase === 'implementing'}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className={styles.opsComposer}>
                  <textarea
                    className={styles.opsTextarea}
                    placeholder="Message Navigator…"
                    rows={2}
                    value={liveChat.input}
                    onChange={(e) => liveChat.setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        liveChat.send();
                      }
                    }}
                    disabled={liveChat.demoPhase === 'implementing'}
                    aria-label="Message Navigator"
                  />
                  <div className={styles.opsComposerRow}>
                    <button type="button" className={styles.micBtn} aria-label="Voice input (prototype)">
                      <Mic size={18} />
                    </button>
                    <button
                      type="button"
                      className={styles.sendBtn}
                      onClick={liveChat.send}
                      disabled={
                        !liveChat.input.trim() ||
                        liveChat.pending ||
                        liveChat.demoPhase === 'implementing'
                      }
                      aria-label="Send"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.chips}>
                  {chips.map((c) => (
                    <button key={c} type="button" className={styles.chip}>
                      {c}
                      <ChevronRight size={12} className={styles.chipChevron} aria-hidden />
                    </button>
                  ))}
                </div>
                <div className={styles.composer}>
                  <button type="button" className={styles.micBtn} aria-label="Voice input">
                    <Mic size={18} />
                  </button>
                  <input
                    className={styles.input}
                    placeholder="Message Navigator…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    aria-label="Message Navigator"
                  />
                  <button type="button" className={styles.sendBtn} aria-label="Send">
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
            <p className={styles.mobileHint}>
              {mode === 'ops'
                ? 'Enter to send · Shift+Enter for newline'
                : 'On mobile, Navigator becomes a bottom sheet — same thread across every game.'}
            </p>
          </>
        )}
      </aside>
      {!open && (
        <button type="button" className={styles.fab} onClick={onToggle} aria-label="Open Navigator">
          <Sparkles size={20} />
        </button>
      )}
    </div>
  );
}
