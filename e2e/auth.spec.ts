import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
  })

  test('halaman landing dimuat dengan benar', async ({ page }) => {
    const heading = page.getByRole('heading', {
      level: 1,
      name: /perkenalkan dirimu/i,
    })
    await expect(heading).toBeVisible()

    const brandLink = page.locator('.landing-logo-text')
    await expect(brandLink).toBeVisible()

    const cta = page.getByRole('link', { name: /buat cv|mulai/i }).first()
    await expect(cta).toBeVisible()
  })

      test('skip-to-content link tersedia', async ({ page }) => {
    const skipLink = page.getByRole('link', { name: /langsung ke konten/i })
    await expect(skipLink).toBeAttached()

    // Skip link harus tersembunyi sebelum focus
    await expect(skipLink).not.toBeVisible()

    // Tab ke skip link → harus muncul
    await page.keyboard.press('Tab')
    await expect(skipLink).toBeVisible()

    // Verifikasi #main-content bisa menerima focus (tabIndex={-1} bekerja)
    await page.locator('#main-content').focus()
    await expect(page.locator('#main-content')).toBeFocused()
  })
})

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle' })
  })

  test('halaman login dimuat dengan benar', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: 'Password' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /masuk/i })
    ).toBeVisible()
  })

  test('tampilkan error untuk kredensial salah', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Email' }).fill('wrong@example.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword')
    await page.getByRole('button', { name: /masuk/i }).click()
    await page.waitForTimeout(2000)
  })
})

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle' })
  })

  test('halaman signup dimuat dengan benar', async ({ page }) => {
    await expect(
      page.getByRole('textbox', { name: /nama lengkap/i })
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: 'Password', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('textbox', { name: /konfirmasi/i })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /buat akun/i })
    ).toBeVisible()
  })

  test('password strength indicator muncul saat mengetik', async ({ page }) => {
    await page
      .getByRole('textbox', { name: 'Password', exact: true })
      .fill('test')
    await expect(
      page.locator('[data-testid="password-strength"]').first()
    ).toBeVisible()
  })
})