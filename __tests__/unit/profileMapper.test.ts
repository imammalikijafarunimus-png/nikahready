// ============================================================
// __tests__/unit/profileMapper.test.ts
// Fase 5.3 — Unit tests untuk shared profile mapper
// ============================================================

import { describe, it, expect } from 'vitest'
import { mapProfileToFormState } from '@/lib/mappers/profileToFormState'
import type { SupabaseProfileRow } from '@/lib/mappers/profileToFormState'

describe('mapProfileToFormState', () => {
  const mockProfile: SupabaseProfileRow = {
    id: 'profile-123',
    user_id: 'user-456',
    nama_lengkap: 'Ahmad Fauzi',
    nama_panggilan: 'Ahmad',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: '1995-05-15',
    kewarganegaraan: 'Indonesia',
    suku_bangsa: 'Jawa',
    domisili_kota: 'Bandung',
    domisili_provinsi: 'Jawa Barat',
    status_pernikahan: 'lajang',
    jumlah_anak: 0,
    tinggi_badan: 175,
    berat_badan: 70,
    golongan_darah: 'A',
    warna_kulit: 'Sawo matang',
    karakter_diri: 'Penyayang',
    kelebihan: ['sabar', 'tekun'],
    kekurangan: ['pelupa'],
    hobi: ['baca buku'],
    mbti_type: 'INFJ',
    mazhab: 'Syafii',
    shalat_fardhu: 'selalu_berjamaah',
    tilawah_rutin: true,
    kajian_rutin: false,
    template_pilihan: 'akademik',
    visi_misi: {
      visi: 'Rumah tangga sakinah',
      misi_suami: 'Menafkahi',
      misi_istri: 'Mendidik anak',
      tujuan_pernikahan: ['sakinah', 'mawaddah', 'warahmah'],
    },
    financial_planning: {
      penghasilan_range: '5-10jt',
      kebutuhan_pokok_persen: 45,
      tabungan_persen: 25,
      investasi_persen: 15,
      sedekah_persen: 10,
      lainnya_persen: 5,
      deskripsi: 'Rencana keuangan keluarga',
    },
    bersedia_poligami: null,
    bersedia_pindah_domisili: null,
  }

  it('mapping data pribadi dengan benar', () => {
    const result = mapProfileToFormState(mockProfile, {})

    expect(result.dataPribadi?.nama_lengkap).toBe('Ahmad Fauzi')
    expect(result.dataPribadi?.nama_panggilan).toBe('Ahmad')
    expect(result.dataPribadi?.tempat_lahir).toBe('Jakarta')
    expect(result.dataPribadi?.tanggal_lahir).toBe('1995-05-15')
    expect(result.dataPribadi?.kewarganegaraan).toBe('Indonesia')
    expect(result.dataPribadi?.status_pernikahan).toBe('lajang')
    expect(result.dataPribadi?.jumlah_anak).toBe(0)
    expect(result.profileId).toBe('profile-123')
  })

  it('mapping fisik kesehatan dengan benar', () => {
    const result = mapProfileToFormState(mockProfile, {})

    expect(result.fisikKesehatan?.tinggi_badan).toBe(175)
    expect(result.fisikKesehatan?.berat_badan).toBe(70)
    expect(result.fisikKesehatan?.golongan_darah).toBe('A')
  })

  it('mapping karakter termasuk arrays', () => {
    const result = mapProfileToFormState(mockProfile, {})

    expect(result.karakter?.karakter_diri).toBe('Penyayang')
    expect(result.karakter?.kelebihan).toEqual(['sabar', 'tekun'])
    expect(result.karakter?.kekurangan).toEqual(['pelupa'])
    expect(result.karakter?.mbti_type).toBe('INFJ')
  })

  it('handle null values dengan fallback yang benar', () => {
    const emptyProfile: SupabaseProfileRow = {
      id: 'empty-id',
      user_id: 'user-id',
    }
    const result = mapProfileToFormState(emptyProfile, {})

    expect(result.dataPribadi?.nama_lengkap).toBe('')
    expect(result.dataPribadi?.kewarganegaraan).toBe('Indonesia') // default
    expect(result.dataPribadi?.jumlah_anak).toBe(0)
    expect(result.fisikKesehatan?.tinggi_badan).toBe('')
    expect(result.karakter?.kelebihan).toEqual([])
  })

  it('mapping visi misi object dengan benar', () => {
    const result = mapProfileToFormState(mockProfile, {})

    expect(result.visiMisi?.visi).toBe('Rumah tangga sakinah')
    expect(result.visiMisi?.misi_suami).toBe('Menafkahi')
    expect(result.visiMisi?.tujuan_pernikahan).toEqual(['sakinah', 'mawaddah', 'warahmah'])
  })

  it('mapping financial planning object dengan benar', () => {
    const result = mapProfileToFormState(mockProfile, {})

    expect(result.financialPlanning?.penghasilan_range).toBe('5-10jt')
    expect(result.financialPlanning?.kebutuhan_pokok_persen).toBe(45)
    expect(result.financialPlanning?.tabungan_persen).toBe(25)
  })

  it('mapping array tables dengan benar', () => {
    const arrays = {
      riwayatPendidikan: [
        {
          id: 'pend-1',
          jenjang: 'S1',
          nama_institusi: 'UI',
          jurusan: 'Informatika',
          tahun_mulai: 2013,
          tahun_selesai: 2017,
          prestasi: 'Cum Laude',
          urutan: 1,
        },
      ],
      riwayatPekerjaan: [],
    }
    const result = mapProfileToFormState(mockProfile, arrays)

    expect(result.riwayatPendidikan).toHaveLength(1)
    expect(result.riwayatPendidikan?.[0].jenjang).toBe('S1')
    expect(result.riwayatPendidikan?.[0].nama_institusi).toBe('UI')
    expect(result.riwayatPekerjaan).toHaveLength(0)
  })

  it('handle broken visi_misi dengan fallback', () => {
    const brokenProfile = { ...mockProfile, visi_misi: 'not-an-object' }
    const result = mapProfileToFormState(brokenProfile, {})

    expect(result.visiMisi?.visi).toBe('')
    expect(result.visiMisi?.tujuan_pernikahan).toEqual([])
  })

  it('handle broken financial_planning dengan fallback', () => {
    const brokenProfile = { ...mockProfile, financial_planning: 'broken' }
    const result = mapProfileToFormState(brokenProfile, {})

    expect(result.financialPlanning?.kebutuhan_pokok_persen).toBe(45)
    expect(result.financialPlanning?.deskripsi).toBe('')
  })
})
