"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid."),
  password: z.string().min(1, "Password harus diisi."),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app";
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError(
        result.error === "CredentialsSignin"
          ? "Email atau password salah."
          : result.error
      );
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
          Masuk ke Akun
        </h1>
        <p className="text-gray-500 text-sm">
          Belum punya akun?{" "}
          <Link href="/daftar" className="text-primary font-medium hover:underline">
            Daftar gratis
          </Link>
        </p>
      </div>

      {/* Google OAuth */}
      <Button
        variant="secondary"
        size="md"
        fullWidth
        loading={googleLoading}
        onClick={handleGoogleLogin}
        className="mb-5 border border-gray-200"
      >
        {!googleLoading && (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Masuk dengan Google
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
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Alamat Email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password Anda"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="text-right mt-1.5">
            <Link href="/lupa-password" className="text-xs text-primary hover:underline">
              Lupa password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          loading={isSubmitting}
          className="mt-2"
        >
          Masuk
        </Button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
        Dengan masuk, Anda menyetujui{" "}
        <Link href="/syarat" className="text-primary hover:underline">
          Syarat &amp; Ketentuan
        </Link>{" "}
        dan{" "}
        <Link href="/privasi" className="text-primary hover:underline">
          Kebijakan Privasi
        </Link>{" "}
        kami.
      </p>
    </div>
  );
}

export default function LoginPage() {
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
              <span className="font-display font-bold text-xl block leading-none">
                Nikah Yuk
              </span>
              <span className="text-primary-200 text-sm leading-none">by Ratna Offset</span>
            </div>
          </Link>

          <h2 className="font-display text-3xl font-bold mb-4 leading-tight">
            Selamat datang kembali!
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed max-w-xs mx-auto">
            Kelola undangan pernikahan digital Anda dan pantau RSVP tamu.
          </p>

          <div className="mt-10 space-y-3">
            {[
              "Dashboard undangan yang intuitif",
              "Pantau RSVP secara real-time",
              "Buku tamu digital tersimpan rapi",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
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
              <span className="font-display font-bold text-primary text-base block leading-none">
                Nikah Yuk
              </span>
              <span className="text-gray-500 text-xs leading-none">by Ratna Offset</span>
            </div>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="w-full max-w-md flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
