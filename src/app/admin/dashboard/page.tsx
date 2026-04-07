'use client'

// ============================================================
// src/app/admin/dashboard/page.tsx
//
// Admin Dashboard — statistik pengguna dan overview.
//
// FASE 1 FIX:
// - Tampilkan error state alih-alih silently return 0
// - Error card dengan hint troubleshooting
// - Loading state lebih informatif
// ============================================================

import { useState, useEffect } from 'react'
import { Users, Crown, UserPlus, Calendar, CreditCard, Activity, Loader2, AlertCircle, RefreshCw, type LucideIcon } from 'lucide-react'
import { getAdminStats, type AdminStats } from '@/lib/admin/adminHelpers'
import '@/app/admin/admin-layout.css'

// ── Stat Card Component ──────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: LucideIcon
  label: string
  value: number | string
  colorClass: string
}) {
  return (
    <div className="admin-stat-card">
      <div className={`admin-stat-icon ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  )
}

// ── Error Card Component ─────────────────────────────────────
function ErrorCard({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="admin-error-card">
      <AlertCircle size={32} className="mx-auto mb-3" style={{ color: '#dc2626' }} />
      <p className="admin-error-title">Gagal Memuat Data</p>
      <p className="admin-error-message">{error}</p>
      <p className="admin-error-hint">
        Kemungkinan penyebab:
      </p>
      <ul style={{ textAlign: 'left', fontSize: 12, color: '#64748b', lineHeight: 1.8, paddingLeft: 16, marginBottom: 16 }}>
        <li>Cookie session kadaluarsa — coba <strong>logout dan login ulang</strong></li>
        <li>Role admin belum di-set di database Supabase</li>
        <li>RLS (Row Level Security) memblokir akses — jalankan migration SQL</li>
      </ul>
      <p className="admin-error-hint">
        Untuk set role admin, jalankan di Supabase SQL Editor:<br />
        <code>UPDATE public.users SET role = &apos;admin&apos; WHERE email = &apos;emailkamu@gmail.com&apos;;</code>
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="admin-btn admin-btn-primary"
        style={{ marginTop: 16 }}
      >
        <RefreshCw size={14} /> Coba Lagi
      </button>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminStats()
      if (data) {
        setStats(data)
      } else {
        setError('Response kosong dari server')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin text-slate-400 mx-auto mb-3" />
          <p style={{ fontSize: 14, color: '#64748b' }}>Memuat data dashboard…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            Overview statistik NikahReady
          </p>
        </div>
        <ErrorCard error={error} onRetry={fetchStats} />
      </div>
    )
  }

  if (!stats) return null

  // Hitung persentase premium
  const premiumPct = stats.totalUsers > 0
    ? Math.round((stats.premiumUsers / stats.totalUsers) * 100)
    : 0

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
          Overview statistik NikahReady
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="admin-stat-grid">
        <StatCard
          icon={Users}
          label="Total Pengguna"
          value={stats.totalUsers}
          colorClass="admin-stat-icon-emerald"
        />
        <StatCard
          icon={Crown}
          label="Pengguna Pro"
          value={stats.premiumUsers}
          colorClass="admin-stat-icon-violet"
        />
        <StatCard
          icon={UserPlus}
          label="User Baru Minggu Ini"
          value={stats.newUsersThisWeek}
          colorClass="admin-stat-icon-blue"
        />
        <StatCard
          icon={Calendar}
          label="User Baru Bulan Ini"
          value={stats.newUsersThisMonth}
          colorClass="admin-stat-icon-amber"
        />
        <StatCard
          icon={CreditCard}
          label="Total Subscriptions"
          value={stats.totalSubscriptions}
          colorClass="admin-stat-icon-slate"
        />
        <StatCard
          icon={Activity}
          label="Subscriptions Aktif"
          value={stats.activeSubscriptions}
          colorClass="admin-stat-icon-emerald"
        />
      </div>

      {/* ── Quick Summary ── */}
      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2 className="admin-table-title">Ringkasan</h2>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {/* Plan Distribution */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                Distribusi Plan
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    <span>Free ({stats.freeUsers})</span>
                    <span>{100 - premiumPct}%</span>
                  </div>
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${100 - premiumPct}%`, background: '#94a3b8', borderRadius: 4, transition: 'width 0.3s' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    <span>Pro ({stats.premiumUsers})</span>
                    <span>{premiumPct}%</span>
                  </div>
                  <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${premiumPct}%`, background: '#065F46', borderRadius: 4, transition: 'width 0.3s' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                Konversi Free → Pro
              </p>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#065F46', lineHeight: 1 }}>
                {premiumPct}%
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                dari {stats.totalUsers} total pengguna
              </p>
            </div>

            {/* Growth */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
                Pertumbuhan
              </p>
              <p style={{ fontSize: 32, fontWeight: 700, color: '#2563eb', lineHeight: 1 }}>
                +{stats.newUsersThisWeek}
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                pengguna baru minggu ini
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}