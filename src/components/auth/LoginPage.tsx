import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
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
    <div className="min-h-[70vh] bg-[#f5efe6] p-6">
      <div className="mx-auto max-w-md pt-8">
        <Card className="overflow-hidden rounded-2xl border-0 bg-[#efe7d8] text-[#2c2825] shadow-sm">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl font-semibold text-[#1c1917]">
              Welcome back
            </CardTitle>
            <CardDescription className="text-[#5f5b55]">
              Log in to track your Dabba Fund contributions.
            </CardDescription>
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
                  className="h-11 w-full rounded-xl border border-[#d8c7ad] bg-white px-3 text-sm text-[#1c1917] outline-none transition focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
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
                    className="h-11 w-full rounded-xl border border-[#d8c7ad] bg-white px-3 pr-11 text-sm text-[#1c1917] outline-none transition focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex h-11 w-11 items-center justify-center rounded-r-xl text-[#5f5b55] transition hover:text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b08238]/20"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" size="lg" className="w-full bg-[#b08238] text-white hover:bg-[#9a6d2d] hover:cursor-pointer">
                Log in
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-[#5f5b55]">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-medium text-[#b08238] hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
