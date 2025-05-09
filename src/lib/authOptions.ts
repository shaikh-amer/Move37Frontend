import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { UserRole } from "@/types/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          return null;
        }

        try {
          // Make a request to your API to validate credentials
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                login: credentials.emailOrUsername,
                password: credentials.password,
              }),
            },
          );

          if (response.status === 403) {
            const data = await response.json();
            throw new Error("Your account is not verified" + data.email);
          }

          const data = await response.json();

          if (response.ok && data.token) {
            // We need to get user data using the token
            const userResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/auth/current-user`,
              {
                headers: {
                  Authorization: `Bearer ${data.token}`,
                },
              },
            );

            if (userResponse.ok) {
              const userData = await userResponse.json();
              return {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                username: userData.username,
                role: userData.role as UserRole,
                token: data.token,
              };
            }
            return null;
          } else {
            return null;
          }
        } catch (error) {
          if (error instanceof Error) {
            throw error; // Re-throw the error to be caught by NextAuth
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        // Store the auth token from your API
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.username = token.username as string;
        // Make the token available in the session
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
