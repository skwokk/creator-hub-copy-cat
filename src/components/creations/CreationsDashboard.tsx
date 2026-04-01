import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Box,
  ChevronRight,
  Globe,
  Image,
  Layers,
  Sparkles,
  Type,
} from 'lucide-react';
import { STAGE_LABEL, useWorkspace } from '../../context/WorkspaceContext';
import AgentShell from '../shell/AgentShell';
import styles from './CreationsDashboard.module.css';

const LINKS: {
  to: string;
  label: string;
  blurb: string;
  Icon: typeof Globe | typeof Image;
}[] = [
  {
    to: '/manage/analytics',
    label: 'Analytics',
    blurb: 'Retention, sessions, and Navigator picks for this title',
    Icon: BarChart3,
  },
  {
    to: '/localization',
    label: 'Lexicon',
    blurb: 'Rules and glossary — refine with Navigator before you ship strings',
    Icon: Globe,
  },
  {
    to: '/translate',
    label: 'Strings',
    blurb: 'Copy tables · let Navigator propose tone-safe variants',
    Icon: Type,
  },
  {
    to: '/translate-v3',
    label: 'Vision',
    blurb: 'Image and UI text — review AI-suggested overlays',
    Icon: Image,
  },
];

/**
 * Game management hub for the **focused** experience (ribbon picker).
 */
export default function CreationsDashboard() {
  const navigate = useNavigate();
  const { selectedExperience, workspaceName } = useWorkspace();

  const recs = selectedExperience.hasCriticalAlert
    ? [
        'Triage Sector B with Live Pulse, then patch in Studio — Navigator can draft the player note.',
        'Freeze large Lexicon edits until the funnel fix is verified on staging.',
        'Run Simulate in Build before the next publish.',
      ]
    : [
        'Localization health is green — good window for Vision pass on new HUD art.',
        'Navigator suggests a light liveops beat to lift returning sessions.',
        'Align Strings with Analytics cohort labels for cleaner reports.',
      ];

  return (
    <AgentShell>
      <div className={styles.page}>
        <header className={styles.hubHeader}>
          <div>
            <p className={styles.eyebrow}>
              <Layers size={12} aria-hidden />
              Game management · {selectedExperience.shortCode}
            </p>
            <h1 className={styles.hubTitle}>{selectedExperience.title}</h1>
            <p className={styles.hubSub}>
              Everything here applies to the game selected in the ribbon ({workspaceName}). Prefer
              talking to <strong>Navigator</strong> for changes — it can recommend what to adjust and
              open the right surface.
            </p>
          </div>
          <div className={styles.stagePill}>
            <span className={styles.stageLabel}>{STAGE_LABEL[selectedExperience.stage]}</span>
            <span className={styles.stageMeta}>Updated {selectedExperience.updatedAgo}</span>
          </div>
        </header>

        <section className={styles.aiBand}>
          <div className={styles.aiBandIcon} aria-hidden>
            <Sparkles size={22} />
          </div>
          <div className={styles.aiBandCopy}>
            <h2 className={styles.aiBandTitle}>Work through Navigator</h2>
            <p className={styles.aiBandBody}>
              Ask for a rollout plan, string review, or analytics readout in plain language. Navigator
              keeps context on this title and your workspace.
            </p>
          </div>
          <button type="button" className={styles.aiBandBtn} onClick={() => navigate('/navigator')}>
            Open Navigator
            <ChevronRight size={16} aria-hidden />
          </button>
        </section>

        <section className={styles.recSection}>
          <h2 className={styles.sectionTitle}>Recommended for this game</h2>
          <ul className={styles.recCards}>
            {recs.map((text) => (
              <li key={text} className={styles.recCard}>
                <span className={styles.recDot} aria-hidden />
                {text}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.linkSection}>
          <h2 className={styles.sectionTitle}>Surfaces</h2>
          <div className={styles.linkGrid}>
            {LINKS.map(({ to, label, blurb, Icon }) => (
              <button key={to} type="button" className={styles.linkCard} onClick={() => navigate(to)}>
                <span className={styles.linkCardIcon} aria-hidden>
                  <Icon size={20} />
                </span>
                <span className={styles.linkCardLabel}>{label}</span>
                <span className={styles.linkCardBlurb}>{blurb}</span>
                <ChevronRight size={16} className={styles.linkCardChev} aria-hidden />
              </button>
            ))}
            <button type="button" className={styles.linkCard} onClick={() => navigate('/studio')}>
              <span className={styles.linkCardIcon} aria-hidden>
                <Box size={20} />
              </span>
              <span className={styles.linkCardLabel}>Studio</span>
              <span className={styles.linkCardBlurb}>Edit, playtest, and simulate changes before deploy</span>
              <ChevronRight size={16} className={styles.linkCardChev} aria-hidden />
            </button>
          </div>
        </section>

        <p className={styles.focusHint}>
          Wrong title? Use the <strong>experience menu</strong> in the top ribbon — Live, Game, and
          Build all follow that focus.
        </p>
      </div>
    </AgentShell>
  );
}
