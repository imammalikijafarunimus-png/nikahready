'use client'

// ============================================================
// src/app/admin/layout.tsx
//
// Admin panel layout dengan sidebar dan auth guard.
// Hanya user dengan role='admin' yang bisa akses.
//
// FASE 1 FIX:
// - Sidebar sekarang bisa collapse/buka di desktop DAN mobile
// - Main content bergeser saat sidebar terbuka (tidak overlap)
// - Toggle button di top bar untuk desktop
// - Default sidebar terbuka di desktop
// ============================================================

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
  Menu,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { checkIsAdmin } from '@/lib/admin/adminHelpers'

// ── Nav Items ────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
  },
  {
    href: '/admin/subscriptions',
    label: 'Subscriptions',
    icon: CreditCard,
  },
]

// ── Sidebar Component ────────────────────────────────────────
function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="admin-sidebar-title">NikahReady</span>
            <span className="admin-sidebar-badge">Admin</span>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={onClose}
            aria-label="Tutup sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`admin-sidebar-link ${isActive ? 'admin-sidebar-link-active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <Link href="/dashboard" className="admin-sidebar-back">
            <ArrowLeft size={16} />
            <span>Kembali ke App</span>
          </Link>
        </div>
      </aside>
    </>
  )
}

// ── Loading State ─────────────────────────────────────────────
function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <Loader2 size={32} className="animate-spin text-emerald-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500">Memverifikasi akses admin…</p>
      </div>
    </div>
  )
}

// ── Unauthorized State ───────────────────────────────────────
function AdminUnauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center max-w-md mx-auto px-6">
        <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
        <p className="text-sm text-slate-500 mb-6">
          Kamu tidak memiliki akses ke panel admin. Hanya user dengan role admin yang bisa mengakses halaman ini.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}

// ── Main Layout ──────────────────────────────────────────────
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true) // default terbuka di desktop

  useEffect(() => {
    checkIsAdmin().then(({ isAdmin }) => {
      setIsAdmin(isAdmin)
    })
  }, [])

  // Loading
  if (isAdmin === null) return <AdminLoading />

  // Unauthorized
  if (!isAdmin) return <AdminUnauthorized />

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className={`flex-1 min-w-0 transition-[margin] duration-200 ${sidebarOpen ? 'admin-main-shifted' : ''}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="text-sm font-semibold text-slate-700">Admin Panel</span>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}