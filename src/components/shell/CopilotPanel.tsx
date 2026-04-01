import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronRight,
  Mic,
  Send,
  PanelRightClose,
  PanelRightOpen,
  Zap,
  Target,
  FlaskConical,
  Maximize2,
} from 'lucide-react';
import styles from './CopilotPanel.module.css';

export type CopilotMode = 'ops' | 'build' | 'manage' | 'lexicon';

interface CopilotPanelProps {
  mode: CopilotMode;
  open: boolean;
  onToggle: () => void;
  /** Workspace context line (studio, game, team) */
  workspaceLine?: string;
}

const OPS_CHIPS = ['Explain funnel', 'Draft player comms', 'Compare to genre'];
const BUILD_CHIPS = ['Soften NPC aggro', 'Patch from playtest', 'Revert last agent edit'];
const MANAGE_CHIPS = ['Prioritize by revenue', 'Who owns what?', 'Localization gaps'];
const LEX_CHIPS = ['Audit JA strings', 'Flag tone issues', 'Ship glossary v2'];

export default function CopilotPanel({
  mode,
  open,
  onToggle,
  workspaceLine,
}: CopilotPanelProps) {
  const [draft, setDraft] = useState('');

  const chips =
    mode === 'build'
      ? BUILD_CHIPS
      : mode === 'manage'
        ? MANAGE_CHIPS
        : mode === 'lexicon'
          ? LEX_CHIPS
          : OPS_CHIPS;

  const headline =
    mode === 'build'
      ? 'Partner · Studio'
      : mode === 'manage'
        ? 'Partner · Setup'
        : mode === 'lexicon'
          ? 'Partner · Localization'
          : 'Partner · Live';

  const navigate = useNavigate();

  return (
    <div className={styles.dockRoot}>
      <aside
        className={`${styles.panel} ${open ? styles.panelOpen : styles.panelCollapsed}`}
        aria-label="AI partner — same assistant across all your games"
      >
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleRow}>
            <span className={styles.panelGlyph} aria-hidden="true">
              <Sparkles size={16} strokeWidth={2.2} />
            </span>
            <div>
              <div className={styles.panelTitle}>{headline}</div>
              <div className={styles.panelSub}>
                Your AI partner · follows the title in focus · one thread across Live, Setup &amp; Build
              </div>
            </div>
          </div>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={onToggle}
            aria-label={open ? 'Collapse AI partner panel' : 'Expand AI partner panel'}
          >
            {open ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </button>
        </div>

        {open && (
          <>
            <div className={styles.fullScreenRow}>
              <button
                type="button"
                className={styles.fullScreenBtn}
                onClick={() => navigate('/navigator')}
              >
                <Maximize2 size={14} aria-hidden />
                Open full-screen partner chat
              </button>
            </div>
            {workspaceLine ? (
              <div className={styles.contextRibbon} role="status">
                {workspaceLine}
              </div>
            ) : null}
            <div className={styles.thread}>
              {mode === 'ops' && (
                <>
                  <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                    <strong>Drop-off spike</strong> at Sector B checkpoint — up{' '}
                    <span className={styles.emph}>340%</span> vs your 7-day baseline. Most exits
                    happen within 8s of the guard dialogue.
                  </div>
                  <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                    I staged a fix: shorter NPC intro + a visual beacon on the objective. You
                    weren’t thrilled with the copy — open{' '}
                    <span className={styles.emph}>Studio</span> and pin what to change. I’ll
                    iterate with you live.
                  </div>
                  <div className={styles.suggestionRow}>
                    <span className={styles.suggestionLabel}>
                      <Target size={12} aria-hidden /> Next best
                    </span>
                    <ul className={styles.nbList}>
                      <li>
                        <Zap size={12} aria-hidden /> Ship checkpoint fix to 10% canary
                      </li>
                      <li>
                        <FlaskConical size={12} aria-hidden /> A/B greeting line vs silent ping
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {mode === 'build' && (
                <>
                  <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                    I’m your <strong>AI partner</strong> in Studio — same assistant you have in Live
                    and Setup. Use Playtest to mirror players, point at anything in-world, and
                    I’ll propose patches before you publish.
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
              {mode === 'manage' && (
                <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                  For the <strong>focused game</strong>, I can prioritize localization gaps, draft
                  string variants, and sanity-check analytics before you ship the next locale or
                  build.
                </div>
              )}
              {mode === 'lexicon' && (
                <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
                  Glossary rules are in sync with JA rollout. Two marketing strings still use
                  informal “you” — I can propose formal alternatives for the store page.
                </div>
              )}
            </div>

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
                placeholder="Message your partner…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-label="Message your AI partner"
              />
              <button type="button" className={styles.sendBtn} aria-label="Send">
                <Send size={16} />
              </button>
            </div>
            <p className={styles.mobileHint}>
              On mobile, your partner becomes a bottom sheet — same thread across every game.
            </p>
          </>
        )}
      </aside>
      {!open && (
        <button type="button" className={styles.fab} onClick={onToggle} aria-label="Open AI partner">
          <Sparkles size={20} />
        </button>
      )}
    </div>
  );
}
