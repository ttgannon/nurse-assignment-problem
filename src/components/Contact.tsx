import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", inquiry: "" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleClose() {
    setSubmitted(false);
    setFormData({ name: "", email: "", inquiry: "" });
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Get in touch
        </h1>
        <p className="text-muted-foreground">
          Questions, feedback, or partnership inquiries — we'd love to hear from
          you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Jane Smith"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@hospital.org"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="inquiry">Your message</Label>
          <textarea
            id="inquiry"
            name="inquiry"
            rows={4}
            placeholder="Tell us about your unit or what you'd like to see..."
            value={formData.inquiry}
            onChange={handleChange}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
        </div>

        <Button type="submit" className="w-full">
          Send message
        </Button>
      </form>

      <Dialog open={submitted} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message received</DialogTitle>
            <DialogDescription>
              Thanks for reaching out, {formData.name || "there"}! We'll get back
              to you at {formData.email || "your email"} shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
