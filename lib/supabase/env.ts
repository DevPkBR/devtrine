const requiredVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export function getSupabaseEnv() {
  const missing = requiredVariables.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      "Variáveis do Supabase ausentes: " +
        missing.join(", ") +
        ". Consulte .env.example.",
    );
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
  };
}
