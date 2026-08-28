import { useState } from "react"
import { ArrowLeft, ArrowRight, Eye, EyeOff, LogIn, WalletCards } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { defaultContributors } from "@/data/contributors"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type LoginPageProps = {
  onLogin: (contributorId: string) => void
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.")
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    const contributor = defaultContributors.find(
      (person) => person.email.toLowerCase() === normalizedEmail && person.id === password.trim(),
    )

    if (!contributor) {
      setError("Invalid email or password.")
      return
    }

    onLogin(contributor.id)
  }

  return (
    <main className="min-h-svh overflow-hidden bg-[#f8f3e8] text-[#251d17]">
      <section className="relative flex min-h-svh flex-col px-6 py-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#d8a03d]/25 blur-3xl" />
          <div className="absolute bottom-12 left-8 h-36 w-36 rounded-full bg-[#3f7f6f]/15 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-40 w-24 rounded-l-full bg-[#c8553d]/10 blur-2xl" />
        </div>

        <nav className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Back home"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[#e4d3b6] bg-white/70 text-[#46372b] shadow-sm backdrop-blur transition hover:border-[#b08238] hover:text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b08238]/30"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#251d17] text-[#fff8ec] shadow-lg shadow-[#251d17]/15">
              <WalletCards size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight">Dabba Fund</p>
              <p className="text-xs text-[#766754]">shared wallet</p>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex flex-1 items-center py-10">
          <Card className="mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] border border-white/60 bg-[#fff8ec]/90 text-[#2c2825] shadow-2xl shadow-[#7c4f18]/10 backdrop-blur">
            <CardHeader className="space-y-3 pb-5 text-left">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#251d17] text-[#fff8ec] shadow-lg shadow-[#251d17]/15">
                <LogIn size={22} />
              </div>
              <div>
                <CardTitle className="text-3xl font-black leading-tight tracking-normal text-[#1d1712]">
                  Welcome back
                </CardTitle>
                <CardDescription className="mt-2 text-sm leading-6 text-[#665747]">
                  Log in to track contributions, purchases, and the live group balance.
                </CardDescription>
              </div>
            </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2 text-left">
                <label className="block w-full text-sm font-medium text-[#2c2825]" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  className="h-12 w-full rounded-xl border border-[#d8c7ad] bg-white/90 px-3 text-sm text-[#1c1917] shadow-sm outline-none transition placeholder:text-[#a0917d] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                />
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#2c2825]" htmlFor="login-password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                    className="h-12 w-full rounded-xl border border-[#d8c7ad] bg-white/90 px-3 pr-11 text-sm text-[#1c1917] shadow-sm outline-none transition placeholder:text-[#a0917d] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex h-12 w-12 items-center justify-center rounded-r-xl text-[#5f5b55] transition hover:text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b08238]/20"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full gap-2 rounded-xl bg-[#251d17] text-[#fff8ec] shadow-lg shadow-[#251d17]/15 hover:cursor-pointer hover:bg-[#3a2a20]"
              >
                Log in
                <ArrowRight size={17} />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#665747]">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-semibold text-[#251d17] hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
