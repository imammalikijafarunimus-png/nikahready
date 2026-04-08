'use client'

// ============================================================
// src/app/admin/subscriptions/page.tsx
//
// Admin Subscriptions — riwayat perubahan plan user.
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CreditCard,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  getSubscriptions,
  type SubscriptionRecord,
} from '@/lib/admin/adminHelpers'
import '@/app/admin/admin-layout.css'

const PER_PAGE = 20

type StatusFilter = 'all' | 'active' | 'expired' | 'cancelled' | 'trial'

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const fetchSubs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const status = statusFilter === 'all' ? undefined : statusFilter
      const { subscriptions, total } = await getSubscriptions({ status, page, perPage: PER_PAGE })
      setSubscriptions(subscriptions)
      setTotal(total)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat data subscription'
      setError(msg)
      console.error('[NikahReady] fetchSubscriptions error:', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, page])

  useEffect(() => { fetchSubs() }, [fetchSubs])
  useEffect(() => { setPage(1) }, [statusFilter])

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
          Subscriptions
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
          Riwayat perubahan plan dan berlangganan pengguna
        </p>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="admin-filter-tabs">
          {(['all', 'active', 'expired', 'cancelled', 'trial'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`admin-filter-tab ${statusFilter === s ? 'admin-filter-tab-active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 'auto' }}>
          {total} records
        </span>
      </div>

      {/* ── Table ── */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-empty">
            <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
            <p>Memuat data…</p>
          </div>
        ) : error ? (
          <div className="admin-error-card">
            <AlertCircle size={24} style={{ color: '#dc2626', margin: '0 auto 8px' }} />
            <p className="admin-error-title">Gagal Memuat Data Subscriptions</p>
            <p className="admin-error-message">{error}</p>
            <button type="button" className="admin-btn admin-btn-primary" style={{ marginTop: 12 }} onClick={fetchSubs}>
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="admin-empty">
            <CreditCard size={24} style={{ margin: '0 auto 8px', color: '#cbd5e1' }} />
            <p>Belum ada data subscription.</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Mulai</th>
                    <th>Berakhir</th>
                    <th>Provider</th>
                    <th>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 500, color: '#0F172A', fontSize: 13 }}>
                        {sub.user_email}
                      </td>
                      <td>
                        <span className={`admin-badge ${sub.plan === 'premium' ? 'admin-badge-premium' : 'admin-badge-free'}`}>
                          {sub.plan === 'premium' ? 'Pro' : 'Free'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge admin-badge-${sub.status}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 13, color: '#64748b' }}>
                        {new Date(sub.start_date).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td style={{ fontSize: 13, color: '#64748b' }}>
                        {sub.end_date
                          ? new Date(sub.end_date).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : <span style={{ color: '#059669', fontWeight: 500 }}>Unlimited</span>
                        }
                      </td>
                      <td style={{ fontSize: 12, color: '#94a3b8' }}>
                        {sub.payment_provider === 'manual' ? 'Manual' : sub.payment_provider || '-'}
                      </td>
                      <td style={{ fontSize: 12, color: '#64748b', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <span>Halaman {page} dari {totalPages}</span>
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
    </div>
  )
}