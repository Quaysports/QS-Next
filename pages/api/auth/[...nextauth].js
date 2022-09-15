import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {login} from '../../../server-modules/users/user'

export default NextAuth({
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
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
    debug: process.env.NODE_ENV === 'development',
});