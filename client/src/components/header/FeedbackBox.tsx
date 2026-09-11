import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "../ui/toast"

interface FeedbackBoxProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    authData: {
        firstname: string;
        lastname: string;
        email: string;
    } | null;
}

const FeedbackBox = ({ open, onOpenChange, authData }: FeedbackBoxProps) => {
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFeedbackSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
                    name: `${authData?.firstname ?? ""} ${authData?.lastname ?? ""}`.trim() || "User",
                    email: authData?.email || "",
                    subject: "Feedback - Dubba Fund",
                    message: message.trim(),
                }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setMessage("");
                onOpenChange(false);
                toast.add({
                    title: "Feedback sent successfully",
                    type: "success"
                });
            } else {
                toast.add({
                    title: "Failed to send feedback",
                    type: "error"
                });
            }
        } catch (error) {
            console.log("Error sending feedback:", error);
            toast.add({
                title: "Failed to send feedback",
                type: "error"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <form id="feedback-form" onSubmit={handleFeedbackSubmit} className="flex flex-col">
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Feedback</DialogTitle>
                        <DialogDescription>
                            We value your feedback! Please share your thoughts, suggestions, or any issues you've encountered
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="message">Your Feedback</Label>
                            <Textarea
                                id="message"
                                name="message"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Enter your feedback here..."
                                className="resize-none h-32"
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit" form="feedback-form" disabled={!message.trim() || isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit feedback"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default FeedbackBox