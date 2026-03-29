// ============================================================
// src/app/offline/page.tsx
// Halaman fallback saat offline (required oleh next-pwa)
// ============================================================

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center max-w-sm">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-navy-900 border border-navy-800 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-navy-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
            />
          </svg>
        </div>

        {/* Arabic */}
        <p
          className="font-arabic text-xl text-gold-500 mb-4"
          style={{ direction: 'rtl' }}
        >
          إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </p>
        <p className="text-xs text-navy-500 italic mb-6">
          "Sesungguhnya sesudah kesulitan itu ada kemudahan"
          <br />— QS Al-Insyirah: 6
        </p>

        <h1 className="text-xl font-bold text-white mb-2">
          Tidak Ada Koneksi
        </h1>
        <p className="text-sm text-navy-400 leading-relaxed mb-8">
          Kamu sedang offline. Tapi tenang — data form yang sudah kamu isi
          tersimpan di perangkatmu dan tidak hilang.
        </p>

        {/* Tips offline */}
        <div className="text-left space-y-2 bg-navy-900/60 border border-navy-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-navy-300 mb-2">
            Yang bisa dilakukan saat offline:
          </p>
          {[
            '✓ Data form tersimpan otomatis di perangkat',
            '✓ Buka kembali saat sudah online untuk melanjutkan',
            '✓ Download PDF membutuhkan koneksi internet',
          ].map((tip) => (
            <p key={tip} className="text-xs text-navy-400">
              {tip}
            </p>
          ))}
        </div>
      </div>

      {/* Retry button */}
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-800 border border-navy-700 text-white text-sm font-medium hover:bg-navy-700 transition-colors active:scale-95"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Coba Lagi
      </button>
    </div>
  )
}
