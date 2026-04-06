import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** Lifecycle stage shown across Manage games and Live ops */
export type ExperienceStage = 'live' | 'beta' | 'experiment' | 'build';

export const STAGE_LABEL: Record<ExperienceStage, string> = {
  live: 'Live',
  beta: 'Beta',
  experiment: 'Experiment',
  build: 'Build',
};

/** One experience in the studio roster (scales to many titles) */
export interface ExperienceSummary {
  id: string;
  title: string;
  shortCode: string;
  stage: ExperienceStage;
  thumb: string;
  signal: string;
  hasCriticalAlert: boolean;
  ccuLabel: string;
  d1Label: string;
  /** People accountable (shown on cards; large teams roll up) */
  owners: { name: string; initials: string }[];
  squad: string;
  updatedAgo: string;
}

export interface TeamMember {
  id: string;
  displayName: string;
  initials: string;
  role: string;
  online: boolean;
}

interface WorkspaceContextValue {
  /** Brand / org name — many creators map this to their studio */
  workspaceName: string;
  experiences: ExperienceSummary[];
  selectedExperienceId: string;
  setSelectedExperienceId: (id: string) => void;
  selectedExperience: ExperienceSummary;
  teamMembers: TeamMember[];
  onlineMemberCount: number;
  /** You — used for “Mine” filters */
  currentUserId: string;
  currentUserInitials: string;
}

const MOCK_EXPERIENCES: ExperienceSummary[] = [
  {
    id: 'exp-neon',
    title: 'Neon District RPG',
    shortCode: 'NDR',
    stage: 'live',
    thumb:
      'https://api.dicebear.com/9.x/pixel-art/png?seed=neonRPG&size=128&backgroundColor=b6e0fe',
    signal: 'Critical funnel dip · Sector B checkpoint',
    hasCriticalAlert: true,
    ccuLabel: '1.2k',
    d1Label: '22%',
    owners: [
      { name: 'Sofia Kim', initials: 'SK' },
      { name: 'Jordan Lee', initials: 'JL' },
    ],
    squad: 'Live ops',
    updatedAgo: '4m ago',
  },
  {
    id: 'exp-monkey',
    title: 'The Great Escape Monkey Game',
    shortCode: 'MGM',
    stage: 'beta',
    thumb:
      'https://api.dicebear.com/9.x/pixel-art/png?seed=monkeyGame&size=128&backgroundColor=d9f99d',
    signal: 'Stable · monetization experiments on',
    hasCriticalAlert: false,
    ccuLabel: '340',
    d1Label: '18%',
    owners: [{ name: 'Alex Rivera', initials: 'AR' }],
    squad: 'Growth',
    updatedAgo: '1h ago',
  },
  {
    id: 'exp-zombie',
    title: 'Zombie Siege 2025',
    shortCode: 'ZS',
    stage: 'experiment',
    thumb:
      'https://api.dicebear.com/9.x/pixel-art/png?seed=zombieSiege&size=128&backgroundColor=fecaca',
    signal: 'A/B · spawn density (agent-owned)',
    hasCriticalAlert: false,
    ccuLabel: '89',
    d1Label: '12%',
    owners: [
      { name: 'Morgan Patel', initials: 'MP' },
      { name: 'Sofia Kim', initials: 'SK' },
    ],
    squad: 'Combat',
    updatedAgo: '3h ago',
  },
  {
    id: 'exp-sky',
    title: 'Sky Islands',
    shortCode: 'SI',
    stage: 'live',
    thumb:
      'https://api.dicebear.com/9.x/pixel-art/png?seed=skyIslands&size=128&backgroundColor=cffafe',
    signal: 'Green · retention +2.1% WoW',
    hasCriticalAlert: false,
    ccuLabel: '2.4k',
    d1Label: '31%',
    owners: [{ name: 'Taylor Chen', initials: 'TC' }],
    squad: 'Live ops',
    updatedAgo: '12m ago',
  },
  {
    id: 'exp-laser',
    title: 'Laser Tag Arena',
    shortCode: 'LTA',
    stage: 'build',
    thumb: 'https://placehold.co/96x96/3b0764/c4b5fd?text=L',
    signal: 'Agents drafting map · needs design sign-off',
    hasCriticalAlert: false,
    ccuLabel: '—',
    d1Label: '—',
    owners: [
      { name: 'Jordan Lee', initials: 'JL' },
      { name: 'Riley Ng', initials: 'RN' },
    ],
    squad: 'New IP',
    updatedAgo: '2d ago',
  },
  {
    id: 'exp-city',
    title: 'City Roleplay',
    shortCode: 'CRP',
    stage: 'beta',
    thumb: 'https://placehold.co/96x96/14532d/86efac?text=C',
    signal: 'Watch · moderation queue length',
    hasCriticalAlert: false,
    ccuLabel: '620',
    d1Label: '15%',
    owners: [{ name: 'Casey Wu', initials: 'CW' }],
    squad: 'Trust & safety',
    updatedAgo: '6h ago',
  },
  {
    id: 'exp-dungeon',
    title: 'Dungeon Crawler Pro',
    shortCode: 'DCP',
    stage: 'live',
    thumb: 'https://placehold.co/96x96/422006/fde047?text=D',
    signal: 'Minor · economy inflation watch',
    hasCriticalAlert: false,
    ccuLabel: '410',
    d1Label: '19%',
    owners: [{ name: 'Sam Okonkwo', initials: 'SO' }],
    squad: 'Economy',
    updatedAgo: '30m ago',
  },
  {
    id: 'exp-farm',
    title: 'Farming Simulator',
    shortCode: 'FS',
    stage: 'experiment',
    thumb: 'https://placehold.co/96x96/365314/bef264?text=F',
    signal: 'Early cohort · too few data points',
    hasCriticalAlert: false,
    ccuLabel: '22',
    d1Label: '9%',
    owners: [{ name: 'Alex Rivera', initials: 'AR' }],
    squad: 'Growth',
    updatedAgo: '5d ago',
  },
  {
    id: 'exp-speed',
    title: 'Speed Run Paradise',
    shortCode: 'SRP',
    stage: 'live',
    thumb: 'https://placehold.co/96x96/831843/f9a8d4?text=S',
    signal: 'Green · UGC season performing',
    hasCriticalAlert: false,
    ccuLabel: '3.1k',
    d1Label: '27%',
    owners: [
      { name: 'Taylor Chen', initials: 'TC' },
      { name: 'Morgan Patel', initials: 'MP' },
    ],
    squad: 'Live ops',
    updatedAgo: '8m ago',
  },
  {
    id: 'exp-dragon',
    title: 'Dragon Tamer',
    shortCode: 'DT',
    stage: 'build',
    thumb: 'https://placehold.co/96x96/7c2d12/fdba74?text=D',
    signal: 'Blocked · art pipeline review',
    hasCriticalAlert: false,
    ccuLabel: '—',
    d1Label: '—',
    owners: [{ name: 'Riley Ng', initials: 'RN' }],
    squad: 'New IP',
    updatedAgo: '1d ago',
  },
];

