'use client'

// ============================================================
// src/components/share/ShareMenu.tsx
//
// Dropdown menu untuk share CV: WhatsApp, Email, Copy Link.
// Juga berisi toggle Publish/Unpublish.
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Share2,
  MessageCircle,
  Mail,
  Copy,
  Check,
  Globe,
  Lock,
  X,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import {
  publishProfile,
  unpublishProfile,
  getShareStatus,
  getShareUrl,
} from '@/lib/shareProfile'

// ── Types ────────────────────────────────────────────────────
interface ShareMenuProps {
  /** Nama pemilik CV untuk pesan share */
  ownerName?: string
  /** CSS class tambahan untuk trigger button */
  className?: string
  /** Trigger style variant */
  variant?: 'default' | 'icon-only'
}

// ── Helper: Pesan share ──────────────────────────────────────
function buildShareMessage(ownerName: string, url: string): string {
  return (
    `Assalamu'alaikum, silakan lihat CV Taaruf saya di NikahReady.\n\n` +
    `Nama: ${ownerName}\n` +
    `Link: ${url}\n\n` +
    `Barakallahu fiikum 🤲`
  )
}

// ── Main Component ───────────────────────────────────────────
export function ShareMenu({
  ownerName = '',
  className = '',
  variant = 'default',
}: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [shareId, setShareId] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Load share status on mount
  useEffect(() => {
    getShareStatus().then(({ isPublished, shareId }) => {
      setIsPublished(isPublished)
      setShareId(shareId)
    })
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const shareUrl = shareId ? getShareUrl(shareId) : ''

  // ── Publish toggle ──
  const handleTogglePublish = useCallback(async () => {
    if (isToggling) return
    setIsToggling(true)

    try {
      if (isPublished) {
        const result = await unpublishProfile()
        if (result.success) {
          setIsPublished(false)
        }
      } else {
        const result = await publishProfile()
        if (result.success && result.shareId) {
          setIsPublished(true)
          setShareId(result.shareId)
        }
      }
    } catch (err) {
      console.error('[ShareMenu] Toggle publish error:', err)
    } finally {
      setIsToggling(false)
    }
  }, [isPublished, isToggling])

  // ── Share WhatsApp ──
  const handleShareWhatsApp = useCallback(() => {
    if (!shareUrl || !ownerName) return
    const message = buildShareMessage(ownerName, shareUrl)
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
    setIsOpen(false)
  }, [shareUrl, ownerName])

  // ── Share Email ──
  const handleShareEmail = useCallback(() => {
    if (!shareUrl || !ownerName) return
    const subject = encodeURIComponent(`CV Taaruf - ${ownerName}`)
    const body = encodeURIComponent(buildShareMessage(ownerName, shareUrl))
    window.location.href = `mailto:?subject=${subject}&body=${body}`
    setIsOpen(false)
  }, [shareUrl, ownerName])

  // ── Copy Link ──
  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])

  // ── Trigger button ──
  const triggerClass = variant === 'icon-only'
    ? 'preview-btn-share-icon'
    : 'preview-btn-share'

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${triggerClass} ${className}`}
        title="Bagikan CV"
        aria-label="Bagikan CV"
      >
        {variant === 'icon-only' ? (
          <Share2 size={18} />
        ) : (
          <>
            <Share2 size={16} />
            <span className="hidden sm:inline">Bagikan</span>
          </>
        )}
      </button>

      {/* ── Dropdown Menu ── */}
      {isOpen && (
        <div className="share-menu-dropdown">
          {/* ── Header ── */}
          <div className="share-menu-header">
            <h4 className="share-menu-title">Bagikan CV Taaruf</h4>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="share-menu-close"
              aria-label="Tutup menu bagikan"
            >
              <X size={16} />
            </button>
          </div>

          {/* ── Publish Toggle ── */}
          <div className="share-menu-section">
            <button
              type="button"
              onClick={handleTogglePublish}
              disabled={isToggling}
              className="share-menu-toggle"
            >
              <div className="share-menu-toggle-icon">
                {isToggling ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isPublished ? (
                  <Globe size={18} />
                ) : (
                  <Lock size={18} />
                )}
              </div>
              <div className="share-menu-toggle-content">
                <span className="share-menu-toggle-label">
                  {isPublished ? 'Publik — Siap dibagikan' : 'Privat — Belum dipublikasikan'}
                </span>
                <span className="share-menu-toggle-desc">
                  {isPublished
                    ? 'Siapapun dengan link bisa melihat CV-mu'
                    : 'Publish terlebih dahulu untuk bisa share'}
                </span>
              </div>
              {/* Toggle switch */}
              <div
                className={`share-menu-switch ${isPublished ? 'share-menu-switch-active' : ''}`}
              >
                <div className="share-menu-switch-knob" />
              </div>
            </button>
          </div>

          {/* ── Share Options ── */}
          {isPublished && shareUrl && (
            <div className="share-menu-section">
              {/* Share URL display */}
              <div className="share-menu-url-display">
                <code className="share-menu-url-text">
                  {shareUrl}
                </code>
              </div>

              {/* Action buttons */}
              <div className="share-menu-actions">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="share-menu-action-btn share-menu-action-whatsapp"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp</span>
                </button>

                {/* Email */}
                <button
                  type="button"
                  onClick={handleShareEmail}
                  className="share-menu-action-btn share-menu-action-email"
                >
                  <Mail size={18} />
                  <span>Email</span>
                </button>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="share-menu-action-btn share-menu-action-copy"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                </button>

                {/* Open in new tab */}
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-menu-action-btn share-menu-action-external"
                >
                  <ExternalLink size={18} />
                  <span>Buka</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}