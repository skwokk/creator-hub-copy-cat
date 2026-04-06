import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight, LineChart, Sparkles } from 'lucide-react';
import { STAGE_LABEL, useWorkspace } from '../../context/WorkspaceContext';
import AgentShell from '../shell/AgentShell';
import styles from './ManageAnalyticsPage.module.css';

/**
 * Analytics slice for the focused game under Manage (complements Live · Insight).
 */
export default function ManageAnalyticsPage() {
  const navigate = useNavigate();
  const { selectedExperience } = useWorkspace();

  const tiles = [
    { label: 'Sessions (24h)', value: '18.4k', delta: '+12%', warn: false },
    { label: 'Avg session', value: '14m 20s', delta: selectedExperience.hasCriticalAlert ? '−3%' : '+1%', warn: selectedExperience.hasCriticalAlert },
    { label: 'D1 retention', value: selectedExperience.d1Label, delta: 'WoW flat', warn: false },
    { label: 'CCU (now)', value: selectedExperience.ccuLabel, delta: STAGE_LABEL[selectedExperience.stage], warn: false },
  ];

  return (
    <AgentShell>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              <BarChart3 size={12} aria-hidden />
              Analytics · {selectedExperience.shortCode}
            </p>
            <h1 className={styles.title}>{selectedExperience.title}</h1>
            <p className={styles.sub}>
              Numbers for the game in focus. Ask Navigator to explain a move, compare cohorts, or draft
              an experiment — especially alongside Lexicon and Vision under <strong>Setup</strong>.
            </p>
          </div>
          <button type="button" className={styles.navBtn} onClick={() => navigate('/home#live-navigator')}>
            <Sparkles size={16} aria-hidden />
            Ask Navigator
          </button>
        </header>

        <section className={styles.tileRow}>
          {tiles.map((t) => (
            <div key={t.label} className={`${styles.tile} ${t.warn ? styles.tileWarn : ''}`}>
              <div className={styles.tileLabel}>{t.label}</div>
              <div className={styles.tileValue}>{t.value}</div>
              <div className={styles.tileDelta}>{t.delta}</div>
            </div>
          ))}
        </section>

        <section className={styles.chartCard}>
          <div className={styles.chartHead}>
            <LineChart size={18} className={styles.chartIcon} aria-hidden />
            <h2 className={styles.chartTitle}>Engagement trend (prototype)</h2>
          </div>
          <div className={styles.chartPlaceholder} aria-hidden>
            <span>Connect BI for live charts</span>
          </div>
        </section>

        <section className={styles.recs}>
          <h2 className={styles.recsTitle}>Navigator picks for this title</h2>
          <ul className={styles.recList}>
            <li>
              {selectedExperience.hasCriticalAlert
                ? 'Prioritize Sector B funnel diagnostics before the next localization pass.'
                : 'Schedule a small liveops beat this week — retention has headroom.'}
            </li>
            <li>Cross-check string changes in Lexicon with the funnel step they attach to.</li>
            <li>Run Simulate in Studio before shipping economy-tuned builds.</li>
          </ul>
          <button type="button" className={styles.linkBtn} onClick={() => navigate('/experience/overview')}>
            Open full Insight workspace
            <ChevronRight size={16} aria-hidden />
          </button>
        </section>
      </div>
    </AgentShell>
  );
}
