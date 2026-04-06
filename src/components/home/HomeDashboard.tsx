import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  LineChart,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { STAGE_LABEL, useWorkspace } from '../../context/WorkspaceContext';
import AgentShell from '../shell/AgentShell';
import styles from './HomeDashboard.module.css';

/**
 * Live — minimal pulse: what’s wrong, what’s right, and quick actions.
 * Navigator chat lives in the side panel (sparkles).
 */
export default function HomeDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedExperience, workspaceName } = useWorkspace();
  const [aiAutoFixBugs, setAiAutoFixBugs] = useState(true);
  const [aiAutoBalance, setAiAutoBalance] = useState(true);

  const hasIssue = selectedExperience.hasCriticalAlert;

  useEffect(() => {
    if (location.hash === '#live-navigator') {
      window.dispatchEvent(new CustomEvent('creator-os:open-copilot'));
      navigate({ pathname: location.pathname, search: location.search }, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  const funnel = hasIssue
    ? [
        { label: 'Join', pct: 100 },
        { label: 'Tut', pct: 72 },
        { label: 'A', pct: 54 },
        { label: 'B', pct: 28, warn: true },
        { label: 'End', pct: 19 },
      ]
    : [
        { label: 'Join', pct: 100 },
        { label: 'Tut', pct: 81 },
        { label: 'Mid', pct: 62 },
        { label: 'Late', pct: 44 },
        { label: 'End', pct: 31 },
      ];

  const stats = [
    { label: 'Sessions/hr', value: selectedExperience.stage === 'live' ? '18.4k' : '2.1k', ok: true },
    { label: 'Avg session', value: '14m 20s', ok: !hasIssue },
    { label: '1D retention', value: selectedExperience.d1Label, ok: !hasIssue },
    { label: 'CCU', value: selectedExperience.ccuLabel, ok: true },
  ];

  return (
    <AgentShell>
      <div className={styles.livePage}>
        <header className={styles.liveHero}>
          <div
            className={`${styles.liveGameThumb} ${hasIssue ? styles.liveGameThumbWarn : styles.liveGameThumbOk}`}
          >
            <img
              src={selectedExperience.thumb}
              alt=""
              width={80}
              height={80}
              className={styles.liveGameThumbImg}
            />
          </div>
          <div className={styles.liveHeroMain}>
            <div className={styles.liveHeroTop}>
              <span className={styles.liveTag}>{selectedExperience.shortCode}</span>
              <span className={styles.liveStage}>{STAGE_LABEL[selectedExperience.stage]}</span>
            </div>
            <h1 className={styles.liveTitle}>{selectedExperience.title}</h1>
            <p className={styles.liveVerdict}>
              {hasIssue ? (
                <>
                  <strong>Sector B</strong> — players bail right after the guard line. Not matchmaking or
                  store.
                </>
              ) : (
                <>No red-flag spikes. {selectedExperience.signal}</>
              )}
            </p>
          </div>
        </header>

        <div className={styles.liveBoard}>
          <section className={styles.liveBoardMain} aria-labelledby="live-status-heading">
            <h2 id="live-status-heading" className={styles.srOnly}>
              Status and funnel
            </h2>
            <div className={styles.liveStatGrid} role="list">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={`${styles.liveStatCard} ${s.ok ? '' : styles.liveStatCardWarn}`}
                  role="listitem"
                >
                  <span className={styles.liveStatLabel}>{s.label}</span>
                  <span className={styles.liveStatValue}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className={styles.liveStatusCard}>
              <div className={styles.liveStatusIcon} aria-hidden>
                {hasIssue ? <AlertTriangle size={22} /> : <CheckCircle2 size={22} />}
              </div>
              <div className={styles.liveStatusBody}>
                <p className={styles.liveStatusLabel}>{hasIssue ? 'Needs attention' : 'Looking good'}</p>
                <p className={styles.liveStatusText}>
                  {hasIssue
                    ? 'Drop-off clusters in the first seconds after dialogue — Navigator tied it to last night’s pacing change.'
                    : 'Economy, join times, and conversion are in band. Keep an eye on weekend traffic.'}
                </p>
                <div className={styles.liveStatusActions}>
                  <button
                    type="button"
                    className={styles.liveBtnPrimary}
                    onClick={() => navigate('/studio')}
                  >
                    <Play size={16} aria-hidden />
                    Open in playtest
                  </button>
                  <button type="button" className={styles.liveBtnGhost} onClick={() => navigate('/experience/analytics')}>
                    Analytics
                    <ChevronRight size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.liveFunnel}>
              <div className={styles.liveFunnelHead}>
                <LineChart size={16} aria-hidden />
                <span>Funnel · 24h</span>
              </div>
              <div className={styles.liveFunnelBars}>
                {funnel.map((step) => (
                  <div key={step.label} className={styles.liveFunnelRow}>
                    <span className={styles.liveFunnelLab}>{step.label}</span>
                    <div className={styles.liveFunnelTrack}>
                      <div
                        className={`${styles.liveFunnelFill} ${step.warn ? styles.liveFunnelFillWarn : ''}`}
                        style={{ width: `${step.pct}%` }}
                      />
                    </div>
                    <span className={`${styles.liveFunnelPct} ${step.warn ? styles.liveFunnelPctWarn : ''}`}>
                      {step.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className={styles.liveRail} aria-label="Navigator and safeguards">
            <p className={styles.liveRailHint}>
              Use <strong>Navigator</strong> in the side panel to dig into retention or ship a fix.
            </p>
            <ul className={styles.liveRailList}>
              {hasIssue ? (
                <li className={styles.liveRailItem}>
                  <Zap size={16} className={styles.liveRailGlyph} aria-hidden />
                  <div>
                    <span className={styles.liveRailTitle}>Patch in review</span>
                    <span className={styles.liveRailMeta}>NPC intro · sign off in Build</span>
                  </div>
                </li>
              ) : null}
              <li className={styles.liveRailItem}>
                <ShieldCheck size={16} className={styles.liveRailGlyphMuted} aria-hidden />
                <div>
                  <span className={styles.liveRailTitle}>Safeguards on</span>
                  <span className={styles.liveRailMeta}>Crashes &amp; economy caps</span>
                </div>
              </li>
              <li className={styles.liveRailItem}>
                <Clock size={16} className={styles.liveRailGlyphMuted} aria-hidden />
                <div>
                  <span className={styles.liveRailTitle}>Gated releases</span>
                  <span className={styles.liveRailMeta}>Rollouts need approval</span>
                </div>
              </li>
            </ul>

            <div className={styles.liveFeedMini}>
              <span className={styles.liveFeedLabel}>Latest</span>
              <ul>
                <li>
                  <time>22m</time> Retention softening — queue copy experiment suggested
                </li>
                <li>
                  <time>1h</time> Economy pass waiting for your OK
                </li>
                <li>
                  <time>3h</time> Telemetry on Sector B exits (applied)
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div className={styles.liveToggles} aria-label="Navigator automation">
          <div className={styles.liveTogglesLabel}>
            <Sparkles size={14} aria-hidden />
            <span>Navigator automation</span>
          </div>
          <div className={styles.liveTogglePair}>
            <label className={styles.liveToggleItem}>
              <span>Auto-fix</span>
              <button
                type="button"
                role="switch"
                aria-checked={aiAutoFixBugs}
                className={`${styles.liveSwitch} ${aiAutoFixBugs ? styles.liveSwitchOn : ''}`}
                onClick={() => setAiAutoFixBugs((v) => !v)}
              >
                <span className={styles.liveSwitchKnob} />
              </button>
            </label>
            <label className={styles.liveToggleItem}>
              <span>Auto-balance</span>
              <button
                type="button"
                role="switch"
                aria-checked={aiAutoBalance}
                className={`${styles.liveSwitch} ${aiAutoBalance ? styles.liveSwitchOn : ''}`}
                onClick={() => setAiAutoBalance((v) => !v)}
              >
                <span className={styles.liveSwitchKnob} />
              </button>
            </label>
          </div>
        </div>

        <p className={styles.liveFoot}>
          <Radio size={11} aria-hidden /> Focused on this title ({workspaceName}). Change game in the ribbon
          for Setup or Build context.
        </p>
      </div>
    </AgentShell>
  );
}