const MOCK_TEAM: TeamMember[] = [
  { id: 'u1', displayName: 'Sofia Kim', initials: 'SK', role: 'Creative lead', online: true },
  { id: 'u2', displayName: 'Jordan Lee', initials: 'JL', role: 'Engineering', online: true },
  { id: 'u3', displayName: 'Alex Rivera', initials: 'AR', role: 'Growth', online: true },
  { id: 'u4', displayName: 'Morgan Patel', initials: 'MP', role: 'Design', online: true },
  { id: 'u5', displayName: 'Taylor Chen', initials: 'TC', role: 'Live ops', online: true },
  { id: 'u6', displayName: 'Casey Wu', initials: 'CW', role: 'Moderation', online: false },
  { id: 'u7', displayName: 'Riley Ng', initials: 'RN', role: 'Art director', online: false },
  { id: 'u8', displayName: 'Sam Okonkwo', initials: 'SO', role: 'Economy', online: false },
  { id: 'u9', displayName: 'Jamie Park', initials: 'JP', role: 'Producer', online: true },
  { id: 'u10', displayName: 'Devon Ali', initials: 'DA', role: 'QA', online: false },
  { id: 'u11', displayName: 'Priya Shah', initials: 'PS', role: 'Localization', online: false },
  { id: 'u12', displayName: 'Chris M.', initials: 'CM', role: 'Audio', online: false },
  { id: 'u13', displayName: 'Nina Ortiz', initials: 'NO', role: 'Data', online: false },
  { id: 'u14', displayName: 'Ben Foster', initials: 'BF', role: 'Partnerships', online: false },
];

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedExperienceId, setSelectedExperienceIdState] = useState(MOCK_EXPERIENCES[0].id);

  const setSelectedExperienceId = useCallback((id: string) => {
    setSelectedExperienceIdState(id);
  }, []);

  const selectedExperience = useMemo(() => {
    return (
      MOCK_EXPERIENCES.find((e) => e.id === selectedExperienceId) ?? MOCK_EXPERIENCES[0]
    );
  }, [selectedExperienceId]);

  const onlineMemberCount = useMemo(
    () => MOCK_TEAM.filter((m) => m.online).length,
    [],
  );

  const value = useMemo(
    () => ({
      workspaceName: 'Northlight Studio',
      experiences: MOCK_EXPERIENCES,
      selectedExperienceId,
      setSelectedExperienceId,
      selectedExperience,
      teamMembers: MOCK_TEAM,
      onlineMemberCount,
      currentUserId: 'u1',
      currentUserInitials: 'SK',
    }),
    [
      selectedExperienceId,
      setSelectedExperienceId,
      selectedExperience,
      onlineMemberCount,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return ctx;
}
