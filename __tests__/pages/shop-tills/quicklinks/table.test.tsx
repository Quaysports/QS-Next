import {fireEvent, renderWithProviders, screen, waitFor} from "../../../../__mocks__/mock-store-wrapper";
import QuickLinksTable from "../../../../pages/shop-tills/quick-links/table";
import {GetServerSidePropsContext} from "next";
import {getServerSideProps} from "../../../../pages/shop-tills";
import {mockGetQuickLinks, mockItem} from "../../../../__mocks__/quicklinks.mocks";
import '@testing-library/jest-dom'

global.fetch = jest.fn(async () => {
    return {json: async () => ([mockItem])}
}) as jest.Mock;

// @ts-ignore
delete global.window.location;
global.window.location = { reload: jest.fn() as any } as Location;
//jest.spyOn(global.window.location, "reload")
jest.mock("../../../../server-modules/shop/shop", () => ({
    getQuickLinks: () => mockGetQuickLinks()
}))

jest.mock("next/router", () => ({
    useRouter: () => ({query: {tab: "quick-links", linksIndex: 0}})
}));
describe("Quick Links tests", () => {

    beforeEach(async () => {
        jest.clearAllMocks()
        const query = {tab: "quick-links", linksIndex: 0}
        await waitFor(async() => {
            renderWithProviders(<QuickLinksTable/>)
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })
    })

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