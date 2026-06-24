const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MIN_SCORE = 0.5;

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    // Jika key belum dikonfigurasi, skip verifikasi (development)
    if (process.env.NODE_ENV === 'development') return { success: true };
    return { success: false };
  }

  try {
    const res = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });
    const data = await res.json();
    return {
      success: data.success === true && (data.score ?? 1) >= MIN_SCORE,
      score: data.score,
    };
  } catch {
    return { success: false };
  }
}
