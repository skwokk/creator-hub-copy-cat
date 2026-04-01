import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import styles from './TeamPresence.module.css';

const VISIBLE = 4;

export default function TeamPresence({ variant = 'hub' }: { variant?: 'hub' | 'studio' }) {
  const { teamMembers, onlineMemberCount, workspaceName } = useWorkspace();
  const [open, setOpen] = useState(false);

  const online = useMemo(() => teamMembers.filter((m) => m.online), [teamMembers]);
  const shown = online.slice(0, VISIBLE);
  const extra = Math.max(0, online.length - VISIBLE);

  const v = variant === 'studio' ? styles.studio : '';
  const ribbonCompact = variant === 'studio';

  return (
    <div
      className={`${styles.wrap} ${v}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${styles.trigger} ${ribbonCompact ? styles.triggerCompact : ''}`}
        aria-expanded={open}
        aria-label={`Team: ${onlineMemberCount} online of ${teamMembers.length} in ${workspaceName}`}
      >
        <Users size={14} className={styles.usersIcon} aria-hidden />
        {!ribbonCompact && (
          <span className={styles.stack} aria-hidden="true">
            {shown.map((m, i) => (
              <span
                key={m.id}
                className={styles.avatar}
                style={{ zIndex: i + 1 }}
                title={m.displayName}
              >
                {m.initials}
              </span>
            ))}
            {extra > 0 && <span className={styles.more}>+{extra}</span>}
          </span>
        )}
        <span className={styles.counts}>
          <strong>{onlineMemberCount}</strong>
          <span className={styles.slash}>/</span>
          {teamMembers.length}
        </span>
      </button>
      {open && (
        <div className={styles.popover} role="tooltip">
          <div className={styles.popTitle}>{workspaceName}</div>
          <p className={styles.popSub}>
            {onlineMemberCount} online now · full roster in team settings (prototype).
          </p>
          <ul className={styles.popList}>
            {teamMembers.map((m) => (
              <li key={m.id} className={styles.popRow}>
                <span className={styles.popDot} data-on={m.online} aria-hidden />
                <span className={styles.popName}>{m.displayName}</span>
                <span className={styles.popRole}>{m.role}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
