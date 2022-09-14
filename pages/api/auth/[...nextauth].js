import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {login} from '../../../server-modules/users/user'

export default NextAuth({
    providers: [
        CredentialsProvider({
            id: 'credentials',
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: 'username',
                    type: 'username',
                    placeholder: 'default',
                },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const user = await login(credentials.username, credentials.password)
                if (!user.auth) {
                    throw new Error(user.exception);
                } else {
                    return user;
                }
            },
        })
    ],
    secret: process.env.JWT_SECRET,
    page:{
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                return {
                    ...token,
                    username:user.username,
                    permissions:user.permissions,
                    role:user.role,
                    rota:user.rota,
                    theme:user.theme,
                    accessToken: user.token,
                    refreshToken: user.refreshToken,
                };
            }

            return token;
        },

        async session({ session, token }) {
            session.user.username = token.username;
            session.user.permissions = token.permissions;
            session.user.role = token.role;
            session.user.rota = token.rota;
            session.user.theme = token.theme;
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.accessTokenExpires = token.accessTokenExpires;

            return session;
        },

    },
    theme: {
        colorScheme: 'light', // "auto" | "dark" | "light"
        brandColor: '#FFFFFF', // Hex color code #33FF5D
        logo: '/logo.png', // Absolute URL to image
    },
    debug: process.env.NODE_ENV === 'development',
});