// ============================================================
// src/components/TemplatePreviewSection.tsx
// Preview 3 template di landing page — Phase 5 Polish
// ============================================================

"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { Lock, CheckCircle2, FileText, ShieldCheck, Eye } from "lucide-react"
import { SAMPLE_STATE } from "@/lib/sample-state"
import { components } from "@/lib/design-system"

// ── Lazy-loaded Templates (Phase 3: reduce landing page JS bundle) ──
const TemplateRingkas = dynamic(() => import("./templates/TemplateRingkas").then(m => ({ default: m.TemplateRingkas })), { ssr: false })
const TemplateSederhana = dynamic(() => import("./templates/TemplateSederhana").then(m => ({ default: m.TemplateSederhana })), { ssr: false })
const TemplateMinimalIslami = dynamic(() => import("./templates/TemplateMinimalIslami").then(m => ({ default: m.TemplateMinimalIslami })), { ssr: false })
const TemplateAkademik = dynamic(() => import("./templates/TemplateAkademik").then(m => ({ default: m.TemplateAkademik })), { ssr: false })
const TemplateElegantIslamic = dynamic(() => import("./templates/TemplateElegantIslamic").then(m => ({ default: m.TemplateElegantIslamic })), { ssr: false })
const TemplateModernPremium = dynamic(() => import("./templates/TemplateModernPremium").then(m => ({ default: m.TemplateModernPremium })), { ssr: false })

const TEMPLATES = [
  // ── FREE templates ──
  {
    id: "ringkas",
    name: "Ringkas",
    desc: "1 halaman padat, cukup untuk first impression",
    badge: "Gratis",
    badgeColor: "bg-sage-600",
    borderColor: "border-sage-700/50",
    available: true,
    meta: "1 halaman · Data inti · Clean",
    component: TemplateRingkas,
  },
  {
    id: "sederhana",
    name: "Qonaah",
    desc: "2 halaman, nuansa sage-green yang bersih",
    badge: "Gratis",
    badgeColor: "bg-sage-600",
    borderColor: "border-sage-700/50",
    available: true,
    meta: "2 halaman · Data lengkap · Simple",
    component: TemplateSederhana,
  },
  {
    id: "minimal-islami",
    name: "Sakinah",
    desc: "1 halaman ornamental, cream & gold",
    badge: "Gratis",
    badgeColor: "bg-sage-600",
    borderColor: "border-sage-700/50",
    available: true,
    meta: "1 halaman · Nuansa Islami · Soft",
    component: TemplateMinimalIslami,
  },
  // ── PREMIUM templates ──
  {
    id: "akademik",
    name: "Amanah",
    desc: "5 halaman komprehensif, semua data",
    badge: "Premium",
    badgeColor: "bg-gold-600",
    borderColor: "border-gold-600/30",
    available: false,
    meta: "5 halaman · Semua data · Pro",
    component: TemplateAkademik,
  },
  {
    id: "elegant-islamic",
    name: "Syar'i",
    desc: "4 halaman, gold & deep green ornamental",
    badge: "Premium",
    badgeColor: "bg-gold-600",
    borderColor: "border-gold-600/30",
    available: false,
    meta: "4 halaman · Elegan & hangat · Elegant",
    component: TemplateElegantIslamic,
  },
  {
    id: "modern-premium",
    name: "Modern Dark",
    desc: "4 halaman, personal branding modern",
    badge: "Premium",
    badgeColor: "bg-gold-600",
    borderColor: "border-gold-600/30",
    available: false,
    meta: "4 halaman · Modern & berkarakter · Bold",
    component: TemplateModernPremium,
  },
]

import React from "react";

// PERF: React.memo — static content, no props, should never re-render after mount
export const TemplatePreviewSection = React.memo(function TemplatePreviewSection() {
  return (
    <section className="py-20 px-6 border-t border-navy-800">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          {/* Decorative Islamic subtitle */}
          <p
            className="text-sm text-gold-500 mb-4"
            style={{ fontFamily: "'Amiri', serif" }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>

          <h2 className="text-2xl font-bold">
            Pilih Tampilan Lembar Taarufmu
          </h2>

          {/* Trust subline */}
          <p className="mt-4 text-navy-300">
            Desain profesional yang sopan dan bermartabat. Siap dibagikan kepada wali, murabbi, atau keluarga.
          </p>
        </div>

        {/* TEMPLATE GRID */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {TEMPLATES.map((t) => {
            const TemplateComponent = t.component

            return (
              <div key={t.id} className="group">
                {/* PREVIEW CARD */}
                <div
                  className={`relative rounded-2xl overflow-hidden border ${t.borderColor} bg-navy-900 transition-all duration-300 group-hover:border-sage-600 group-hover:shadow-lg group-hover:shadow-sage-900/10`}
                  style={{ height: 460 }}
                >
                  {/* LIVE RENDER (scaled) */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%) scale(0.42)",
                      transformOrigin: "top center",
                    }}
                  >
                    <TemplateComponent state={SAMPLE_STATE} />
                  </div>

                  {/* BADGE */}
                  <div
                    className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full ${t.badgeColor} font-semibold z-20 ${t.available ? "animate-pulse" : ""}`}
                  >
                    {t.badge}
                  </div>

                  {/* AVAILABLE INDICATOR */}
                  {t.available && (
                    <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-center gap-2 bg-sage-900/90 backdrop-blur-sm text-white text-xs py-2 rounded-xl border border-sage-700/30 font-medium">
                      <CheckCircle2 size={14} /> <span>Tersedia — Gratis</span>
                    </div>
                  )}

                  {/* COMING SOON OVERLAY */}
                  {!t.available && (
                    <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/60 to-navy-950/80 flex flex-col items-center justify-center gap-3 z-10">
                      {/* Premium badge inside overlay */}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-600/20 border border-gold-500/30 text-gold-400 font-semibold tracking-wide uppercase">
                        Premium
                      </span>
                      <div className="w-10 h-10 rounded-full bg-navy-800/80 border border-navy-700/50 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gold-400" />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        Segera Hadir
                      </span>
                      <span className="text-xs text-navy-300 max-w-[220px] text-center leading-relaxed">
                        Template premium — segera tersedia untuk NikahReady Pro
                      </span>
                    </div>
                  )}
                </div>

                {/* LABEL */}
                <div className="mt-4">
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="text-sm text-navy-300 mt-0.5">{t.desc}</p>
                  <p className="text-[11px] text-navy-500 mt-1">{t.meta}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link href="/create?template=akademik" className={components.buttons.primary}>
            Mulai Buat CV Taaruf
          </Link>
          <p className="mt-3 text-xs text-navy-500">
            Template lainnya segera tersedia
          </p>

          {/* Micro-trust items */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-1.5 text-xs text-navy-500">
              <FileText size={14} /> <span>PDF Siap Pakai</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-navy-500">
              <ShieldCheck size={14} /> <span>Data Terenkripsi</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-navy-500">
              <Eye size={14} /> <span>Hanya Kamu Akses</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
})