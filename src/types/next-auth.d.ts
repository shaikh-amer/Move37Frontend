import { UserRole } from "@/types/auth";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      role: UserRole;
      image?: string | null;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    username: string;
    accessToken: string;
  }
}
