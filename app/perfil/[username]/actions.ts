"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function toggleFollow(formData: FormData) {
  const profileId = String(formData.get("profileId") ?? "");
  const username = String(formData.get("username") ?? "");
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(`/login?next=/perfil/${encodeURIComponent(username)}`);
  if (!profileId || profileId === data.user.id) return;

  const { data: existing } = await supabase.from("follows").select("follower_id").eq("follower_id", data.user.id).eq("following_id", profileId).maybeSingle();
  if (existing) await supabase.from("follows").delete().eq("follower_id", data.user.id).eq("following_id", profileId);
  else await supabase.from("follows").insert({ follower_id: data.user.id, following_id: profileId });
  revalidatePath(`/perfil/${username}`);
}
