import {render, waitFor, screen} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import Dashboard, {getServerSideProps} from "../../../pages/dashboard";
import {GetServerSidePropsContext} from "next";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({acknowledged: true, deletedCount: 2}),
    })
) as jest.Mock;

let query = {}
jest.mock("next/router", () => ({
    useRouter: () => ({query: query}),
}))

const mockGetUser = jest.fn(()=>[{
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
    holiday: "",
    rota: "shop"
}])
jest.mock("../../../server-modules/users/user",()=>({getUsers: () =>  mockGetUser()}))

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

let permissions = {users: {auth: true, label: "Users"}}

jest.mock('next-auth/react', () => ({
    async getSession() {
        return {
            user: {
                theme: {},
                role: "admin",
                username: "Geoff",
                permissions: permissions
            },
            expires: ""
        }
    },
}));

afterEach(()=>{
    jest.clearAllMocks()
})

describe("Dashboard landing page tests",()=>{
    test("User info gets called and loaded into slice", async () => {
        await waitFor(() => render(<Dashboard/>))
        const context = {query: {tab: "user"}} as unknown as GetServerSidePropsContext
        await getServerSideProps(context)
        expect(mockGetUser).toBeCalledTimes(1)
    })
})

describe("Dashboard tabs tests", ()=>{

    beforeEach(async()=>{
        query = {tab:"home"}
        await waitFor(async () => {
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })
    })

    test('Renders tabs and sets active correctly', async () => {
        render(<Dashboard/>)
        expect(screen.getByRole("link", {name: /Home/i}).parentNode).toHaveClass("active-tab")
        expect(await screen.findByTestId("user-tab")).toBeInTheDocument()
        expect(screen.getByTestId("user-tab")).not.toHaveClass("active-tab")
    })

    test('Renders tabs based on permissions', async () => {
        render(<Dashboard/>)
        expect(await screen.findByTestId("user-tab")).toBeInTheDocument()
        expect(screen.queryByTestId("orders-search-tab")).toBeFalsy()
    })

    test("All tabs are rendered with links", async() => {
        permissions = fullPermissions

        render(<Dashboard/>)
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
})

describe("User table tests",()=>{

    beforeEach(async()=>{
        query = {tab:"user"}
        render(<Dashboard/>)
        await waitFor(async () => {
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })
    })

    test("User table loads if data is present in slice.", async () => {
        expect(await screen.findByRole("button", {name: "Add User"})).toBeInTheDocument()
    })

    test("User table fields render correct information based on slice data.", async()=>{
        const row = await screen.findByTestId("user-table-row")

        //Close button
        expect(row.childNodes[0]).toContainHTML("<button>X</button>")

        //Permissions button
        expect(row.childNodes[1]).toContainHTML("<button>Permissions</button>")

        //Username
        expect(row.childNodes[2].childNodes[0]).toHaveValue("Test User")

        //User auth select
        expect(row.childNodes[3].childNodes[0]).toHaveValue("admin")
        expect(row.childNodes[3].childNodes[0].childNodes[0]).toHaveTextContent("admin")
        expect(row.childNodes[3].childNodes[0].childNodes[1]).toHaveTextContent("senior")
        expect(row.childNodes[3].childNodes[0].childNodes[2]).toHaveTextContent("user")

        //User department select
        expect(row.childNodes[4].childNodes[0]).toHaveValue("shop")

        //User holiday allowance
        expect(row.childNodes[5].childNodes[0]).toHaveValue(null)

        //User password
        expect(row.childNodes[6].childNodes[0]).toHaveValue("password123")

        //User pin
        expect(row.childNodes[7].childNodes[0]).toHaveValue("0000")

        //User colour
        expect(row.childNodes[8].childNodes[0]).toHaveValue("#0080ff")
    })

    test("X button removes user from table.", async () => {
        await waitFor(()=>screen.getByRole("button",{name:"X"}).click())
        await waitFor(()=>screen.getByRole("button",{name:"Yes"}).click())
        await waitFor(()=>expect(screen.queryByTestId("user-table-row")).toBeNull())
    })

    test("Permissions button calls popup", async () => {
        await waitFor(()=>screen.getByRole("button",{name:"Permissions"}).click())
        expect(await screen.findByText("User Permissions")).toBeInTheDocument()
    })

    test("Permissions popup renders user data correctly", async () => {
        await waitFor(()=>screen.getByRole("button",{name:"Permissions"}).click())
        const checkBoxes = await screen.findAllByRole("checkbox")
        expect(checkBoxes[0]).toBeChecked()
        expect(checkBoxes[1]).not.toBeChecked()
        expect(checkBoxes[2]).not.toBeChecked()
    })
})