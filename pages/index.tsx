import {getSession} from "next-auth/react";

export default function Home() {return null};

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if(session) {
        console.log(session)
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            }
        }
    } else {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }
}