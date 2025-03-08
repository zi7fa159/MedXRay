import { redirect } from "next/navigation";

export default function AuthRedirect() {
  // Redirect to home page
  redirect("/");
}
