import {fireEvent, render, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import ShopTills, {getServerSideProps} from "../../../pages/shop-tills";
import {GetServerSidePropsContext} from "next";
import {NextRouter} from "next/router";

afterEach(() => jest.clearAllMocks())

global.fetch = jest.fn(async () => {
    return {json: async () => ([{_id: "000", SKU: "HVSB", TITLE: "Test HVSB"}])}
}) as jest.Mock;

let query = {}
const routeValue = jest.fn()
jest.mock("next/router", () => ({
    useRouter: () => ({
        query: query,
        push: (req: NextRouter) => {
            routeValue(req)
        }
    })
}));

const mockGetQuickLinks = jest.fn(() => quickLinks)
jest.mock("../../../server-modules/shop/shop", () => ({
    getQuickLinks: () => mockGetQuickLinks()
}))

const quickLinks = [
    {
        _id: '633d87d50d9d1a14a0aad5c9',
        id: 'test 2',
        links: [
            {
                SKU: 'ESP-CFEFHG002',
                SHOPPRICEINCVAT: "54.95",
                TITLE: 'ESP Fleece Hoody Olive Green - Large',
                COLOUR: '#ffffff',
            },
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {
                SKU: 'SHM-SN2500FG',
                SHOPPRICEINCVAT: "29.99",
                TITLE: 'SHIMANO Sienna 2500 FG Spinning Reel',
                COLOUR: '#d41616',
            },
            {SKU: ''},
            {SKU: ''},
            {
                SKU: 'NET11MHP40RWHSBSRRCAT',
                SHOPPRICEINCVAT: "40.99",
                TITLE: "11' Rod, HP40R Reel, R201 Net, Wagglers, Shot, Hooks, Bank stick, RRH, Catapult",
            },
            {
                SKU: 'SB',
                SHOPPRICEINCVAT: '19.99',
                TITLE: 'Tackle Box, Seat Box, Strap, Pad #',
            },
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {SKU: ''},
            {SKU: ''}
        ]
    }
]

describe("Shop tills serverside props tests", () => {
    test("GetQuicklinks is called if route contains ?tab=quick-links", async () => {
        render(<ShopTills/>)
        const context = {query: {tab: "quick-links"}} as unknown as GetServerSidePropsContext
        await getServerSideProps(context)
        expect(mockGetQuickLinks).toBeCalledTimes(1)
    })
})

describe("Quick Links tests", () => {

    beforeEach(async () => {
        query = {tab: "quick-links", linksIndex: 0}
        await waitFor(async() => {
            render(<ShopTills/>)
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })
    })

    test("Page initially loads with sidebar.", async () => {
        expect((await screen.findAllByTestId("sidebar-button")).length).toEqual(2)
    })

    test("Dynamic sidebar link button changes route and edit button triggers popup.", async () => {
        const divButtons = await screen.findAllByTestId("sidebar-button")

        await waitFor(() => (divButtons[0].childNodes[1] as HTMLDivElement).click())
        expect(routeValue).toHaveBeenCalledWith({pathname: undefined, query: {tab: 'quick-links', linksIndex: 0}})

        await waitFor(() => (divButtons[0].childNodes[0] as HTMLDivElement).click())
        expect(await screen.findByText("New QuickLink Menu")).toBeInTheDocument()
    })

    test("Edit link popup menu correctly loads with existing id ready for editing.", async () => {
        const divButtons = await screen.findAllByTestId("sidebar-button")

        await waitFor(() => (divButtons[0].childNodes[0] as HTMLDivElement).click())

        expect(await screen.findByRole("textbox")).toHaveValue('test 2')
    })

    test("Edit update button correctly dispatches to redux store.", async () => {

        const divButtons = await screen.findAllByTestId("sidebar-button")

        await waitFor(() => (divButtons[0].childNodes[0] as HTMLDivElement).click())
        const input = await screen.findByRole("textbox") as HTMLInputElement
        input.value = "New Title"

        await waitFor(() => screen.getByRole("button", {name: "Update"}).click())

        expect(await screen.findByText("New Title")).toBeInTheDocument()
    })

    test("Edit delete button correctly dispatches to redux store.", async () => {

        const divButtons = await screen.findAllByTestId("sidebar-button")

        await waitFor(() => (divButtons[0].childNodes[0] as HTMLDivElement).click())
        await waitFor(() => screen.getByRole("button", {name: "Delete"}).click())

        expect(await screen.queryByText("test 2")).toBeNull()
    })

//Quicklink table testing

    test("Quicklink table renders properly when listIndex is in route.", async () => {

        const table = await screen.findByTestId("quicklinks-table")

        expect(table.childNodes[0]).toHaveTextContent("ESP-CFEFHG002")
        expect(table.childNodes[8]).toHaveTextContent("SHM-SN2500FG")
        expect(table.childNodes[11]).toHaveTextContent("NET11MHP40RWHSBSRRCAT")
        expect(table.childNodes[11]).toHaveTextContent("SB")
        expect(table.childNodes[20]).toBeFalsy()
    })

    test("Quicklink table add buttons calls search popup and changes on return search data.", async () => {

        const table = await screen.findByTestId("quicklinks-table")

        await waitFor(() => (table.childNodes[1] as HTMLDivElement).click())

        await waitFor(async () => {
            const input = await screen.findByTestId("search-input") as HTMLInputElement
            input.defaultValue = "HVSB"
            await waitFor(() => fireEvent.change(input))
        })

        expect(await screen.findByText("HVSB")).toBeInTheDocument()
        let divBtn = screen.getByText("HVSB").parentNode as HTMLDivElement

        await waitFor(() => divBtn.click())
        expect(table.childNodes[1].childNodes[2]).toHaveTextContent("Test HVSB")
    })

    test("Quicklink table items change background colour on colour select.", async () => {
        const parent = (await screen.findByTestId("quicklinks-table")).childNodes[0];
        const input = parent.childNodes[3].childNodes[0] as HTMLInputElement

        input.value = "#000000"

        await waitFor(() => fireEvent.blur(input))
        await waitFor(() => expect(parent).toHaveAttribute("style", "background: rgb(0, 0, 0);"))
    })

    test("Quicklink table delete button removes item.", async () => {
        const parent = (await screen.findByTestId("quicklinks-table")).childNodes[0];
        const deleteBtn = parent.childNodes[3].childNodes[1] as HTMLInputElement

        await waitFor(() => deleteBtn.click())
        const yesBtn = await screen.findByRole("button", {name: "Yes"})

        await waitFor(() => yesBtn.click())
        expect(screen.queryByText("ESP-CFEFHG002")).toBeFalsy()

    })
})