import {User} from "../server-modules/users/user";

declare module "next-auth" {
    interface Session {
        user: User
        expires: string
    }
}