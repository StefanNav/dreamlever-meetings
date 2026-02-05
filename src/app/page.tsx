import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to meetings page as the main landing page for now
  // Other pages (Home, Objectives, People) are not yet built
  redirect("/meetings");
}
