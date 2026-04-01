import {
  AlignLeft,
  Bell,
  ChevronDown,
  Search,
  Flag,
  ThumbsUp,
  Users,
  Download,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import AgentShell from '../shell/AgentShell';
import styles from './ExperienceOverview.module.css';
import avatarImg from '../../assets/avatar.png';

const METRICS = [
  { label: 'Day 1 retention', value: '24.5%' },
  { label: 'New users', value: '47' },
  { label: 'Average playtime', value: '2.3 min' },
  { label: 'Daily active users', value: '31' },
  { label: 'Daily revenue', value: '0' },
];

const CHART_DATA = [
  { date: 'Mar 20', Total: 12, Other: 4 },
  { date: 'Mar 21', Total: 19, Other: 7 },
  { date: 'Mar 22', Total: 15, Other: 5 },
  { date: 'Mar 23', Total: 28, Other: 9 },
  { date: 'Mar 24', Total: 24, Other: 8 },
  { date: 'Mar 25', Total: 36, Other: 12 },
  { date: 'Mar 26', Total: 42, Other: 14 },
];

/**
 * Game configuration · Overview — nav lives in AgentShell sub-rail.
 */
export default function ExperienceOverview() {
  return (
    <AgentShell>
      <div className={styles.shell}>
        <div className={styles.viewport}>
          <div className={styles.primaryPane}>
            <div className={styles.headerBar}>
              <div className={styles.headerLeading}>
                <button type="button" className={styles.headerMenuBtn}>
                  <AlignLeft size={18} />
                </button>
                <nav className={styles.breadcrumb}>
                  <span className={styles.breadcrumbItem}>Create</span>
                  <span className={styles.breadcrumbSep}>/</span>
                  <span className={styles.breadcrumbItem}>
                    The Great Escape Monkey Game
                    <ChevronDown size={14} />
                  </span>
                  <span className={styles.breadcrumbSep}>/</span>
                  <span className={`${styles.breadcrumbItem} ${styles.breadcrumbActive}`}>
                    Overview
                  </span>
                </nav>
              </div>
              <div className={styles.headerTrailing}>
                <button type="button" className={styles.headerIconBtn} aria-label="Search">
                  <Search size={18} />
                </button>
                <button type="button" className={styles.headerIconBtn} aria-label="Notifications">
                  <Bell size={18} />
                  <span className={styles.headerBadge}>9</span>
                </button>
                <img src={avatarImg} alt="" className={styles.avatar} />
              </div>
            </div>

            <div className={styles.body}>
              <div className={styles.content}>
                <div className={styles.pageTitleRow}>
                  <h1 className={styles.pageTitle}>Analytics Overview</h1>
                  <button type="button" className={styles.flagBtn} aria-label="Flag">
                    <Flag size={14} />
                  </button>
                </div>

                <div className={styles.heroCard}>
                  <div className={styles.heroThumb}>
                    <span aria-hidden="true">🌿</span>
                  </div>
                  <div className={styles.heroInfo}>
                    <h2 className={styles.heroTitle}>The Great Escape Monkey Game</h2>
                    <p className={styles.heroMeta}>Updated 3/25/2026, 12:50:05 AM</p>
                    <div className={styles.heroStats}>
                      <span className={styles.heroStat}>
                        <ThumbsUp size={14} /> 0
                      </span>
                      <span className={styles.heroStat}>
                        <Users size={14} /> 0
                      </span>
                      <span className={styles.heroStat}>1 Visits</span>
                    </div>
                    <div className={styles.heroActions}>
                      <button type="button" className={styles.btnPrimary}>
                        Edit in Studio
                      </button>
                      <button type="button" className={styles.btnOutline}>
                        View on Roblox
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.snapshotCard}>
                  <div className={styles.snapshotHeader}>
                    <div className={styles.snapshotLeft}>
                      <span className={styles.snapshotTitle}>
                        Snapshot of 7-day moving averages
                      </span>
                      <span className={styles.snapshotDot} />
                    </div>
                    <div className={styles.snapshotRight}>
                      <button type="button" className={styles.btnGhost}>
                        Explore
                      </button>
                      <button type="button" className={styles.btnIcon} aria-label="Download">
                        <Download size={14} />
                      </button>
                      <div className={styles.dateRangeWrap}>
                        <span className={styles.dateRangeLabel}>Date Range</span>
                        <button type="button" className={styles.dateRangeBtn}>
                          Last 7 days <ChevronDown size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.metricsRow}>
                    {METRICS.map((m) => (
                      <div key={m.label} className={styles.metricItem}>
                        <span className={styles.metricLabel}>{m.label}</span>
                        <span className={styles.metricValue}>{m.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.chartWrap}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={CHART_DATA}
                        margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          stroke="rgba(208,217,251,0.07)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          stroke="rgba(208,217,251,0.15)"
                          tick={{ fill: '#bcbec8', fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="rgba(208,217,251,0.15)"
                          tick={{ fill: '#bcbec8', fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                          width={32}
                        />
                        <Tooltip
                          contentStyle={{
                            background: '#1c1e24',
                            border: '1px solid rgba(208,217,251,0.12)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#f7f7f8',
                          }}
                          cursor={{ stroke: 'rgba(208,217,251,0.12)', strokeWidth: 1 }}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{
                            fontSize: '12px',
                            color: '#d5d7dd',
                            paddingTop: '8px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="Total"
                          stroke="#0064e0"
                          strokeWidth={2}
                          dot={{ fill: '#0064e0', r: 3, strokeWidth: 0 }}
                          activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="Other"
                          stroke="#00c853"
                          strokeWidth={2}
                          dot={{ fill: '#00c853', r: 3, strokeWidth: 0 }}
                          activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AgentShell>
  );
}
