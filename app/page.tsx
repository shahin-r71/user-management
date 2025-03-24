import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/supabase/server";

export default async function Home() {
    const supabase = await createClient()
    const {data: { user },error} = await supabase.auth.getUser()

    if (!user || error) {
      redirect("/login");
    } else {
      redirect("/dashboard");
    }
}
