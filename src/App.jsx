import { useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell.jsx";
import { ChecklistPage } from "./pages/ChecklistPage.jsx";
import { AdsPage } from "./pages/AdsPage.jsx";
import { RoadmapPage } from "./pages/RoadmapPage.jsx";
import { FinancePage } from "./pages/FinancePage.jsx";
import { QnaPage } from "./pages/QnaPage.jsx";
import { navItems } from "./data/navigation.js";
import { useChecklistProgress } from "./services/checklistService.js";
import { useAuth } from "./services/authService.js";

const pageComponents = {
  checklist: ChecklistPage,
  iklan: AdsPage,
  roadmap: RoadmapPage,
  keuangan: FinancePage,
  qna: QnaPage,
};

export default function App() {
  const [activePage, setActivePage] = useState("checklist");
  const auth = useAuth();
  const checklist = useChecklistProgress(auth.isAuthenticated);
  const ActivePage = pageComponents[activePage];

  const activeTitle = useMemo(
    () => navItems.find((item) => item.id === activePage)?.label ?? "Dashboard",
    [activePage],
  );

  return (
    <AppShell
      activePage={activePage}
      activeTitle={activeTitle}
      navItems={navItems}
      auth={auth}
      checklistProgress={checklist.progress}
      onNavigate={setActivePage}
    >
      <ActivePage auth={auth} checklist={checklist} />
    </AppShell>
  );
}
