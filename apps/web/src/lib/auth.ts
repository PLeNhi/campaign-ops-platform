import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";

type AppUser = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  accessToken?: string;
};

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL or API_URL must be set");
  }
  return url.replace(/\/$/, "");
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const baseUrl = getApiUrl();
        const res = await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        if (!res.ok) {
          return null;
        }

        const data = (await res.json()) as {
          access_token: string;
          user: { id: string; email: string; role: string };
        };

        const user: AppUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email.split("@")[0],
          role: data.user.role as UserRole,
          accessToken: data.access_token
        };

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as AppUser).id;
        token.role = (user as AppUser).role;
        token.accessToken = (user as AppUser).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
