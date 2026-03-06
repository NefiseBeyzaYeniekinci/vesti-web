import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                // Here we would typically call our API Gateway's auth-service
                // For now, we return a mock user or null based on logic.
                // Example mock return
                if (credentials.email === "admin@vesti.com") {
                    return { id: "1", name: "Admin", email: "admin@vesti.com", role: "admin" }
                }
                if (credentials.email === "user@vesti.com") {
                    return { id: "2", name: "User", email: "user@vesti.com", role: "user" }
                }
                return null; // login failed
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: { strategy: "jwt" },
});
