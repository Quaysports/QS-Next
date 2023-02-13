import {mockStore, renderWithProviders, screen} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import {setUserData} from "../../../store/session-slice";
import DashboardTabs from "../../../pages/dashboard/tabs";
import {User} from "../../../server-modules/users/user";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({acknowledged: true, deletedCount: 2}),
    })
) as jest.Mock;
jest.mock("next/router", () => ({
    useRouter: () => ({query: {tab:"home"}}),
}))

let user:User = {
    settings: {},
    sick: {paid: [], unpaid: []},
    theme: {},
    _id: "607ead6b6697cdb944005d0a",
    username: "Test User",
    pin: "0000",
    password: "password123",
    role: "admin",
    colour: "#0080ff",
    permissions: {
        users: {auth: true}
    },
    holiday: [],
    rota: "shop"
}

describe("Dashboard tabs tests", ()=>{

    beforeEach(()=> {
        mockStore.dispatch(setUserData(user))
    })

    test('Renders tabs and sets active correctly', async () => {
        console.log(mockStore.getState().session.user)
        renderWithProviders(<DashboardTabs/>)
        expect(screen.getByRole("link", {name: /Home/i}).parentNode).toHaveClass("active-tab")
        expect(await screen.findByTestId("user-tab")).toBeInTheDocument()
        expect(screen.getByTestId("user-tab")).not.toHaveClass("active-tab")
    })

    test('Renders tabs based on permissions', async () => {
        renderWithProviders(<DashboardTabs/>)
        expect(await screen.findByTestId("user-tab")).toBeInTheDocument()
        expect(screen.queryByTestId("orders-search-tab")).toBeFalsy()
    })

    const cases = [
        [0,"Home","/dashboard?tab=home"],
        [1,"Users","/dashboard?tab=user"],
        [2,"Rotas","/dashboard?tab=rotas&location=online"],
        [3,"Holidays","/dashboard?tab=holidays&type=holiday"]
    ] as const

    test.each(cases)("All tabs are rendered with links", async(index,text,link) => {
        let fullPermissionUser = {...user, permissions: {...user.permissions, holidays: {auth: true}, rotas: {auth: true}}}
        mockStore.dispatch(setUserData(fullPermissionUser))

        renderWithProviders(<DashboardTabs/>)
        const links = await screen.findAllByRole("link")as HTMLLinkElement[]

        expect(links[index].textContent).toStrictEqual(text)
        expect(links[index].href).toMatch(link)
    })
})