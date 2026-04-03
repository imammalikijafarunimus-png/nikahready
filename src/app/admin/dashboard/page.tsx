'use client'

// ============================================================
// src/app/admin/dashboard/page.tsx
//
// Admin Dashboard — statistik pengguna dan overview.
// ============================================================

import { useState, useEffect } from 'react'
import { Users, Crown, UserPlus, Calendar, CreditCard, Activity, Loader2, type LucideIcon } from 'lucide-react'
import { getAdminStats, type AdminStats } from '@/lib/admin/adminHelpers'
import '@/app/admin/admin-layout.css'

// ── Stat Card Component ──────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: LucideIcon      // ← ganti type-nya
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

// ── Main ─────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-slate-400" />
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
              {/* Bar chart simple */}
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