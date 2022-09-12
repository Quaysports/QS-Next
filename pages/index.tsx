export default function Home() {return null};

export async function getStaticProps(context) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            }
        }
}
