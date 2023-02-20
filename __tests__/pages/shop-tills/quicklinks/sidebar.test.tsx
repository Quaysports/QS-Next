import {renderWithProviders, screen, waitFor} from "../../../../__mocks__/mock-store-wrapper";
import QuickLinksSidebar from "../../../../pages/shop-tills/quick-links/sidebar";
import {GetServerSidePropsContext} from "next";
import {getServerSideProps} from "../../../../pages/shop-tills";
import {NextRouter} from "next/router";
import {mockGetQuickLinks, mockItem} from "../../../../__mocks__/quicklinks.mocks";
import '@testing-library/jest-dom'

global.fetch = jest.fn(async () => {
    return {json: async () => ([mockItem])}
}) as jest.Mock;

jest.mock("../../../../server-modules/shop/shop", () => ({
    getQuickLinks: () => mockGetQuickLinks()
}))

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
describe("Quick Links Sidebar test", () => {

    beforeEach(async () => {
        jest.clearAllMocks()
        query = {tab: "quick-links", linksIndex: 0}
        await waitFor(async() => {
            renderWithProviders(<QuickLinksSidebar/>)
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })
    })

    test("Page initially loads with sidebar.", async () => {
        expect((await screen.findAllByRole("button")).length).toEqual(2)
    })

    test("Dynamic sidebar link button changes route and edit button triggers popup.", async () => {
        const divButtons = await screen.findAllByRole("button")

        await waitFor(() => (divButtons[0].childNodes[1] as HTMLDivElement).click())
        expect(routeValue).toHaveBeenCalledWith({pathname: undefined, query: {tab: 'quick-links', linksIndex: 0}})

        await waitFor(() => (divButtons[0].childNodes[0] as HTMLDivElement).click())
        expect(await screen.findByText("New QuickLink Menu")).toBeInTheDocument()
    })

    test("Edit link popup menu correctly loads with existing id ready for editing.", async () => {
        const divButtons = await screen.findAllByRole("button")

        await waitFor(() => (divButtons[0].childNodes[0] as HTMLDivElement).click())

        expect(await screen.findByRole("textbox")).toHaveValue('test 2')
    })

    test("Edit update button correctly dispatches to redux store.", async () => {

        const divButtons = await screen.findAllByRole("button")

        await waitFor(() => (divButtons[0].childNodes[0] as HTMLDivElement).click())
        const input = await screen.findByRole("textbox") as HTMLInputElement
        input.value = "New Title"

        await waitFor(() => screen.getByRole("button", {name: "Update"}).click())

        expect(await screen.findByText("New Title")).toBeInTheDocument()
    })

    test("Edit delete button correctly dispatches to redux store.", async () => {

        const divButtons = await screen.findAllByRole("button")

        await waitFor(() => (divButtons[0].childNodes[0] as HTMLDivElement).click())
        await waitFor(() => screen.getByRole("button", {name: "Delete"}).click())

        expect(await screen.queryByText("test 2")).toBeNull()
    })
})