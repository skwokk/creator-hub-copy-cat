import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { useGlossaryFlow } from './hooks/useGlossaryFlow';
import GlossaryView from './components/glossary/GlossaryView';
import TranslationStringsView from './components/translation/TranslationStringsView';
import ImageTranslationV3 from './components/translation/ImageTranslationV3';
import HomeDashboard from './components/home/HomeDashboard';
import ExperienceOverview from './components/experience/ExperienceOverview';
import StudioPlatformPage from './components/studio/StudioPlatformPage';
import ManageAnalyticsPage from './components/manage/ManageAnalyticsPage';
import GameConfigStubPage from './components/game/GameConfigStubPage';

function GlossaryRoot() {
  const flow = useGlossaryFlow();

  return (
    <GlossaryView
      isPanelOpen={flow.isPanelOpen}
      isEditing={flow.isEditing}
      rules={flow.rules}
      showSuccessToast={flow.showSuccessToast}
      isDeleteModalOpen={flow.isDeleteModalOpen}
      openPanel={flow.openPanel}
      closePanel={flow.closePanel}
      draftRule={flow.draftRule}
      updateDraft={flow.updateDraft}
      submitRule={flow.submitRule}
      editRule={flow.editRule}
      openDeleteModal={flow.openDeleteModal}
      closeDeleteModal={flow.closeDeleteModal}
      deleteRule={flow.deleteRule}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomeDashboard />} />
          <Route path="/creations" element={<Navigate to="/experience/overview" replace />} />
          <Route path="/manage/analytics" element={<Navigate to="/experience/analytics" replace />} />
          <Route path="/experience/overview" element={<ExperienceOverview />} />
          <Route path="/experience/analytics" element={<ManageAnalyticsPage />} />
          <Route path="/experience/configure" element={<GameConfigStubPage title="Configure" />} />
          <Route
            path="/experience/monetization"
            element={<GameConfigStubPage title="Monetization" />}
          />
          <Route path="/experience/monitoring" element={<GameConfigStubPage title="Monitoring" />} />
          <Route
            path="/experience/activity"
            element={<GameConfigStubPage title="Activity History" />}
          />
          <Route
            path="/experience/audience/feedback"
            element={<GameConfigStubPage title="Feedback" />}
          />
          <Route
            path="/experience/audience/access"
            element={<GameConfigStubPage title="Access Settings" />}
          />
          <Route
            path="/experience/audience/communication"
            element={<GameConfigStubPage title="Communication Settings" />}
          />
          <Route
            path="/experience/audience/maturity"
            element={<GameConfigStubPage title="Maturity & Compliance" />}
          />
          <Route
            path="/experience/engagement"
            element={<GameConfigStubPage title="Engagement" />}
          />
          <Route
            path="/experience/moderation"
            element={<GameConfigStubPage title="Moderation" />}
          />
          <Route path="/experience/promotion" element={<GameConfigStubPage title="Promotion" />} />
          <Route path="/localization" element={<GlossaryRoot />} />
          <Route path="/translate" element={<TranslationStringsView />} />
          <Route path="/translate-v3" element={<ImageTranslationV3 />} />
          <Route path="/studio" element={<StudioPlatformPage />} />
          <Route path="/navigator" element={<Navigate to="/home#live-navigator" replace />} />
        </Routes>
      </WorkspaceProvider>
    </BrowserRouter>
  );
}
