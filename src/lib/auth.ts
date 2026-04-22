import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { getSupabaseService } from "./supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user repo",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile) return false;

      const supabase = getSupabaseService();
      const githubId = account.providerAccountId;
      // @ts-ignore - profile contains login/avatar_url
      const username = profile.login || profile.name;
      const avatar_url = profile.image || (profile as any).avatar_url;
      const email = user.email;

      try {
        // Upsert user into Supabase to sync data
        const { error } = await supabase.from("users").upsert(
          {
            github_id: githubId,
            username,
            email,
            avatar_url,
          },
          { onConflict: "github_id" }
        );

        if (error) {
          console.error("Error syncing user to Supabase:", error);
          return false;
        }

        return true;
      } catch (err) {
        console.error("Fatal error in signIn callback:", err);
        return false;
      }
    },
    async jwt({ token, account, user, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.username = (profile as any).login;
      }
      if (user) {
        // Add Supabase user ID to token
        const supabase = getSupabaseService();
        const { data } = await supabase
          .from("users")
          .select("id, role")
          .eq("github_id", token.sub)
          .single();
        
        if (data) {
          token.userId = data.id;
          token.role = data.role;
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.user.id = token.userId;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home for custom CTA login
  },
  secret: process.env.NEXTAUTH_SECRET,
};
