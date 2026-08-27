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

const WEB3FORMS_ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "").trim()

type Web3FormsResponse = {
    success?: boolean
    message?: string
    body?: {
        message?: string
    }
}

const getWeb3FormsErrorMessage = (result: Web3FormsResponse) =>
    result.body?.message || result.message || "Unable to submit your request right now."

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!WEB3FORMS_ACCESS_KEY) {
            setStatus({
                type: "error",
                message: "Web3Forms access key is missing. Add VITE_WEB3FORMS_ACCESS_KEY in your environment before submitting.",
            })
            return
        }

        setIsSubmitting(true)
        setStatus(null)

        try {
            const form = new FormData(event.currentTarget)
            form.append("access_key", WEB3FORMS_ACCESS_KEY)
            form.append("subject", "New Dabba Fund signup request")
            form.append("from_name", "Dabba Fund App")
            form.append("message", `New signup request from Dabba Fund.\n\nName: ${formData.name}\nEmail: ${formData.email}\n`)
            form.append("botcheck", "")

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: form,
            })

            const result = await response.json() as Web3FormsResponse

            if (!response.ok || result.success !== true) {
                throw new Error(getWeb3FormsErrorMessage(result))
            }

            setStatus({
                type: "success",
                message: "Your request has been submitted to the admin. They will add your account after review.",
            })
            setFormData({ name: "", email: "" })
        } catch (error) {
            setStatus({
                type: "error",
                message: error instanceof Error ? error.message : "Something went wrong while submitting the request.",
            })
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className="min-h-[70vh] bg-[#f5efe6] p-6">
            <div className="mx-auto max-w-md pt-8">
                <Card className="overflow-hidden rounded-2xl border-0 bg-[#efe7d8] text-[#2c2825] shadow-sm">
                    <CardHeader className="space-y-2 pb-4">
                        <CardTitle className="text-2xl font-semibold text-[#1c1917]">
                            Create account
                        </CardTitle>
                        <CardDescription className="text-[#5f5b55]">
                            Start tracking your group fund and contributions.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-2 text-left">
                                <label className="block text-sm font-medium text-[#2c2825]" htmlFor="signup-name">
                                    Full name
                                </label>
                                <input
                                    id="signup-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(event) => handleChange("name", event.target.value)}
                                    placeholder="Your name"
                                    required
                                    className="h-11 w-full rounded-xl border border-[#d8c7ad] bg-white px-3 text-sm text-[#1c1917] outline-none transition focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                                />
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="block text-sm font-medium text-[#2c2825]" htmlFor="signup-email">
                                    Email
                                </label>
                                <input
                                    id="signup-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(event) => handleChange("email", event.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="h-11 w-full rounded-xl border border-[#d8c7ad] bg-white px-3 text-sm text-[#1c1917] outline-none transition focus:border-[#b08238] focus:ring-2 focus:ring-[#b08238]/20"
                                />
                            </div>

                            {status && (
                                <p
                                    className={`text-sm ${status.type === "success" ? "text-emerald-700" : "text-red-600"
                                        }`}
                                >
                                    {status.message}
                                </p>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="w-full bg-[#b08238] text-white hover:bg-[#9a6d2d] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Details"}
                            </Button>
                        </form>

                        <p className="mt-5 text-center text-sm text-[#5f5b55]">
                            Already have an account? {" "}
                            <Link to="/login" className="font-medium text-[#b08238] hover:underline">
                                Log in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default SignupPage
