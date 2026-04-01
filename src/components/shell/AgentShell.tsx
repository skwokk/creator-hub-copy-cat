import { useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Bell, Box, Layers, MessageSquare, Radio, Smartphone, Sparkles } from 'lucide-react';
import { GAME_CONFIG_SUB_NAV } from '../../config/gameConfigNav';
import { STAGE_LABEL, useWorkspace } from '../../context/WorkspaceContext';
import CopilotPanel, { type CopilotMode } from './CopilotPanel';
import ExperiencePicker from './ExperiencePicker';
import TeamPresence from './TeamPresence';
import styles from './AgentShell.module.css';
import avatarImg from '../../assets/avatar.png';
import tiltSvg from '../../assets/tilt.svg';

export type ShellSection = 'live' | 'manage' | 'build' | 'navigator';

const MAIN_TABS: {
  id: ShellSection;
  label: string;
  shortLabel: string;
  path: string;
  hint: string;
  Icon: LucideIcon;
}[] = [
  {
    id: 'navigator',
    label: 'Navigator chat',
    shortLabel: 'Chat',
    path: '/navigator',
    hint:
      'Full-page conversation with Navigator. Different from the sparkles control, which opens the side panel next to your work.',
    Icon: MessageSquare,
  },
  {
    id: 'live',
    label: 'Live ops',
    shortLabel: 'Live',
    path: '/home',
    hint:
      'Real-time monitoring: Pulse, incidents, funnel — what is happening to players right now (not content shipping)',
    Icon: Radio,
  },
  {
    id: 'manage',
    label: 'Setup',
    shortLabel: 'Setup',
    path: '/experience/overview',
    hint:
      'Set up this title the easy way — store, strings, analytics, audience. Not the Live Pulse dashboard.',
    Icon: Layers,
  },
  {
    id: 'build',
    label: 'Build',
    shortLabel: 'Build',
    path: '/studio',
    hint: 'Studio, edit, and playtest',
    Icon: Box,
  },
];

function sectionFromPath(pathname: string): ShellSection {
  if (pathname.startsWith('/navigator')) return 'navigator';
  if (pathname.startsWith('/studio')) return 'build';
  if (
    pathname.startsWith('/experience/') ||
    pathname.startsWith('/creations') ||
    pathname.startsWith('/manage/') ||
    pathname.startsWith('/localization') ||
    pathname.startsWith('/translate')
  ) {
    return 'manage';
  }
  return 'live';
}

function copilotFromPath(pathname: string): CopilotMode {
  if (pathname.startsWith('/navigator')) return 'ops';
  if (pathname.startsWith('/studio')) return 'build';
  if (
    pathname.startsWith('/localization') ||
    pathname.startsWith('/translate')
  ) {
    return 'lexicon';
  }
  if (
    pathname.startsWith('/experience/') ||
    pathname.startsWith('/creations') ||
    pathname.startsWith('/manage/')
  ) {
    return 'manage';
  }
  return 'ops';
}

interface AgentShellProps {
  children: ReactNode;
  chrome?: 'hub' | 'studio';
  /** Extra context on the workspace strip (e.g. playtest mode) */
  barTitle?: string;
  showCopilot?: boolean;
  /** Override Navigator panel mode (defaults from current route) */
  copilotMode?: CopilotMode;
}

