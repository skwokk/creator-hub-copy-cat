import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  LineChart,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';
import { STAGE_LABEL, useWorkspace } from '../../context/WorkspaceContext';
import AgentShell from '../shell/AgentShell';
import styles from './HomeDashboard.module.css';

/**
 * Pulse — live operations for the **focused** experience.
 */
export default function HomeDashboard() {
  const navigate = useNavigate();
  const { selectedExperience, workspaceName } = useWorkspace();
  const [aiAutoFixBugs, setAiAutoFixBugs] = useState(true);
  const [aiAutoBalance, setAiAutoBalance] = useState(true);

  const activity = [
    { who: 'Jordan L.', what: 'Left review notes on staging NPC patch', when: '12m ago' },
    { who: 'Partner', what: `Pinged ${workspaceName} · economy channel about Sector B`, when: '18m ago' },
    { who: 'Alex R.', what: 'Requested insight export for Monkey Game', when: '1h ago' },
    { who: 'Taylor C.', what: 'Acknowledged canary OK on Sky Islands', when: '2h ago' },
  ];

  return (
    <AgentShell>
      <div className={styles.page}>
        <header className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>
              <Radio size={12} className={styles.eyebrowIcon} aria-hidden />
              Live ops · Pulse · {selectedExperience.shortCode}
            </p>
            <h1 className={styles.title}>
              Health for <em>{selectedExperience.title}</em>
            </h1>
            <p className={styles.lede}>
              Pulse shows <strong>live signals for this title only</strong>. Below, <strong>Live right now</strong>{' '}
              is today’s health snapshot; <strong>Partner activity</strong> is the chronological log of what
              Partner proposed or shipped. Use <strong>Setup</strong> for store, strings, and analytics,{' '}
              <strong>Chat</strong> for full-page partner, and <strong>Build</strong> for editing the
              experience.
            </p>
          </div>
          <div className={styles.livePill}>
            <span className={styles.liveDot} aria-hidden />
            {STAGE_LABEL[selectedExperience.stage]}
            <span className={styles.liveMeta}>
              CCU {selectedExperience.ccuLabel} · 1D {selectedExperience.d1Label}
            </span>
          </div>
        </header>

        <section className={styles.automationCard} aria-labelledby="ai-automation-heading">
          <div className={styles.automationHead}>
            <Sparkles size={18} className={styles.automationIcon} aria-hidden />
            <div>
              <h2 id="ai-automation-heading" className={styles.automationTitle}>
                Partner automation
              </h2>
              <p className={styles.automationSub}>
                Your AI partner can act on live telemetry for this experience. Both modes start on — turn
                them off anytime if you want full manual control.
              </p>
            </div>
          </div>
          <ul className={styles.toggleList}>
            <li className={styles.toggleRow}>
              <div className={styles.toggleCopy}>
                <span className={styles.toggleLabel}>Auto-fix bugs</span>
                <span className={styles.toggleHint}>
                  Partner triages crashes and regressions, opens PRs or Studio pins for your review.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={aiAutoFixBugs}
                className={`${styles.toggleTrack} ${aiAutoFixBugs ? styles.toggleTrackOn : ''}`}
                onClick={() => setAiAutoFixBugs((v) => !v)}
              >
                <span className={styles.toggleThumb} />
              </button>
            </li>
            <li className={styles.toggleRow}>
              <div className={styles.toggleCopy}>
                <span className={styles.toggleLabel}>Auto-balance live</span>
                <span className={styles.toggleHint}>
                  Conservative tuning from engagement and economy signals — always behind flags /
                  canaries (prototype).
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={aiAutoBalance}
                className={`${styles.toggleTrack} ${aiAutoBalance ? styles.toggleTrackOn : ''}`}
                onClick={() => setAiAutoBalance((v) => !v)}
              >
                <span className={styles.toggleThumb} />
              </button>
            </li>
          </ul>
        </section>

        <section className={styles.pulseDualWrap} aria-labelledby="pulse-dual-heading">
          <header className={styles.pulseDualHeader}>
            <h2 id="pulse-dual-heading" className={styles.pulseDualTitle}>
              Live right now
            </h2>
            <p className={styles.pulseDualLede}>
              <strong>Snapshot, not a log.</strong> Left: the one player-facing issue we’d surface first
              today. Right: safeguards and release state for this title. For a chronological list of Partner
              analyses, drafts waiting on you, and applies, see <strong>Partner activity</strong> below.
            </p>
          </header>
          <div className={styles.signalGrid}>
            {selectedExperience.hasCriticalAlert ? (
              <article className={styles.signalCard} aria-label="Top live issue">
                <div className={styles.signalHead}>
                  <span className={styles.signalBadge}>
                    <AlertTriangle size={14} aria-hidden />
                    Needs attention
                  </span>
                  <span className={styles.signalTime}>Updated {selectedExperience.updatedAgo}</span>
                </div>
                <p className={styles.signalKicker}>
                  Highest-impact player-health problem we see for this title right now — paired with a
                  fast way to repro it as a player.
                </p>
                <h2 className={styles.signalTitle}>Drop-off rate surged at Sector B</h2>
                <p className={styles.signalBody}>
                  Players are leaving right after the guard dialogue. Partner correlated it with a pacing
                  change from last night’s agent rollout — not a platform outage.
                </p>
                <div className={styles.signalActions}>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => navigate('/studio')}
                  >
                    <Play size={16} aria-hidden />
                    Open in playtest
                  </button>
                  <button type="button" className={styles.btnGhost}>
                    Open funnel detail
                    <ChevronRight size={16} aria-hidden />
                  </button>
                </div>
              </article>
            ) : (
              <article className={styles.signalCardOk} aria-label="Live health summary">
                <div className={styles.signalHead}>
                  <span className={styles.signalBadgeOk}>
                    <CheckCircle2 size={14} aria-hidden />
                    No red-flag spike
                  </span>
                  <span className={styles.signalTime}>Updated {selectedExperience.updatedAgo}</span>
                </div>
                <p className={styles.signalKicker}>
                  Nothing crossed our “act today” threshold. Below is your normal pulse line for this
                  experience.
                </p>
                <h2 className={styles.signalTitle}>Looking stable</h2>
                <p className={styles.signalBody}>{selectedExperience.signal}</p>
                <div className={styles.signalActions}>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={() => navigate('/experience/overview')}
                  >
                    Open title overview
                    <ChevronRight size={16} aria-hidden />
                  </button>
                  <button type="button" className={styles.btnGhost} onClick={() => navigate('/studio')}>
                    Open in playtest
                    <ChevronRight size={16} aria-hidden />
                  </button>
                </div>
              </article>
            )}

            <article className={styles.queueCard} aria-label="Background activity">
              <h3 className={styles.queueTitle}>Background activity</h3>
              <p className={styles.queueSubtitle}>
                Not a todo list — a live ledger of partner work, safety checks, and release timing for{' '}
                <strong>{selectedExperience.shortCode}</strong>.
              </p>
              <ul className={styles.queueList}>
                {selectedExperience.hasCriticalAlert ? (
                  <li className={styles.queueItem}>
                    <div className={styles.queueIcon} aria-hidden>
                      <Zap size={16} />
                    </div>
                    <div>
                      <div className={styles.queueItemTitle}>Change in review · NPC intro</div>
                      <div className={styles.queueItemMeta}>
                        Partner staged a patch — needs your sign-off in Build before it can ship
                      </div>
                    </div>
                    <ArrowRight size={16} className={styles.queueChevron} aria-hidden />
                  </li>
                ) : null}
                <li className={styles.queueItem}>
                  <div className={`${styles.queueIcon} ${styles.queueIconMuted}`} aria-hidden>
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className={styles.queueItemTitle}>Safeguards on</div>
                    <div className={styles.queueItemMeta}>
                      Partner is watching crash spikes, economy caps, and anomaly flags for this title
                    </div>
                  </div>
                </li>
                <li className={styles.queueItem}>
                  <div className={`${styles.queueIcon} ${styles.queueIconMuted}`} aria-hidden>
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className={styles.queueItemTitle}>Scheduled &amp; gated releases</div>
                    <div className={styles.queueItemMeta}>
                      Timed or gradual rollouts stay staged until you (or policy) explicitly approves
                    </div>
                  </div>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className={styles.partnerFeed} aria-labelledby="partner-feed-heading">
          <div className={styles.partnerFeedHead}>
            <Info size={18} className={styles.partnerFeedIcon} aria-hidden />
            <div>
              <h2 id="partner-feed-heading" className={styles.partnerFeedTitle}>
                Partner activity
              </h2>
              <p className={styles.partnerFeedSub}>
                <strong>Timeline, not a dashboard.</strong> Newest first: analyses, changes waiting on your
                OK, and low-risk applies already shipped. <strong>Live right now</strong> above is current
                player health; this section is what Partner proposed or did in sequence.
              </p>
            </div>
          </div>
          <ul className={styles.alertList}>
            <li className={`${styles.alertCard} ${styles.alertReview}`}>
              <div className={styles.alertTop}>
                <span className={styles.alertBadge}>Review suggested</span>
                <span className={styles.alertTime}>22m ago</span>
              </div>
              <h3 className={styles.alertTitle}>D1 retention is softening vs. last week</h3>
              <p className={styles.alertBody}>
                Partner correlated a −1.4pt move with longer queue times in matchmaking, not a store or
                campaign change. Suggested next step: shorten estimated wait copy and add a mini-game hub
                — or keep monitoring 48h if you prefer a lighter touch.
              </p>
              <div className={styles.alertActions}>
                <button type="button" className={styles.alertBtnPrimary}>
                  Open review
                </button>
                <button type="button" className={styles.alertBtnGhost}>
                  Dismiss for now
                </button>
              </div>
            </li>
            <li className={`${styles.alertCard} ${styles.alertPending}`}>
              <div className={styles.alertTop}>
                <span className={styles.alertBadgePending}>Approval required</span>
                <span className={styles.alertTime}>1h ago</span>
              </div>
              <h3 className={styles.alertTitle}>Economy pass for early sessions</h3>
              <p className={styles.alertBody}>
                Partner drafted a 12% softer first-hour grind on main progression currency, gated to a
                staging flag. This is classified as a <strong>big change</strong> — it won’t ship without
                your OK.
              </p>
              <div className={styles.alertActions}>
                <button type="button" className={styles.alertBtnPrimary}>
                  Approve for canary
                </button>
                <button type="button" className={styles.alertBtnGhost}>
                  Reject
                </button>
                <button type="button" className={styles.alertBtnGhost}>
                  Edit in Setup
                </button>
              </div>
            </li>
            <li className={`${styles.alertCard} ${styles.alertInfo}`}>
              <div className={styles.alertTop}>
                <span className={styles.alertBadgeInfo}>Applied · low risk</span>
                <span className={styles.alertTime}>3h ago</span>
              </div>
              <h3 className={styles.alertTitle}>Telemetry tag added on Sector B exits</h3>
              <p className={styles.alertBody}>
                Partner added a non-player-facing event so we can split exits by device tier. No gameplay
                or copy change.
              </p>
            </li>
          </ul>
        </section>

        <section className={styles.metricsRow}>
          {[
            { label: 'Sessions / hr', value: selectedExperience.stage === 'live' ? '18.4k' : '2.1k', delta: '+12%', ok: true },
            { label: 'Avg session', value: '14m 20s', delta: selectedExperience.hasCriticalAlert ? '−3%' : '+1%', ok: !selectedExperience.hasCriticalAlert },
            { label: 'Conversion', value: '3.8%', delta: '+0.4%', ok: true },
            { label: 'P95 join time', value: '1.1s', delta: 'flat', ok: true },
          ].map((m) => (
            <div key={m.label} className={styles.metric}>
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricValue}>{m.value}</div>
              <div className={m.ok ? styles.metricDelta : styles.metricDeltaWarn}>{m.delta}</div>
            </div>
          ))}
        </section>

        <section className={styles.focusNote}>
          <p className={styles.focusNoteText}>
            Live ops is scoped to <strong>{selectedExperience.title}</strong>. To work on another title,
            change focus in the <strong>experience menu</strong> in the ribbon — Live, Setup, and Build
            follow that selection.
          </p>
        </section>

        <section className={styles.activity}>
          <h2 className={styles.activityTitle}>Team &amp; partner activity</h2>
          <ul className={styles.activityList}>
            {activity.map((a, i) => (
              <li key={i} className={styles.activityRow}>
                <span className={styles.activityWhen}>{a.when}</span>
                <span className={styles.activityBody}>
                  <strong>{a.who}</strong> — {a.what}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.split}>
          <section className={styles.funnel}>
            <div className={styles.sectionHead}>
              <LineChart size={18} className={styles.sectionIcon} aria-hidden />
              <h2 className={styles.sectionTitle}>Funnel · last 24h · {selectedExperience.shortCode}</h2>
            </div>
            <div className={styles.funnelBars}>
              {(selectedExperience.hasCriticalAlert
                ? [
                    { label: 'Join', pct: 100 },
                    { label: 'Tutorial', pct: 72 },
                    { label: 'Sector A', pct: 54 },
                    { label: 'Sector B', pct: 28, warn: true },
                    { label: 'Endgame', pct: 19 },
                  ]
                : [
                    { label: 'Join', pct: 100 },
                    { label: 'Tutorial', pct: 81 },
                    { label: 'Mid', pct: 62 },
                    { label: 'Late', pct: 44 },
                    { label: 'Endgame', pct: 31 },
                  ]
              ).map((step) => (
                <div key={step.label} className={styles.funnelStep}>
                  <div className={styles.funnelLabels}>
                    <span>{step.label}</span>
                    <span className={step.warn ? styles.funnelWarn : ''}>{step.pct}%</span>
                  </div>
                  <div className={styles.funnelTrack}>
                    <div
                      className={`${styles.funnelFill} ${step.warn ? styles.funnelFillWarn : ''}`}
                      style={{ width: `${step.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.next}>
            <div className={styles.sectionHead}>
              <FlaskConical size={18} className={styles.sectionIcon} aria-hidden />
              <h2 className={styles.sectionTitle}>Partner · next moves</h2>
            </div>
            <ol className={styles.nextList}>
              <li>
                <span className={styles.nextRank}>1</span>
                <div>
                  <strong>
                    {selectedExperience.hasCriticalAlert
                      ? 'Pin the guard interaction in Studio'
                      : 'Keep monitoring session quality'}
                  </strong>
                  <p>
                    {selectedExperience.hasCriticalAlert
                      ? 'Replace blocking gate with guided ping — highest expected lift.'
                      : 'No urgent patch. Consider a small liveops event this weekend.'}
                  </p>
                </div>
              </li>
              <li>
                <span className={styles.nextRank}>2</span>
                <div>
                  <strong>Align with owners</strong>
                  <p>
                    {selectedExperience.owners.map((o) => o.name).join(' & ')} own this title — @ them
                    from the partner panel with one tap (prototype).
                  </p>
                </div>
              </li>
              <li>
                <span className={styles.nextRank}>3</span>
                <div>
                  <strong>Use Setup for configuration</strong>
                  <p>
                    Strings, localization, and store settings live under <strong>Setup</strong> — keep Pulse
                    for what is happening <em>right now</em>.
                  </p>
                </div>
              </li>
            </ol>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => navigate('/experience/overview')}
            >
              Open title setup
              <ChevronRight size={16} aria-hidden />
            </button>
          </section>
        </div>
      </div>
    </AgentShell>
  );
}
