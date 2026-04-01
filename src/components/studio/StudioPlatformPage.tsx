import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import CreatorAppBar, { StudioAppBarActions } from '../shared/CreatorAppBar';
import styles from './StudioPlatformPage.module.css';

const MAIN_TABS = ['Home', 'Model', 'Avatar', 'UI', 'Script'] as const;
const TOOLBOX_CATS = ['Vehicle', 'Structure', 'Light', 'Tech'] as const;
const ASSET_ROWS = [
  { name: 'Audio', id: '—', type: 'Folder', date: '12 June 2024' },
  { name: 'Barrier', id: '92837465', type: 'Model', date: '12 June 2024' },
  { name: 'Building', id: '92837466', type: 'Model', date: '12 June 2024' },
  { name: 'Bird_Flap', id: '11223344', type: 'Audio', date: '12 June 2024' },
];

/**
 * Roblox Studio shell (Figma Creator-Notifications-2025 / 3613:308525).
 * Opened from Creator Hub; use “Back to Creator Hub” to return to the browser Hub UI.
 */
export default function StudioPlatformPage() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<string>('Home');
  const [cat, setCat] = useState<string>('Vehicle');

  return (
    <div className={styles.shell}>
      <CreatorAppBar variant="studio" title="Untitled Game - Roblox Studio" />
      <div className={styles.toolbarRow}>
        <div className={styles.toolbarPlatform}>
          <button
            type="button"
            className={styles.hubBackBtn}
            onClick={() => navigate('/home')}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Creator Hub
          </button>
          <span className={styles.docTitle}>Untitled Game - Roblox Studio</span>
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
        <div className={styles.toolbarRibbonEnd}>
          <StudioAppBarActions />
        </div>
      </div>

      <div className={styles.ribbonRow}>
        {[Box, Grid3x3, Type, Code2, Layers, Users].map((Icon, i) => (
          <button key={i} type="button" className={styles.ribbonBtn} aria-label={`Tool ${i + 1}`}>
            <Icon size={16} />
          </button>
        ))}
      </div>

      <div className={styles.workspace}>
        <aside className={styles.toolbox}>
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

        <div className={styles.centerCol}>
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
          <div className={styles.viewport3d}>
            <div className={styles.viewportGrid} aria-hidden="true" />
            <div className={styles.viewportPlatform} aria-hidden="true">
              <div className={styles.platformGlyph} />
            </div>
          </div>
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
        </div>

        <aside className={styles.rightCol}>
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
  );
}
