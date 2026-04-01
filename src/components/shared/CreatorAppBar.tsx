import type { ReactNode } from 'react';
import { Share2 } from 'lucide-react';
import styles from './CreatorAppBar.module.css';
import avatarImg from '../../assets/avatar.png';

type Variant = 'hub' | 'studio';

interface CreatorAppBarProps {
  title: string;
  variant?: Variant;
  /** Right side (Studio: collaborate, share, profile). Hub pages omit. */
  trailing?: ReactNode;
}

/**
 * Top window chrome row (traffic dots + centered title + optional actions).
 * Aligns with Figma Creator-Notifications-2025 / Studio 2025 and existing Hub screens.
 */
export default function CreatorAppBar({ title, variant = 'hub', trailing }: CreatorAppBarProps) {
  const barClass = variant === 'studio' ? styles.studio : styles.hub;
  const titleClass = variant === 'studio' ? styles.titleStudio : styles.titleHub;

  return (
    <header className={`${styles.appBar} ${barClass}`}>
      <div className={styles.trafficLights} aria-hidden="true">
        <span className={`${styles.tl} ${styles.tlClose}`} />
        <span className={`${styles.tl} ${styles.tlMin}`} />
        <span className={`${styles.tl} ${styles.tlMax}`} />
      </div>
      <span className={titleClass}>{title}</span>
      <div className={styles.trailing}>{trailing}</div>
    </header>
  );
}

/** Studio ribbon actions (Collaborate, Share, avatar) — render below the app bar, e.g. in `toolbarRow`. */
export function StudioAppBarActions() {
  return (
    <>
      <button type="button" className={styles.studioPillBtn}>
        Collaborate
      </button>
      <button type="button" className={styles.studioIconBtn} aria-label="Share">
        <Share2 size={15} />
      </button>
      <div className={styles.studioAvatarWrap}>
        <img src={avatarImg} alt="" className={styles.studioAvatar} />
        <span className={styles.studioNotifBadge} aria-label="Notifications">
          1
        </span>
      </div>
    </>
  );
}
