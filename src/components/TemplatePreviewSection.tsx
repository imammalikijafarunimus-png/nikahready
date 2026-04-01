// ============================================================
// src/components/TemplatePreviewSection.tsx
// Preview 3 template di landing page
// ============================================================

"use client"

import Link from "next/link"
import { Lock } from "lucide-react"
import { TemplateAkademik } from "./templates/TemplateAkademik"
import { TemplateElegantIslamic } from "./templates/TemplateElegantIslamic"
import { TemplateModernPremium } from "./templates/TemplateModernPremium"
import { SAMPLE_STATE } from "@/lib/sample-state"
import { components } from "@/lib/design-system"

const TEMPLATES = [
  {
    id: "akademik",
    name: "Akademik",
    desc: "Formal, lengkap & terstruktur",
    badge: "Gratis",
    badgeColor: "bg-sage-600",
    borderColor: "border-sage-700/50",
    available: true,
    component: TemplateAkademik,
  },
  {
    id: "elegant-islamic",
    name: "Elegant Islamic",
    desc: "Nuansa Islami hangat & elegan",
    badge: "Premium",
    badgeColor: "bg-gold-600",
    borderColor: "border-gold-600/30",
    available: false,
    component: TemplateElegantIslamic,
  },
  {
    id: "modern-premium",
    name: "Modern Premium",
    desc: "Personal branding modern",
    badge: "Premium",
    badgeColor: "bg-gold-600",
    borderColor: "border-gold-600/30",
    available: false,
    component: TemplateModernPremium,
  },
]

export function TemplatePreviewSection() {
  return (
    <section className="py-20 px-6 border-t border-navy-800">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">
            Pilih Tampilan Lembar Taarufmu
          </h2>
          <p className="mt-4 text-navy-300">
            Desain profesional yang siap dibagikan kepada keluarga atau wali.
          </p>
        </div>

        {/* TEMPLATE GRID */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">

          {TEMPLATES.map((t) => {
            const TemplateComponent = t.component

            return (
              <div key={t.id} className="group">
                {/* PREVIEW CARD */}
                <div
                  className={`relative rounded-2xl overflow-hidden border ${t.borderColor} bg-navy-900`}
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
                    className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full ${t.badgeColor} font-semibold z-20`}
                  >
                    {t.badge}
                  </div>

                  {/* AVAILABLE INDICATOR */}
                  {t.available && (
                    <div className="absolute bottom-3 left-3 right-3 z-20">
                      <div className="bg-sage-600/90 text-white text-xs text-center py-1.5 rounded-lg font-medium">
                        ✓ Tersedia
                      </div>
                    </div>
                  )}

                  {/* COMING SOON OVERLAY */}
                  {!t.available && (
                    <div className="absolute inset-0 bg-navy-950/60 flex flex-col items-center justify-center gap-3 z-10">
                      <div className="w-10 h-10 rounded-full bg-navy-800 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gold-400" />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        Segera Hadir
                      </span>
                      <span className="text-xs text-navy-300 max-w-[200px] text-center leading-relaxed">
                        Template sedang dalam pengembangan
                      </span>
                    </div>
                  )}
                </div>

                {/* LABEL */}
                <div className="mt-4">
                  <h3 className="font-semibold text-white">{t.name}</h3>
                  <p className="text-sm text-navy-300 mt-0.5">{t.desc}</p>
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
        </div>

      </div>
    </section>
  )
}