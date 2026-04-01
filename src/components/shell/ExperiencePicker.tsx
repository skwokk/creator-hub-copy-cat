import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import {
  STAGE_LABEL,
  useWorkspace,
  type ExperienceStage,
} from '../../context/WorkspaceContext';
import styles from './ExperiencePicker.module.css';

export default function ExperiencePicker({ variant = 'hub' }: { variant?: 'hub' | 'studio' }) {
  const { experiences, selectedExperienceId, setSelectedExperienceId, selectedExperience } =
    useWorkspace();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return experiences;
    return experiences.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.shortCode.toLowerCase().includes(q) ||
        e.squad.toLowerCase().includes(q),
    );
  }, [experiences, query]);

  const v = variant === 'studio' ? styles.studio : '';

  return (
    <div className={`${styles.wrap} ${v} ${open ? styles.wrapOpen : ''}`} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Experience focus, ${selectedExperience.title}. Open menu to switch.`}
      >
        <span className={styles.triggerMain}>
          <span className={styles.triggerTitle}>{selectedExperience.title}</span>
          <span className={`${styles.stageDot} ${styles[`st_${selectedExperience.stage}`]}`}>
            {STAGE_LABEL[selectedExperience.stage]}
          </span>
        </span>
        <ChevronDown size={14} className={styles.chevron} aria-hidden />
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          <p className={styles.dropdownHint}>
            Switch focus — Live, Setup, Build, and Chat all follow this title.
          </p>
          <div className={styles.searchRow}>
            <Search size={14} className={styles.searchIcon} aria-hidden />
            <input
              className={styles.searchInput}
              placeholder="Search experiences…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search experiences"
            />
          </div>
          <ul className={styles.list}>
            {filtered.map((exp) => (
              <li key={exp.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={exp.id === selectedExperienceId}
                  className={`${styles.row} ${exp.id === selectedExperienceId ? styles.rowOn : ''}`}
                  onClick={() => {
                    setSelectedExperienceId(exp.id);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <img src={exp.thumb} alt="" className={styles.thumb} />
                  <div className={styles.rowText}>
                    <span className={styles.rowTitle}>{exp.title}</span>
                    <span className={styles.rowMeta}>
                      {exp.shortCode} · {exp.squad}
                      {exp.hasCriticalAlert ? (
                        <span className={styles.needs}>Needs attention</span>
                      ) : null}
                    </span>
                  </div>
                  <span className={`${styles.rowStage} ${styles[`st_${exp.stage}`]}`}>
                    {STAGE_LABEL[exp.stage as ExperienceStage]}
                  </span>
                  {exp.id === selectedExperienceId ? (
                    <Check size={16} className={styles.check} aria-hidden />
                  ) : (
                    <span className={styles.checkSpacer} />
                  )}
                </button>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className={styles.empty}>No matches — try another search.</p>
          )}
        </div>
      )}
    </div>
  );
}
