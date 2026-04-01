import AgentShell from '../shell/AgentShell';
import styles from './GameConfigStubPage.module.css';

interface GameConfigStubPageProps {
  title: string;
  description?: string;
}

/**
 * Placeholder for game configuration surfaces not yet fully built.
 */
export default function GameConfigStubPage({ title, description }: GameConfigStubPageProps) {
  return (
    <AgentShell>
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>Game configuration</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.body}>
          {description ??
            'Prototype surface — wire forms, APIs, and Navigator actions here. Use the left rail to move between configuration areas.'}
        </p>
      </div>
    </AgentShell>
  );
}
