"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter.").max(60, "Nama terlalu panjang."),
    email: z.string().email("Format email tidak valid."),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .regex(/[A-Z]/, "Harus ada minimal 1 huruf kapital.")
      .regex(/[0-9]/, "Harus ada minimal 1 angka."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function DaftarPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setServerError(json.error ?? "Terjadi kesalahan. Silakan coba lagi.");
      return;
    }

    setSuccess(true);
    // Auto-login after registration
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/app");
      router.refresh();
    } else {
      router.push("/login");
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/app" });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center p-8 max-w-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h2>
          <p className="text-gray-600">Mengarahkan ke dashboard Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-4 border-white" />
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full border-4 border-white" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full border-2 border-white" />
        </div>

        <div className="relative z-10 text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-xl block leading-none">Nikah Yuk</span>
              <span className="text-primary-200 text-sm leading-none">by Ratna Offset</span>
            </div>
          </Link>

          <h2 className="font-display text-3xl font-bold mb-4 leading-tight">
            Mulai perjalanan menuju hari istimewa Anda
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed max-w-xs mx-auto">
            Buat undangan impian Anda dengan mudah dan cepat. Bayar sekali, tanpa biaya bulanan.
          </p>

          <div className="mt-10 space-y-3">
            {[
              "Puluhan template premium pilihan",
              "RSVP & buku tamu digital",
              "Bagikan via WhatsApp dalam 1 klik",
              "Support tim kami siap membantu",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-primary-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-12 py-12 bg-warm-50">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-primary text-base block leading-none">Nikah Yuk</span>
              <span className="text-gray-500 text-xs leading-none">by Ratna Offset</span>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Buat Akun Anda</h1>
            <p className="text-gray-500 text-sm">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Google OAuth */}
          <Button
            variant="secondary"
            size="md"
            fullWidth
            loading={googleLoading}
            onClick={handleGoogleSignup}
            className="mb-5 border border-gray-200"
          >
            {!googleLoading && (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Daftar dengan Google
          </Button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-warm-50 text-gray-400">atau dengan email</span>
            </div>
          </div>

          {/* Error alert */}
          {serverError && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 karakter, 1 huruf kapital, 1 angka"
              autoComplete="new-password"
              error={errors.password?.message}
              helperText={!errors.password ? "Minimal 8 karakter, 1 huruf kapital, dan 1 angka." : undefined}
              {...register("password")}
            />

            <Input
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password Anda"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={isSubmitting}
              className="mt-2"
            >
              Buat Akun Sekarang
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
            Dengan mendaftar, Anda menyetujui{" "}
            <Link href="/syarat" className="text-primary hover:underline">Syarat & Ketentuan</Link>{" "}
            dan{" "}
            <Link href="/privasi" className="text-primary hover:underline">Kebijakan Privasi</Link>{" "}
            kami.
          </p>
        </div>
      </div>
    </div>
  );
}
