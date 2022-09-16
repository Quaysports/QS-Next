import NextAuth from "next-auth"
import {user} from "../server-modules/users/user";

declare module "next-auth" {
    interface Session {
        user: user
        expires: string
    }
}