import {render, screen} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import DashboardTabs from "../../../pages/dashboard/tabs";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {tab: "home"},
            asPath: "",
        };
    },
}));

let permissions = {users: {auth: true, label: "Users"}}

let fullPermissions = {
    "users": {"auth": true, "label": "Users"},
    "orderSearch": {"auth": true},
    "priceUpdates": {"auth": true},
    "shop": {"auth": true, "label": "Shop"},
    "online": {"auth": true, "label": "Online"},
    "rotas": {"auth": true, "label": "Rotas"},
    "newRota": {"auth": true, "label": "New Rota"},
    "holidays": {"auth": true, "label": "Holidays"},
    "baitOrdering": {"auth": true, "label": "Bait Orders"},
    "shopOrders": {"auth": true},
    "incorrectStock": {"auth": true},
    "itemDatabase": {"auth": true},
    "shipments": {"auth": true},
    "stockForecast": {"auth": true},
    "marginCalculator": {"auth": true},
    "stockTransfer": {"auth": true},
    "stockTakeList": {"auth": true},
    "webpages": {"auth": true},
    "shopTills": {"auth": true},
    "stockReports": {"auth": true}
}

const mockPermissions = jest.fn()

jest.mock('next-auth/react', () => ({
    async getSession() {
        return {
            user: {
                theme: {},
                role: "admin",
                username: "Geoff",
                permissions: mockPermissions
            },
            expires: ""
        }
    },
}));

test('Renders tabs and sets active correctly', async () => {
    render(<DashboardTabs/>)
    mockPermissions.mockImplementation(()=>permissions)

    expect(screen.getByRole("link", {name: /Home/i}).parentNode).toHaveClass("active-tab")

    expect(await screen.findByTestId("user-tab")).toBeInTheDocument()
    expect(screen.getByTestId("user-tab")).not.toHaveClass("active-tab")
})

test('Renders tabs based on permissions', async () => {
    render(<DashboardTabs/>)
    mockPermissions.mockImplementation(()=>permissions)

    expect(await screen.findByTestId("user-tab")).toBeInTheDocument()
    expect(screen.queryByTestId("orders-search-tab")).toBeFalsy()
})

test("All tabs are rendered with links", async() => {
    render(<DashboardTabs/>)
    mockPermissions.mockImplementation(()=>fullPermissions)

    expect(await screen.findByText("Order Search")).toBeInTheDocument()
    const links = await screen.findAllByRole("link")as HTMLLinkElement[]

    expect(links[0].textContent).toStrictEqual("Home")
    expect(links[0].href).toMatch("/dashboard?tab=home")
    expect(links[1].textContent).toStrictEqual("Users")
    expect(links[1].href).toMatch("/dashboard?tab=user")
    expect(links[2].textContent).toStrictEqual("Order Search")
    expect(links[2].href).toMatch("/dashboard?tab=order-search")
    expect(links[3].textContent).toStrictEqual("Price Updates")
    expect(links[3].href).toMatch("/dashboard?tab=price-updates")
    expect(links[4].textContent).toStrictEqual("Shop")
    expect(links[4].href).toMatch("/dashboard?tab=shop")
    expect(links[5].textContent).toStrictEqual("Online")
    expect(links[5].href).toMatch("/dashboard?tab=online")
    expect(links[6].textContent).toStrictEqual("Rotas")
    expect(links[6].href).toMatch("/dashboard?tab=rotas")
    expect(links[7].textContent).toStrictEqual("Holidays")
    expect(links[7].href).toMatch("/dashboard?tab=holidays")
})