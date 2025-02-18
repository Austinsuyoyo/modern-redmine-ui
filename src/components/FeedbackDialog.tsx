
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

export const FeedbackDialog = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
    contact: "",
    screenshot: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      // Reset form
      setFeedback({
        type: "",
        message: "",
        contact: "",
        screenshot: null,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold">Send Feedback</h2>

      <div className="space-y-2">
        <Label>Feedback Type</Label>
        <Select
          value={feedback.type}
          onValueChange={(value) => setFeedback({ ...feedback, type: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select feedback type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bug">Bug Report</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea
          placeholder="Please describe your feedback..."
          value={feedback.message}
          onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
          required
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Screenshot (optional)</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFeedback({ ...feedback, screenshot: e.target.files?.[0] || null })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Contact (optional)</Label>
        <Input
          type="email"
          placeholder="Your email address"
          value={feedback.contact}
          onChange={(e) => setFeedback({ ...feedback, contact: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
};
