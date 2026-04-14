import Header from './Header'
import BottomNav from './BottomNav'
import './Layout.css'

/**
 * Layout wraps every protected screen.
 * - Renders the sticky Header and fixed BottomNav.
 * - Pass title, showBack, rightAction to control the Header.
 * - Pass hideNav to suppress the BottomNav (e.g. during booking flow).
 *
 * IMPORTANT: Do NOT import or render <Header> separately inside a screen
 * that already uses <Layout>. That will produce a double header.
 */
export default function Layout({
  children,
  title,
  showBack = false,
  onBack,
  rightAction,
  hideNav = false,
}) {
  return (
    <div className="layout">
      <Header
        title={title}
        showBack={showBack}
        onBack={onBack}
        rightAction={rightAction}
      />
      <main className={`layout-main ${hideNav ? '' : 'layout-main-with-nav'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
