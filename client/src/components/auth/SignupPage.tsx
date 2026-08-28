import axios from "axios";
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, Eye, EyeOff, UserPlus, WalletCards } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/useAuth"

const SignupPage = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError("");
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const signUpData = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
        };

        setIsSubmitting(true);
        try {
            await signup(signUpData);
            navigate("/", { replace: true });
        } catch (requestError) {
            if (axios.isAxiosError(requestError)) {
                setError(requestError.response?.data?.message ?? "Could not create your account.");
            } else {
                setError("Could not create your account.");
            }
        } finally {
            setIsSubmitting(false);
        }
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
                                <UserPlus size={22} />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-black leading-tight tracking-normal text-[#1d1712]">
                                    Create account
                                </CardTitle>
                                <CardDescription className="mt-2 text-sm leading-6 text-[#665747]">
                                    Join the shared wallet and start tracking every contribution clearly.
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="space-y-2 text-left">
                                    <label className="block text-sm font-medium text-[#2c2825]" htmlFor="signup-firstname">
                                        First name
                                    </label>
                                    <input
                                        id="signup-firstname"
                                        name="firstname"
                                        type="text"
                                        value={formData.firstname}
                                        onChange={(event) => handleChange("firstname", event.target.value)}
                                        placeholder="Your first name"
                                        required
                                        className="h-12 w-full rounded-xl border border-[#d8c7ad] bg-white/90 px-3 text-sm text-[#1c1917] shadow-sm outline-none transition placeholder:text-[#a0917d] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                                    />
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="block text-sm font-medium text-[#2c2825]" htmlFor="signup-lastname">
                                        Last name
                                    </label>
                                    <input
                                        id="signup-lastname"
                                        name="lastname"
                                        type="text"
                                        value={formData.lastname}
                                        onChange={(event) => handleChange("lastname", event.target.value)}
                                        placeholder="Your last name"
                                        required
                                        className="h-12 w-full rounded-xl border border-[#d8c7ad] bg-white/90 px-3 text-sm text-[#1c1917] shadow-sm outline-none transition placeholder:text-[#a0917d] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                                    />
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="block text-sm font-medium text-[#2c2825]" htmlFor="signup-email">
                                        Email
                                    </label>
                                    <input
                                        id="signup-email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(event) => handleChange("email", event.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        className="h-12 w-full rounded-xl border border-[#d8c7ad] bg-white/90 px-3 text-sm text-[#1c1917] shadow-sm outline-none transition placeholder:text-[#a0917d] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                                    />
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="block text-sm font-medium text-[#2c2825]" htmlFor="signup-password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="signup-password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(event) => handleChange("password", event.target.value)}
                                            placeholder="Create a password"
                                            required
                                            minLength={6}
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

                                <div className="space-y-2 text-left">
                                    <label className="block text-sm font-medium text-[#2c2825]" htmlFor="signup-confirm-password">
                                        Confirm password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="signup-confirm-password"
                                            name="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(event) => handleChange("confirmPassword", event.target.value)}
                                            placeholder="Re-enter your password"
                                            required
                                            minLength={6}
                                            className="h-12 w-full rounded-xl border border-[#d8c7ad] bg-white/90 px-3 pr-11 text-sm text-[#1c1917] shadow-sm outline-none transition placeholder:text-[#a0917d] focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                            onClick={() => setShowConfirmPassword((value) => !value)}
                                            className="absolute inset-y-0 right-0 flex h-12 w-12 items-center justify-center rounded-r-xl text-[#5f5b55] transition hover:text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#b08238]/20"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                                    name="submit"
                                    disabled={isSubmitting}
                                    size="lg"
                                    className="h-12 w-full gap-2 rounded-xl bg-[#251d17] text-[#fff8ec] shadow-lg shadow-[#251d17]/15 hover:cursor-pointer hover:bg-[#3a2a20] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? "Creating account..." : "Sign Up"}
                                    <ArrowRight size={17} />
                                </Button>
                            </form>

                            <p className="mt-6 text-center text-sm text-[#665747]">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-[#251d17] hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    )
}

export default SignupPage
