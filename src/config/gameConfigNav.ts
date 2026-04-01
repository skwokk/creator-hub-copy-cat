/**
 * Left sub-rail for Game — mirrors former Experience Overview sidebar tree.
 */
export type GameSubNavEntry =
  | { kind: 'group'; label: string }
  | { kind: 'link'; label: string; to: string; end?: boolean; indent?: boolean };

export const GAME_CONFIG_SUB_NAV: GameSubNavEntry[] = [
  { kind: 'link', label: 'Overview', to: '/experience/overview', end: true },
  { kind: 'link', label: 'Configure', to: '/experience/configure' },
  { kind: 'link', label: 'Analytics', to: '/experience/analytics' },
  { kind: 'link', label: 'Monetization', to: '/experience/monetization' },
  { kind: 'link', label: 'Monitoring', to: '/experience/monitoring' },
  { kind: 'link', label: 'Activity History', to: '/experience/activity' },
  { kind: 'group', label: 'Audience' },
  { kind: 'link', label: 'Feedback', to: '/experience/audience/feedback', indent: true },
  { kind: 'link', label: 'Access Settings', to: '/experience/audience/access', indent: true },
  {
    kind: 'link',
    label: 'Communication Settings',
    to: '/experience/audience/communication',
    indent: true,
  },
  {
    kind: 'link',
    label: 'Maturity & Compliance',
    to: '/experience/audience/maturity',
    indent: true,
  },
  { kind: 'link', label: 'Localization', to: '/localization', indent: true },
  { kind: 'link', label: 'Engagement', to: '/experience/engagement' },
  { kind: 'link', label: 'Moderation', to: '/experience/moderation' },
  { kind: 'link', label: 'Promotion', to: '/experience/promotion' },
  { kind: 'group', label: 'Translation' },
  { kind: 'link', label: 'Strings', to: '/translate', indent: true },
  { kind: 'link', label: 'Vision', to: '/translate-v3', indent: true },
];
