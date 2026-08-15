"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller } from "react-hook-form";

// ─── Validation Schema ──────────────────────────────────────────────
// Defines the shape and rules for the interview generation form.
const interviewFormSchema = z.object({
  role: z.string().min(2, "Job role must be at least 2 characters"),
  level: z.string().min(1, "Please select an experience level"),
  type: z.string().min(1, "Please select an interview type"),
  techstack: z.string().min(2, "Please enter at least one technology"),
  amount: z.string().min(1, "Please select number of questions"),
});

type InterviewFormValues = z.infer<typeof interviewFormSchema>;

// ─── Component ───────────────────────────────────────────────────────
// InterviewForm collects interview parameters from the user and
// sends them to the /api/vapi/generate endpoint to create a
// personalized interview with AI-generated questions.

interface InterviewFormProps {
  userId: string;
}

const InterviewForm = ({ userId }: InterviewFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      role: "",
      level: "",
      type: "",
      techstack: "",
      amount: "5",
    },
  });

  // ─── Submit Handler ──────────────────────────────────────────────
  // Calls the backend API to generate interview questions using
  // Google Gemini, then saves the interview to Firestore.
  async function onSubmit(values: InterviewFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: values.role,
          level: values.level,
          type: values.type,
          techstack: values.techstack,
          amount: parseInt(values.amount),
          userid: userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Interview generated successfully!");
        router.push("/");
      } else {
        toast.error("Failed to generate interview. Please try again.");
      }
    } catch (error) {
      console.error("Error generating interview:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <h3>Configure Your Interview</h3>
        <p className="text-lg">
          Fill in the details below, and our AI will generate a personalized
          interview tailored to your preferences.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {/* Job Role - text input */}
            <FormField
              control={form.control}
              name="role"
              label="Job Role"
              placeholder="e.g. Frontend Developer, Data Analyst"
            />

            {/* Experience Level - dropdown */}
            <Controller
              name="level"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label">Experience Level</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="input w-full">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior">Junior (0-2 years)</SelectItem>
                        <SelectItem value="Mid-level">Mid-level (2-5 years)</SelectItem>
                        <SelectItem value="Senior">Senior (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interview Type - dropdown */}
            <Controller
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label">Interview Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="input w-full">
                        <SelectValue placeholder="Select interview type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Behavioral">Behavioral</SelectItem>
                        <SelectItem value="Mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tech Stack - text input */}
            <FormField
              control={form.control}
              name="techstack"
              label="Tech Stack"
              placeholder="e.g. React, Node.js, Python, SQL"
            />

            {/* Number of Questions - dropdown */}
            <Controller
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label">Number of Questions</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="input w-full">
                        <SelectValue placeholder="Select number of questions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                        <SelectItem value="20">20 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button className="btn" type="submit" disabled={isLoading}>
              {isLoading ? "Generating Interview..." : "Generate Interview"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InterviewForm;
