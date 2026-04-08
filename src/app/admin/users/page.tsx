'use client'

// ============================================================
// src/app/admin/users/page.tsx
//
// Admin Users — daftar user, search, filter, upgrade/downgrade plan.
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Crown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  getAdminUsers,
  updateUserPlan,
  updateUserRole,
  type AdminUser,
} from '@/lib/admin/adminHelpers'
import '@/app/admin/admin-layout.css'

// ── Constants ────────────────────────────────────────────────
const PER_PAGE = 15

type PlanFilter = 'all' | 'free' | 'premium'

// ── Confirm Modal ────────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  warning,
  showNotes,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  notesValue,
  onNotesChange,
}: {
  title: string
  message: string
  warning?: string
  showNotes?: boolean
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  notesValue: string
  onNotesChange: (v: string) => void
}) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{title}</h3>
          <button type="button" className="admin-modal-close" onClick={onCancel} aria-label="Tutup dialog">
            <X size={16} />
          </button>
        </div>
        <div className="admin-modal-body">
          <p className="admin-confirm-text">{message}</p>
          {warning && (
            <div className="admin-confirm-warning">
              <p>{warning}</p>
            </div>
          )}
          {showNotes && (
            <div style={{ marginBottom: 0 }}>
              <label className="admin-notes-label" htmlFor="admin-notes">Catatan (opsional)</label>
              <textarea
                id="admin-notes"
                className="admin-notes-input"
                value={notesValue}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Alasan perubahan..."
              />
            </div>
          )}
        </div>
        <div className="admin-modal-actions">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<PlanFilter>('all')
  const [searchInput, setSearchInput] = useState('')

  // Modal state
  const [modal, setModal] = useState<{
    type: 'upgrade' | 'downgrade' | 'promote' | 'demote'
    user: AdminUser
  } | null>(null)
  const [notes, setNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // ── Fetch Users ──
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const planVal = planFilter === 'all' ? undefined : planFilter
      const { users, total } = await getAdminUsers({
        search: search || undefined,
        plan: planVal,
        page,
        perPage: PER_PAGE,
      })
      setUsers(users)
      setTotal(total)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data user'
      setError(msg)
      console.error('[NikahReady] fetchUsers error:', err)
    } finally {
      setLoading(false)
    }
  }, [search, planFilter, page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Reset page on filter change
  useEffect(() => { setPage(1) }, [search, planFilter])

  // ── Search handler ──
  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  // ── Plan change handler ──
  const handlePlanChange = async () => {
    if (!modal) return
    setActionLoading(true)

    const newPlan = modal.type === 'upgrade' ? 'premium' : 'free'
    const result = await updateUserPlan(modal.user.id, newPlan, notes)

    setActionLoading(false)
    setModal(null)
    setNotes('')

    if (result.success) {
      fetchUsers()
    } else {
      alert(result.error || 'Gagal mengubah plan')
    }
  }

  // ── Role change handler ──
  const handleRoleChange = async () => {
    if (!modal) return
    setActionLoading(true)

    const newRole = modal.type === 'promote' ? 'admin' : 'user'
    const result = await updateUserRole(modal.user.id, newRole, notes)

    setActionLoading(false)
    setModal(null)
    setNotes('')

    if (result.success) {
      fetchUsers()
    } else {
      alert(result.error || 'Gagal mengubah role')
    }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
          Users
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
          Kelola pengguna dan plan akses
        </p>
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div className="admin-search">
          <Search size={16} color="#94a3b8" aria-hidden="true" />
          <input
            type="text"
            aria-label="Cari pengguna berdasarkan email"
            placeholder="Cari email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* Plan Filter */}
        <div className="admin-filter-tabs">
          <button
            type="button"
            className={`admin-filter-tab ${planFilter === 'all' ? 'admin-filter-tab-active' : ''}`}
            onClick={() => setPlanFilter('all')}
          >
            Semua
          </button>
          <button
            type="button"
            className={`admin-filter-tab ${planFilter === 'free' ? 'admin-filter-tab-active' : ''}`}
            onClick={() => setPlanFilter('free')}
          >
            Free
          </button>
          <button
            type="button"
            className={`admin-filter-tab ${planFilter === 'premium' ? 'admin-filter-tab-active' : ''}`}
            onClick={() => setPlanFilter('premium')}
          >
            Pro
          </button>
        </div>

        <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 'auto' }}>
          {total} user
        </span>
      </div>

      {/* ── Users Table ── */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-empty">
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
            <p>Memuat data…</p>
          </div>
        ) : error ? (
          <div className="admin-error-card">
            <AlertCircle size={24} style={{ color: '#dc2626', margin: '0 auto 8px' }} />
            <p className="admin-error-title">Gagal Memuat Data User</p>
            <p className="admin-error-message">{error}</p>
            <button type="button" className="admin-btn admin-btn-primary" style={{ marginTop: 12 }} onClick={fetchUsers}>
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <p>Tidak ada user ditemukan.</p>
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Role</th>
                  <th>Terdaftar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <span style={{ fontWeight: 500, color: '#0F172A' }}>
                        {user.email}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${user.plan === 'premium' ? 'admin-badge-premium' : 'admin-badge-free'}`}>
                        {user.plan === 'premium' ? (
                          <><Crown size={12} /> Pro</>
                        ) : (
                          'Free'
                        )}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${user.role === 'admin' ? 'admin-badge-admin' : 'admin-badge-free'}`}>
                        {user.role === 'admin' ? (
                          <><ShieldCheck size={12} /> Admin</>
                        ) : (
                          'User'
                        )}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: '#64748b' }}>
                      {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {user.role !== 'admin' && (
                          <>
                            {user.plan === 'free' ? (
                              <button
                                type="button"
                                className="admin-btn admin-btn-primary admin-btn-sm"
                                onClick={() => setModal({ type: 'upgrade', user })}
                              >
                                <Crown size={12} /> Upgrade Pro
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary admin-btn-sm"
                                onClick={() => setModal({ type: 'downgrade', user })}
                              >
                                <Crown size={12} /> Downgrade
                              </button>
                            )}
                            <button
                              type="button"
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              onClick={() => setModal({ type: 'promote', user })}
                            >
                              <ShieldCheck size={12} /> Promote
                            </button>
                          </>
                        )}
                        {user.role === 'admin' && (
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => setModal({ type: 'demote', user })}
                          >
                            <ShieldAlert size={12} /> Demote
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <span>
                  Halaman {page} dari {totalPages}
                </span>
                <div className="admin-pagination-buttons">
                  <button
                    type="button"
                    className="admin-pagination-btn"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    className="admin-pagination-btn"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <ConfirmModal
          title={
            modal.type === 'upgrade' ? 'Upgrade ke Pro' :
            modal.type === 'downgrade' ? 'Downgrade ke Free' :
            modal.type === 'promote' ? 'Promote ke Admin' :
            'Demote dari Admin'
          }
          message={
            modal.type === 'upgrade'
              ? `Upgrade plan ${modal.user.email} dari Free menjadi Pro?`
              : modal.type === 'downgrade'
              ? `Downgrade plan ${modal.user.email} dari Pro menjadi Free? User tidak akan bisa mengakses fitur Pro setelah ini.`
              : modal.type === 'promote'
              ? `Jadikan ${modal.user.email} sebagai Admin? Admin bisa mengakses panel ini dan mengelola user lain.`
              : `Cabut akses Admin dari ${modal.user.email}?`
          }
          warning={
            modal.type === 'downgrade'
              ? 'User yang di-downgrade akan langsung kehilangan akses fitur Pro.'
              : modal.type === 'promote'
              ? 'Admin baru akan bisa melihat dan mengelola semua data pengguna.'
              : modal.type === 'demote'
              ? 'Admin yang di-demote tidak bisa lagi mengakses panel ini.'
              : undefined
          }
          showNotes
          confirmLabel={
            modal.type === 'upgrade' ? 'Upgrade' :
            modal.type === 'downgrade' ? 'Downgrade' :
            modal.type === 'promote' ? 'Promote' :
            'Demote'
          }
          cancelLabel="Batal"
          onConfirm={modal.type === 'upgrade' || modal.type === 'downgrade' ? handlePlanChange : handleRoleChange}
          onCancel={() => { setModal(null); setNotes('') }}
          notesValue={notes}
          onNotesChange={setNotes}
        />
      )}

      {/* Loading overlay for actions */}
      {actionLoading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 70,
          background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', padding: 20, borderRadius: 12, textAlign: 'center' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: '#065F46', margin: '0 auto 8px' }} />
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>Memproses…</p>
          </div>
        </div>
      )}
    </div>
  )
}