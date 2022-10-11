import {render, waitFor} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import Dashboard, {getServerSideProps} from "../../../pages/dashboard";
import {GetServerSidePropsContext} from "next";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({acknowledged: true, deletedCount: 2}),
    })
) as jest.Mock;


jest.mock("next/router", () => ({
    useRouter: () => ({query: {tab:"home"}}),
}));

jest.mock("../../../server-modules/users/user",()=>({
    getUsers: () =>  mockGetUser()
}))

jest.mock('next-auth/react', () => ({
    async getSession() {
        return {
            user: {
                theme: {},
                role: "admin",
                username: "Geoff",
                permissions: {
                    users: {auth: true, label: "Users"}
                }
            },
            expires: ""
        }
    },
}));

const mockGetUser = jest.fn()

test("Dashboard users is correctly called", async () => {
    await waitFor (()=> render(<Dashboard/>))
    const context = {query:{tab:"user"}} as unknown as GetServerSidePropsContext
    await getServerSideProps(context)
    expect(mockGetUser).toBeCalledTimes(1)
})