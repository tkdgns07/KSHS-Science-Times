import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      token: string;
    };
  }

  interface JWT extends DefaultJWT {
    id?: string; // Add custom properties here
  }
}
