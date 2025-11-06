import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-semibold">Panopticon</h1>
        <p className="text-zinc-600">시작하려면 로그인 또는 회원가입하세요.</p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
          >
            로그인
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          >
            회원가입
          </Link>
        </div>
      </div>
    </main>
  );
}
