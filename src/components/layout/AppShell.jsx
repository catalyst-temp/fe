import { Header } from "./Header.jsx";
import { ProgressStrip } from "./ProgressStrip.jsx";

export function AppShell({ activePage, activeTitle, navItems, auth, checklistProgress, onNavigate, children }) {
  return (
    <>
      <Header activePage={activePage} auth={auth} navItems={navItems} onNavigate={onNavigate} />
      <ProgressStrip progress={checklistProgress} activeTitle={activeTitle} />
      <main>{children}</main>
    </>
  );
}
