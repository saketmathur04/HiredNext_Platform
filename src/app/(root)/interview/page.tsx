import { redirect } from "next/navigation";

import InterviewForm from "@/components/InterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

// ─── Interview Generation Page ───────────────────────────────────────
// This page lets users configure and generate a personalized interview.
// After filling out the form, AI generates tailored interview questions
// which are saved to Firestore. The user can then take the interview
// from their dashboard.

const InterviewPage = async () => {
  const user = await getCurrentUser();

  // Redirect unauthenticated users to sign-in
  if (!user) redirect("/sign-in");

  return (
    <>
      <h3>Interview Generation</h3>
      <InterviewForm userId={user.id} />
    </>
  );
};

export default InterviewPage;
