import {render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import DashboardTabs from "../../../pages/dashboard/tabs";


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

test('renders tabs and sets active correctly', async () => {
    render(<DashboardTabs/>)

    expect(screen.getByRole("link",{name:/Home/i}).parentNode).toHaveClass("active-tab")
    console.log("boo")
    await waitFor(()=> expect(screen.queryByTestId("user-tab")).toBeTruthy() )
    expect(screen.getByTestId("user-tab")).not.toHaveClass("active-tab")
})

test('renders tabs based on permissions', async () => {
    render(<DashboardTabs/>)
    await waitFor(()=>expect(screen.queryByTestId("user-tab")).toBeTruthy())
    expect(screen.queryByTestId("orders-search-tab")).toBeFalsy()
})




afterAll(() => {
    jest.restoreAllMocks()
})

/*
jest.mock("next-auth/react");

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

test("renders tabs and sets home active", ()=>{

    const mockSession:Session = {
        user:{
            theme:{},
            role:"admin",
            username:"Geoff",
            permissions:{webpages: { auth: true, label: "Webpages" },
                stockTakeList: { auth: true, label: "Stock Take List" },
                stockTransfer: { auth: true, label: "Stock Transfer" },
                marginCalculator: { auth: true, label: "Margin Calculator" },
                shipments: { auth: true, label: "Shipments" },
                stockForecast: { auth: true, label: "Stock Forecast" },
                itemDatabase: { auth: true, label: "Item Database" },
                stockReports: { auth: true, label: "Incorrect Stock" },
                shopOrders: { auth: true, label: "Shop Orders" },
                shopTills: { auth: true, label: "Shop Tills" },
                users: { auth: true, label: "Users" },
                orderSearch: { auth: true, label: "Order Search" },
                priceUpdates: { auth: true, label: "Price Updates" },
                shop: { auth: true, label: "Shop" },
                baitOrdering: { auth: true, label: "Bait Orders" },
                online: { auth: true, label: "Online" },
                rotas: { auth: true, label: "Rotas" },
                holidays: { auth: true, label: "Holidays" }}
        },
        expires:""
    };

    (useSession as jest.Mock).mockReturnValueOnce([mockSession, 'authenticated']);


    const {container} = render(<DashboardTabs/>)

    expect(container).toMatchSnapshot()
})
 */