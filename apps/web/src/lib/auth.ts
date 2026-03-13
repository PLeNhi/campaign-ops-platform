import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";

type AppUser = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
};

function verifyEnv() {
  const { NEXTAUTH_ADMIN_EMAIL, NEXTAUTH_ADMIN_PASSWORD, NEXTAUTH_SECRET } =
    process.env;

  if (!NEXTAUTH_ADMIN_EMAIL || !NEXTAUTH_ADMIN_PASSWORD || !NEXTAUTH_SECRET) {
    throw new Error(
      "NEXTAUTH_ADMIN_EMAIL, NEXTAUTH_ADMIN_PASSWORD and NEXTAUTH_SECRET must be set"
    );
  }
}

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
        verifyEnv();

        const adminEmail = process.env.NEXTAUTH_ADMIN_EMAIL as string;
        const adminPassword = process.env.NEXTAUTH_ADMIN_PASSWORD as string;

        if (
          !credentials?.email ||
          !credentials?.password ||
          credentials.email !== adminEmail ||
          credentials.password !== adminPassword
        ) {
          return null;
        }

        const user: AppUser = {
          id: "admin-1",
          email: adminEmail,
          name: "Admin",
          role: "ADMIN"
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};

export const { handlers: authHandlers } = NextAuth(authOptions);

