import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Nikah Yuk <noreply@nikahyuk.id>';

export async function sendOrderConfirmation({
  to,
  name,
  packageName,
  templateName,
  amount,
  orderId,
  invitationUrl,
}: {
  to: string;
  name: string;
  packageName: string;
  templateName: string;
  amount: number;
  orderId: string;
  invitationUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Pesanan Berhasil — Nikah Yuk',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#333">
        <h2 style="color:#8B6A4A;margin-bottom:8px">Pembayaran Berhasil!</h2>
        <p>Halo <strong>${name}</strong>,</p>
        <p>Terima kasih telah membeli paket undangan di <strong>Nikah Yuk</strong>. Undangan Anda telah dibuat dan siap untuk diedit.</p>
        <div style="background:#fdf8f3;border-radius:8px;padding:20px;margin:24px 0;border:1px solid #e8d5c0">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#666;width:40%">No. Pesanan</td><td style="padding:6px 0;font-weight:600">${orderId.slice(-8).toUpperCase()}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Template</td><td style="padding:6px 0;font-weight:600">${templateName}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Paket</td><td style="padding:6px 0;font-weight:600">${packageName}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Total</td><td style="padding:6px 0;font-weight:600;color:#8B6A4A">${formatted}</td></tr>
          </table>
        </div>
        <a href="${invitationUrl}" style="display:inline-block;background:#8B6A4A;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-bottom:24px">
          Edit Undangan Sekarang →
        </a>
        <p style="color:#999;font-size:13px">Jika ada pertanyaan, balas email ini atau hubungi kami.</p>
      </div>
    `,
  });
}

export async function sendInvitationPublished({
  to,
  name,
  invitationUrl,
  slug,
}: {
  to: string;
  name: string;
  invitationUrl: string;
  slug: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Undangan Anda Sudah Tayang! — Nikah Yuk',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;color:#333">
        <h2 style="color:#8B6A4A;margin-bottom:8px">Undangan Sudah Tayang!</h2>
        <p>Halo <strong>${name}</strong>,</p>
        <p>Undangan pernikahan digital Anda sudah dipublikasikan dan bisa diakses oleh tamu undangan.</p>
        <div style="background:#fdf8f3;border-radius:8px;padding:20px;margin:24px 0;border:1px solid #e8d5c0;text-align:center">
          <p style="color:#666;margin:0 0 8px">Link undangan Anda:</p>
          <a href="${invitationUrl}" style="color:#8B6A4A;font-weight:600;word-break:break-all">${invitationUrl}</a>
        </div>
        <p>Bagikan link di atas kepada tamu undangan Anda melalui WhatsApp, Instagram, atau media sosial lainnya.</p>
        <a href="${invitationUrl}" style="display:inline-block;background:#8B6A4A;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-bottom:24px">
          Lihat Undangan →
        </a>
        <p style="color:#999;font-size:13px">Slug undangan: <code>${slug}</code></p>
      </div>
    `,
  });
}
