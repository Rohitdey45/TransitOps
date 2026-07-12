import React from 'react'
import { Link } from 'react-router-dom'
import { Route } from 'lucide-react'
import { Button } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-bg text-center px-6">
      <Route size={26} className="text-faint" />
      <h1 className="font-display font-semibold text-[22px]">Route not found</h1>
      <p className="text-dim text-[13px] max-w-sm">The screen you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard"><Button size="sm">Back to Dashboard</Button></Link>
    </div>
  )
}
