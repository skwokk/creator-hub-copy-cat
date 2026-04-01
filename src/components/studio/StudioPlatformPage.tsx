import { useState } from 'react';
import {
  Search,
  Settings,
  Play,
  Square,
  MousePointer2,
  Move,
  RotateCw,
  Scaling,
  Box,
  Grid3x3,
  Type,
  Code2,
  Plus,
  Users,
  Layers,
  ChevronRight,
  ChevronDown,
  Rocket,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Wand2,
  Film,
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import AgentShell from '../shell/AgentShell';
import { StudioAppBarActions } from '../shared/CreatorAppBar';
import styles from './StudioPlatformPage.module.css';

const MAIN_TABS = ['Home', 'Model', 'Avatar', 'UI', 'Script'] as const;
const TOOLBOX_CATS = ['Vehicle', 'Structure', 'Light', 'Tech'] as const;
const ASSET_ROWS = [
  { name: 'Audio', id: '—', type: 'Folder', date: '12 June 2024' },
  { name: 'Barrier', id: '92837465', type: 'Model', date: '12 June 2024' },
  { name: 'Building', id: '92837466', type: 'Model', date: '12 June 2024' },
  { name: 'Bird_Flap', id: '11223344', type: 'Audio', date: '12 June 2024' },
];

type StudioMode = 'edit' | 'playtest' | 'simulate';

/**
 * Roblox Studio shell — Edit, Playtest, or Simulate (AI outcome preview).
 */
export default function StudioPlatformPage() {
  const { selectedExperience } = useWorkspace();
  const [studioMode, setStudioMode] = useState<StudioMode>('playtest');
  const [mainTab, setMainTab] = useState<string>('Home');
  const [cat, setCat] = useState<string>('Vehicle');
  const [publishFlash, setPublishFlash] = useState(false);
  /** What to ask the AI to build (Simulate tab) */
  const [simBuildBrief, setSimBuildBrief] = useState('');
  /** Scenario / balance notes layered on top of the build ask */
  const [simScenario, setSimScenario] = useState('');
  const [simPreviewReady, setSimPreviewReady] = useState(false);

  const isPlaytest = studioMode === 'playtest';
  const isSimulate = studioMode === 'simulate';
  const isEdit = studioMode === 'edit';

  const barTitle =
    isPlaytest ? 'Playtest mirror' : isSimulate ? 'Simulate · build & preview' : 'Edit · Studio';

  const runSimPreview = () => {
    setSimPreviewReady(true);
  };

  const runPublish = () => {
    setPublishFlash(true);
    window.setTimeout(() => setPublishFlash(false), 4000);
  };

  return (
    <AgentShell
      chrome="studio"
      barTitle={barTitle}
    >
    <div
      className={`${styles.shell} ${isPlaytest ? styles.shellPlaytest : ''} ${isSimulate ? styles.shellSimulate : ''}`}
    >
      <div className={styles.sessionBanner}>
        {publishFlash ? (
          <span className={styles.publishFlash} role="status">
            <Rocket size={14} aria-hidden />
            Publish queued — staging build for <strong>{selectedExperience.title}</strong> (prototype)
          </span>
        ) : (
          <>
            <span className={styles.sessionBadge}>
              {isPlaytest ? 'Playtest' : isSimulate ? 'Simulate' : 'Edit'}
            </span>
            <span className={styles.sessionText}>
              {isPlaytest
                ? 'Running as players see it · Click in-world to pin issues · Your AI partner drafts fixes'
                : isSimulate
                  ? 'Tell your AI partner what to build, review generated outcomes, and watch a prototype simulation clip before you ship'
                  : 'Full Studio layout — use Playtest first, then Simulate or Edit'}
            </span>
          </>
        )}
      </div>
      <div className={styles.toolbarRow}>
        <div className={styles.toolbarPlatform}>
          <div className={styles.modeToggle} role="tablist" aria-label="Studio mode">
            <button
              type="button"
              role="tab"
              aria-selected={isPlaytest}
              className={`${styles.modeTab} ${isPlaytest ? styles.modeTabActive : ''}`}
              onClick={() => setStudioMode('playtest')}
            >
              Playtest
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSimulate}
              className={`${styles.modeTab} ${isSimulate ? styles.modeTabActive : ''}`}
              onClick={() => setStudioMode('simulate')}
            >
              Simulate
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isEdit}
              className={`${styles.modeTab} ${isEdit ? styles.modeTabActive : ''}`}
              onClick={() => setStudioMode('edit')}
            >
              Edit
            </button>
          </div>
          <button type="button" className={styles.publishBtn} onClick={runPublish}>
            <Rocket size={14} aria-hidden />
            Publish &amp; deploy
          </button>
          <span className={styles.docTitle}>{selectedExperience.title} — Roblox Studio</span>
        </div>
        <div className={styles.toolbarVertRule} aria-hidden="true" />
        <div className={styles.toolGroup}>
          <button type="button" className={styles.toolIcon} aria-label="Play">
            <Play size={15} fill="currentColor" />
          </button>
          <button type="button" className={styles.toolIcon} aria-label="Stop">
            <Square size={14} />
          </button>
        </div>
        {isEdit && (
          <>
            <div className={styles.toolGroup}>
              <button type="button" className={styles.toolIcon} aria-label="Select">
                <MousePointer2 size={15} />
              </button>
              <button type="button" className={styles.toolIcon} aria-label="Move">
                <Move size={15} />
              </button>
              <button type="button" className={styles.toolIcon} aria-label="Scale">
                <Scaling size={15} />
              </button>
              <button type="button" className={styles.toolIcon} aria-label="Rotate">
                <RotateCw size={15} />
              </button>
            </div>
            <div className={styles.tabsRow}>
              {MAIN_TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.mainTab} ${mainTab === t ? styles.mainTabActive : ''}`}
                  onClick={() => setMainTab(t)}
                >
                  {t}
                </button>
              ))}
              <button type="button" className={styles.mainTabAdd} aria-label="Add tab">
                <Plus size={14} />
              </button>
            </div>
          </>
        )}
        <div className={styles.toolbarRibbonEnd}>
          <StudioAppBarActions />
        </div>
      </div>

      {isEdit && (
        <div className={styles.ribbonRow}>
          {[Box, Grid3x3, Type, Code2, Layers, Users].map((Icon, i) => (
            <button key={i} type="button" className={styles.ribbonBtn} aria-label={`Tool ${i + 1}`}>
              <Icon size={16} />
            </button>
          ))}
        </div>
      )}

      <div className={styles.workspace}>
        <aside className={styles.toolbox} hidden={!isEdit} aria-hidden={!isEdit}>
          <div className={styles.panelHeader}>
            <span>Toolbox</span>
            <div className={styles.panelHeaderActions}>
              <button type="button" className={styles.iconBtn} aria-label="Search toolbox">
                <Search size={14} />
              </button>
              <button type="button" className={styles.iconBtn} aria-label="Toolbox settings">
                <Settings size={14} />
              </button>
            </div>
          </div>
          <div className={styles.searchRow}>
            <div className={styles.searchField}>
              <Search size={14} />
              <input placeholder="Search assets" aria-label="Search assets" />
            </div>
          </div>
          <div className={styles.categoryRow}>
            {TOOLBOX_CATS.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.catPill} ${cat === c ? styles.catPillActive : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className={styles.toolboxGrid}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={styles.toolboxTile}>
                <div className={styles.tileThumb} />
                <span className={styles.tileLabel}>Neutral Spawn Location</span>
              </div>
            ))}
          </div>
        </aside>

        <div className={`${styles.centerCol} ${isSimulate ? styles.centerColSimulate : ''}`}>
          {isSimulate ? (
            <div className={styles.simulatePanel}>
              <div className={styles.simulateHeader}>
                <Wand2 size={18} aria-hidden />
                <span>Simulate · build &amp; forecast</span>
                <span className={styles.simulateBadge}>AI partner</span>
              </div>
              <p className={styles.simulateLede}>
                In plain language, tell your <strong>AI partner</strong> what to build or change for{' '}
                <strong>{selectedExperience.title}</strong>. You’ll get a generated outcome readout and a
                short simulation clip (prototype) before touching Edit or Publish.
              </p>

              <label className={styles.simulateLabel} htmlFor="sim-build">
                What should the AI build or change?
              </label>
              <textarea
                id="sim-build"
                className={styles.simulateTextarea}
                rows={4}
                placeholder="e.g. Add a second exit from Sector B with a lit path, replace the guard with a hologram guide, and add VO that explains the objective in under 10s…"
                value={simBuildBrief}
                onChange={(e) => setSimBuildBrief(e.target.value)}
              />

              <label className={styles.simulateLabel} htmlFor="sim-scenario">
                Scenario &amp; balance notes (optional)
              </label>
              <textarea
                id="sim-scenario"
                className={`${styles.simulateTextarea} ${styles.simulateTextareaShort}`}
                rows={2}
                placeholder="e.g. Assume weekend traffic, casual cohort, no paid boosts…"
                value={simScenario}
                onChange={(e) => setSimScenario(e.target.value)}
              />

              <div className={styles.simulateChips} role="group" aria-label="Quick build ideas">
                {[
                  'Rebuild Sector B flow for speedrunners',
                  'New social hub + daily streak UI',
                  'Economy pass: softer early grind',
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={styles.simChip}
                    onClick={() => setSimBuildBrief(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className={styles.simulateActions}>
                <button
                  type="button"
                  className={styles.simGenerateBtn}
                  onClick={runSimPreview}
                  disabled={!simBuildBrief.trim()}
                >
                  <Sparkles size={15} aria-hidden />
                  Generate preview &amp; simulation
                </button>
              </div>

              {simPreviewReady && (
                <>
                  <h3 className={styles.simulateSectionTitle}>Generated outcome preview</h3>
                  <p className={styles.simulateSectionSub}>
                    Based on your brief{simScenario.trim() ? ' and scenario notes' : ''} (prototype
                    model — hook to real generation in production).
                  </p>
                  <div className={styles.outcomeGrid}>
                    <div className={styles.outcomeCard}>
                      <div className={styles.outcomeIcon} aria-hidden>
                        <TrendingUp size={16} />
                      </div>
                      <div className={styles.outcomeTitle}>Projected D1 retention</div>
                      <div className={styles.outcomeValue}>+0.6% to +1.2%</div>
                      <div className={styles.outcomeNote}>vs. current live, 7d blended model</div>
                    </div>
                    <div className={styles.outcomeCard}>
                      <div className={`${styles.outcomeIcon} ${styles.outcomeIconWarn}`} aria-hidden>
                        <AlertCircle size={16} />
                      </div>
                      <div className={styles.outcomeTitle}>Implementation risk</div>
                      <div className={styles.outcomeValue}>Low–medium</div>
                      <div className={styles.outcomeNote}>
                        New geometry touches navmesh; recommend QA pass on mobile
                      </div>
                    </div>
                    <div className={styles.outcomeCard}>
                      <div className={styles.outcomeIcon} aria-hidden>
                        <Sparkles size={16} />
                      </div>
                      <div className={styles.outcomeTitle}>Partner recommendation</div>
                      <div className={styles.outcomeValue}>Ship to 5% canary</div>
                      <div className={styles.outcomeNote}>
                        Roll out behind flag <code className={styles.codeInline}>exp_sector_b_v2</code>
                      </div>
                    </div>
                  </div>

                  <h3 className={styles.simulateSectionTitle}>Simulation video</h3>
                  <p className={styles.simulateSectionSub}>
                    Watch an AI-rendered walkthrough of how players might experience the change.
                  </p>
                  <div className={styles.simVideoCard}>
                    <div className={styles.simVideoFrame} aria-hidden>
                      <div className={styles.simVideoGrid} />
                      <button type="button" className={styles.simVideoPlay} aria-label="Play simulation preview (prototype)">
                        <Play size={28} fill="currentColor" />
                      </button>
                    </div>
                    <div className={styles.simVideoMeta}>
                      <span className={styles.simVideoLabel}>
                        <Film size={14} aria-hidden /> Preview run
                      </span>
                      <span className={styles.simVideoDuration}>~0:42 · prototype clip</span>
                    </div>
                  </div>
                </>
              )}

              <p className={styles.simulateFoot}>
                Connect generation + video pipelines for real runs. Use <strong>Publish &amp; deploy</strong>{' '}
                when you are ready to push this place.
              </p>
            </div>
          ) : (
            <>
              {isEdit && (
                <div className={styles.viewportTabs}>
                  <div className={`${styles.vpTab} ${styles.vpTabActive}`}>
                    Place1
                    <span className={styles.vpTabClose} aria-hidden="true">
                      ×
                    </span>
                  </div>
                  <div className={styles.vpTab}>
                    Name
                    <span className={styles.vpTabClose} aria-hidden="true">
                      ×
                    </span>
                  </div>
                </div>
              )}
              <div className={`${styles.viewport3d} ${isPlaytest ? styles.viewport3dPlaytest : ''}`}>
                <div className={styles.viewportGrid} aria-hidden="true" />
                <div className={styles.viewportPlatform} aria-hidden="true">
                  <div className={styles.platformGlyph} />
                </div>
                <div className={styles.viewportPinRing} aria-hidden="true" />
                <div className={styles.viewportPinHud} role="status">
                  Pin mode · click in-world to attach a fix · Partner listens
                </div>
              </div>
              {isEdit && (
                <div className={styles.assetManager}>
                  <div className={styles.amHeader}>
                    <span>Asset Manager</span>
                    <div className={styles.titleActions}>
                      <button type="button" className={styles.titleBtn}>
                        Import
                      </button>
                    </div>
                  </div>
                  <div className={styles.amBody}>
                    <div className={styles.amTree}>
                      <div className={styles.treeLine}>
                        <ChevronDown size={12} />
                        Project
                      </div>
                      <div className={`${styles.treeLine} ${styles.treeIndent}`}>Recently Imported</div>
                      <div className={`${styles.treeLine} ${styles.treeIndent}`}>Experience Name</div>
                      <div className={styles.treeLine}>
                        <ChevronRight size={12} />
                        Inventories
                      </div>
                    </div>
                    <div className={styles.amTable}>
                      <div className={styles.tableHead}>
                        <span>Name</span>
                        <span>ID</span>
                        <span>Type</span>
                        <span>Date Modified</span>
                      </div>
                      {ASSET_ROWS.map((row) => (
                        <div key={row.name} className={styles.tableRow}>
                          <span>{row.name}</span>
                          <span>{row.id}</span>
                          <span>{row.type}</span>
                          <span>{row.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <aside className={styles.rightCol} hidden={!isEdit} aria-hidden={!isEdit}>
          <div className={styles.explorer}>
            <div className={styles.panelHeader}>
              <span>Explorer</span>
            </div>
            <div className={styles.explorerScroll}>
              <div className={styles.treeLine}>
                <ChevronDown size={12} />
                Workspace
              </div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`}>Camera</div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`}>Terrain</div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`}>Billboard</div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`}>
                <ChevronDown size={12} />
                Shop
              </div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`} style={{ paddingLeft: 28 }}>
                Shopkeeper
              </div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`} style={{ paddingLeft: 28 }}>
                Counter
              </div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`} style={{ paddingLeft: 28 }}>
                Shelves
              </div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`} style={{ paddingLeft: 28 }}>
                Register
              </div>
              <div className={`${styles.treeLine} ${styles.treeIndent}`} style={{ paddingLeft: 28 }}>
                Door
              </div>
            </div>
          </div>
          <div className={styles.properties}>
            <div className={styles.panelHeader}>
              <span>Properties</span>
            </div>
            <div className={styles.propScroll}>
              {[
                ['Archivable', 'checkbox'],
                ['ClassName', 'Part'],
                ['Name', 'Label'],
                ['Parent', 'Workspace'],
                ['Position', '0, 0, 0'],
              ].map(([label, val]) => (
                <div key={label} className={styles.propRow}>
                  <span className={styles.propLabel}>{label}</span>
                  {val === 'checkbox' ? (
                    <input type="checkbox" defaultChecked aria-label={label} />
                  ) : (
                    <input className={styles.propInput} defaultValue={val} readOnly />
                  )}
                </div>
              ))}
              <div className={styles.propRow}>
                <span className={styles.propLabel}>Dropdown</span>
                <select className={styles.propInput} defaultValue="B">
                  <option>Value A</option>
                  <option>Value B</option>
                </select>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </AgentShell>
  );
}
