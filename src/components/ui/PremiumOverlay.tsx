'use client'

// ============================================================
// src/components/ui/PremiumOverlay.tsx
//
// Overlay yang menutupi step premium untuk free user.
// Form content tetap terlihat di belakang (read-only) dengan
// pointer-events: none, sehingga user bisa preview isinya
// tapi tidak bisa mengisi.
//
// Overlay menampilkan:
// - Ikon gembok + badge PRO
// - Judul step yang dikunci
// - Penjelasan mengapa dikunci
// - Tombol "Upgrade ke Pro" → /upgrade
// - Tombol "Tutup overlay" untuk melihat preview saja
// ============================================================

import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, X, Eye, Lock } from 'lucide-react'

interface PremiumOverlayProps {
  stepTitle: string
  stepIcon?: string
}

export function PremiumOverlay({ stepTitle, stepIcon }: PremiumOverlayProps) {
  const [isPeeking, setIsPeeking] = useState(false)

  // Jika user klik "Lihat saja", sembunyikan overlay
  if (isPeeking) {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gold-900/90 border border-gold-700/40 shadow-lg backdrop-blur-sm">
          <Lock size={14} className="text-gold-400" />
          <span className="text-xs text-gold-200 font-medium">
            {stepTitle} — Mode preview
          </span>
          <Link
            href="/upgrade"
            className="ml-2 px-2.5 py-1 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-white text-[10px] font-bold hover:from-gold-500 hover:to-gold-400 transition-all"
          >
            Upgrade
          </Link>
          <button
            type="button"
            onClick={() => setIsPeeking(false)}
            className="ml-1 p-1 rounded-lg hover:bg-gold-800/50 transition-colors"
            aria-label="Tutup preview"
          >
            <X size={12} className="text-gold-400" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-xl">
      {/* Backdrop — semi-transparent, form content terlihat di belakang */}
      <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-[2px] rounded-xl" />

      {/* Overlay card */}
      <div className="relative z-10 max-w-xs w-[90%] mx-auto text-center px-4 py-6">
        {/* Lock icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gold-900/30 border border-gold-700/40 flex items-center justify-center mb-4">
          {stepIcon ? (
            <span className="text-2xl">{stepIcon}</span>
          ) : (
            <Lock size={24} className="text-gold-400" />
          )}
        </div>

        {/* PRO badge */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-900/30 border border-gold-700/40 text-gold-400 text-[10px] font-bold uppercase tracking-wider mb-3">
          <Sparkles size={10} />
          Premium
        </span>

        {/* Title */}
        <h3 className="text-base font-bold text-white mb-2">
          {stepTitle}
        </h3>

        {/* Description */}
        <p className="text-xs text-navy-300 leading-relaxed mb-5">
          Langkah ini hanya tersedia untuk pengguna NikahReady Pro.
          Upgrade untuk mengisi data dan melengkapi profil taarufmu.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col gap-2">
          <Link
            href="/upgrade"
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-gold active:scale-95 transition-all border-0 hover:from-gold-500 hover:to-gold-400 flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            Upgrade ke Pro
          </Link>

          <button
            type="button"
            onClick={() => setIsPeeking(true)}
            className="w-full py-2 px-4 rounded-xl bg-transparent border border-navy-600/40 text-navy-400 text-xs font-medium cursor-pointer transition-all hover:border-navy-500 hover:text-navy-300 flex items-center justify-center gap-1.5"
          >
            <Eye size={14} />
            Lihat Preview Saja
          </button>
        </div>
      </div>
    </div>
  )
}