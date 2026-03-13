import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: import("./src/lib/auth").UserRole;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: import("./src/lib/auth").UserRole;
    };
  }
}

