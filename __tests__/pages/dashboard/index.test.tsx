import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Dashboard from "../../../pages/dashboard";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {tab:"home"},
            asPath: "",
        };
    },
}));

const getServerSideProps = jest.fn()

test('renders tabs based active tab', async () => {
    render(<Dashboard/>)
    screen.debug()
})