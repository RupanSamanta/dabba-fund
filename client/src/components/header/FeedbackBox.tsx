import { useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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

    const handleFeedbackSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedMessage = message.trim();
        if (!trimmedMessage) {
            alert("Please enter your feedback");
            return;
        }

        const formData = new FormData();
        formData.append("access_key", import.meta.env.VITE_WEB_ACCESS_KEY);
        formData.append("name", `${authData?.firstname ?? ""} ${authData?.lastname ?? ""}`.trim() || "User");
        formData.append("email", authData?.email || "");
        formData.append("subject", "Feedback - Dubba Fund");
        formData.append("message", trimmedMessage);

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            alert("Email sent");
            setMessage("");
            onOpenChange(false);
            console.log(data);
        } else {
            alert("Error Occured");
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
                        <Button type="submit" form="feedback-form">Submit feedback</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default FeedbackBox