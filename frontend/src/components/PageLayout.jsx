import React from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function PageLayout({ title, subtitle, actions, children }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar title={title} subtitle={subtitle} actions={actions} />
        <main className="px-8 py-7 animate-fade-in">{children}</main>
      </div>
    </div>
  )
}
