import Header from './Header'
import BottomNav from './BottomNav'
import './Layout.css'

export default function Layout({ children, title, showBack = false, rightAction, hideNav = false }) {
  return (
    <div className="layout">
      <Header title={title} showBack={showBack} rightAction={rightAction} />
      <main className={`layout-main ${hideNav ? '' : 'layout-main-with-nav'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
