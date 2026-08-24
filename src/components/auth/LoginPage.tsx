import { useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type LoginPageProps = {
  onLogin: () => void
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.")
      return
    }

    localStorage.setItem("dabba-fund-user-email", email.trim())
    onLogin()
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
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  required
                  className="h-11 w-full rounded-xl border border-[#d8c7ad] bg-white px-3 text-sm text-[#1c1917] outline-none transition focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                />
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