export default function AgentShell({
  children,
  chrome = 'hub',
  barTitle,
  showCopilot = true,
  copilotMode: copilotModeProp,
}: AgentShellProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [copilotOpen, setCopilotOpen] = useState(true);
  const { workspaceName, selectedExperience, onlineMemberCount } = useWorkspace();

  const activeSection = sectionFromPath(pathname);
  const copilotMode = copilotModeProp ?? copilotFromPath(pathname);

  const shellClass = chrome === 'studio' ? styles.shellStudio : styles.shellHub;
  const barClass = chrome === 'studio' ? styles.osBarStudio : styles.osBarHub;
  const ribbonClass =
    chrome === 'studio' ? styles.controlRibbonStudio : styles.controlRibbonHub;
  const pickerVariant = chrome === 'studio' ? 'studio' : 'hub';
  const teamVariant = chrome === 'studio' ? 'studio' : 'hub';

  const workspaceLine = `${workspaceName} · ${selectedExperience.title} · ${onlineMemberCount} online`;

  const showGameSubRail = activeSection === 'manage';

  const isPartnerPage = pathname.startsWith('/navigator');
  const showCopilotPanel = showCopilot && !isPartnerPage;

  const shellCopilotClass = showCopilotPanel
    ? copilotOpen
      ? styles.shellCopilotOpen
      : styles.shellCopilotDocked
    : '';

  return (
    <div className={`${styles.shell} ${shellClass} ${shellCopilotClass}`}>
      <header className={`${styles.osBar} ${barClass} ${styles.shellGridOs}`} aria-label="Window">
        <div className={styles.osBarChrome}>
          <div className={styles.traffic} aria-hidden="true">
            <span className={`${styles.tl} ${styles.tlClose}`} />
            <span className={`${styles.tl} ${styles.tlMin}`} />
            <span className={`${styles.tl} ${styles.tlMax}`} />
          </div>
        </div>
      </header>

      <div
        className={`${styles.controlRibbon} ${ribbonClass} ${styles.shellGridRibbon}`}
        role="toolbar"
        aria-label="Creator controls"
      >
        <div className={styles.ribbonLeft}>
          <button
            type="button"
            className={styles.brandLockup}
            onClick={() => navigate('/home')}
            aria-label="Creator OS home"
          >
            <img src={tiltSvg} alt="" className={styles.brandMark} />
            <span className={styles.brandText}>Creator OS</span>
            <span className={styles.brandBadge}>Navigator</span>
          </button>
        </div>
        <div className={styles.ribbonCenter}>
          <ExperiencePicker variant={pickerVariant} />
        </div>
        <div className={styles.ribbonRight}>
          <button type="button" className={styles.iconBtn} aria-label="Notifications">
            <Bell size={17} />
            <span className={styles.notifDot} />
          </button>
          {showCopilotPanel && (
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.partnerBtn}`}
              onClick={() => setCopilotOpen((o) => !o)}
              aria-expanded={copilotOpen}
              aria-label="Toggle AI partner side panel"
              title="Side panel: your AI partner alongside your work"
            >
              <Sparkles size={17} />
            </button>
          )}
          <img src={avatarImg} alt="" className={styles.barAvatar} />
        </div>
      </div>

      <div
        className={`${styles.workspaceStrip} ${chrome === 'studio' ? styles.workspaceStripStudio : ''} ${styles.shellGridStrip}`}
      >
        <div className={styles.stripCluster}>
          <strong className={styles.stripStudioName}>{workspaceName}</strong>
          <span className={styles.stripSep} aria-hidden>
            ·
          </span>
          <span className={styles.stripMeta}>
            {STAGE_LABEL[selectedExperience.stage]} · CCU {selectedExperience.ccuLabel} · 1D{' '}
            {selectedExperience.d1Label}
          </span>
        </div>
        <div className={styles.stripToolbar}>
          <TeamPresence variant={teamVariant} />
          <button type="button" className={styles.stripIconBtn} aria-label="Mobile companion">
            <Smartphone size={15} />
          </button>
          {barTitle ? <span className={styles.stripMode}>{barTitle}</span> : null}
        </div>
      </div>

      <div className={`${styles.body} ${styles.shellGridBody}`}>
        <div className={styles.bodyInner}>
        <div className={styles.railColumn}>
          <nav className={styles.rail} aria-label="Main areas">
            {MAIN_TABS.map(({ id, shortLabel, path, hint, Icon }) => (
              <button
                key={id}
                type="button"
                title={hint}
                className={`${styles.railTab} ${activeSection === id ? styles.railTabActive : ''}`}
                onClick={() => navigate(path)}
                aria-current={activeSection === id ? 'page' : undefined}
              >
                <Icon size={22} strokeWidth={activeSection === id ? 2.2 : 1.75} />
                <span className={styles.railTabLabel}>{shortLabel}</span>
              </button>
            ))}
          </nav>
          {showGameSubRail && (
            <nav className={styles.subRail} aria-label="Title setup">
              <div className={styles.subRailHead}>
                <span className={styles.subRailTitle}>This title</span>
                <span className={styles.subRailSubtitle}>Setup</span>
              </div>
              {GAME_CONFIG_SUB_NAV.map((entry, i) => {
                if (entry.kind === 'group') {
                  return (
                    <div key={`g-${entry.label}-${i}`} className={styles.subRailGroup}>
                      {entry.label}
                    </div>
                  );
                }
                return (
                  <NavLink
                    key={entry.to}
                    to={entry.to}
                    end={entry.end}
                    className={({ isActive }) =>
                      `${styles.subRailLink} ${entry.indent ? styles.subRailLinkNested : ''} ${isActive ? styles.subRailLinkActive : ''}`
                    }
                  >
                    {entry.label}
                  </NavLink>
                );
              })}
            </nav>
          )}
        </div>

        <main className={styles.main}>{children}</main>
        </div>
      </div>

      {showCopilotPanel && (
        <div className={styles.copilotDock}>
          <CopilotPanel
            mode={copilotMode}
            open={copilotOpen}
            onToggle={() => setCopilotOpen((o) => !o)}
            workspaceLine={workspaceLine}
          />
        </div>
      )}
    </div>
  );
}
