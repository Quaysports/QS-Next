import {render, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import QuickLinksSidebar from "../../../pages/shop-tills/quick-links/sidebar";
import QuickLinksTable from "../../../pages/shop-tills/quick-links/table";
import {quickLinksState} from "../../../store/shop-tills/quicklinks-slice";
import {NextRouter} from "next/router";
import EditQuickLinkMenuPopup from "../../../pages/shop-tills/quick-links/edit-quicklink-menu-popup";
import * as redux from "react-redux";

afterEach(()=>jest.clearAllMocks())

jest.mock('react-redux', () => {
    return {
        __esModule: true,
        ...jest.requireActual('react-redux')
    };
});
const spy = jest.spyOn(redux, "useDispatch")
const mockFn = jest.fn()

const routeValue = jest.fn()
jest.mock("next/router", () => ({
    useRouter: () => ({
        query: {tab:"quick-links", linksIndex:0},
        push:(req:NextRouter)=>{routeValue(req)}
    }),
}));

const mockPopup = jest.fn()
jest.mock("../../../server-modules/dispatch-notification", () => ({
    dispatchNotification: (info: any) => {
        if(info.type === "popup") mockPopup()
    }
}))

const quickLinks:quickLinksState = {quickLinksArray:[
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
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            {
                SKU: 'SHM-SN2500FG',
                SHOPPRICEINCVAT: "29.99",
                TITLE: 'SHIMANO Sienna 2500 FG Spinning Reel',
                COLOUR: '#d41616',
            },
            { SKU: '' },
            { SKU: '' },
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
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            { SKU: '' },
            { SKU: '' }
        ]
    }
]}

//Sidebar testing

test("Page initially loads with sidebar.", async ()=>{
    render(<QuickLinksSidebar/>, {preloadedState:{"quickLinks":quickLinks}})
    expect((await screen.findAllByTestId("sidebar-button")).length).toEqual(2)
})

test("Dynamic sidebar link button changes route and edit button triggers popup.", async ()=>{
    render(<QuickLinksSidebar/>, {preloadedState:{"quickLinks":quickLinks}})
    const divButtons = await screen.findAllByTestId("sidebar-button")
    const editButton = divButtons[0].childNodes[0] as HTMLDivElement
    const linkButton = divButtons[0].childNodes[1] as HTMLDivElement
    await waitFor(()=>linkButton.click())
    expect(routeValue).toHaveBeenCalledWith({ pathname: undefined, query: { tab: 'quick-links', linksIndex: 0 } })

    await waitFor(()=>editButton.click())
    expect(mockPopup).toHaveBeenCalledTimes(1)
})

test("Edit link popup menu correctly loads with existing id ready for editing.", async () => {
    render(<EditQuickLinkMenuPopup/>, {preloadedState: {"quickLinks": quickLinks}})
    expect(await screen.findByRole("textbox")).toHaveValue('test 2')
})

test("Edit update button correctly dispatches to redux store.", async () => {
    render(<EditQuickLinkMenuPopup/>, {preloadedState: {"quickLinks": quickLinks}})
    spy.mockReturnValue(mockFn)

    await waitFor(() => screen.getByRole("button", {name: "Update"}).click())
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith({"payload": {"data": "test 2", "linksIndex": 0}, "type": "quickLinks/updateQuickLinkID"})
})

test("Edit delete button correctly dispatches to redux store.", async () => {
    render(<EditQuickLinkMenuPopup/>, {preloadedState: {"quickLinks": quickLinks}})
    spy.mockReturnValue(mockFn)

    await waitFor(() => screen.getByRole("button", {name: "Delete"}).click())
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith({"payload": 0, "type": "quickLinks/deleteQuickLink"})
})

//Quicklink table testing

test("Quicklink table renders properly when listIndex is in route.", async () => {
    render(<QuickLinksTable/>, {preloadedState: {"quickLinks": quickLinks}})
    const table = await screen.findByTestId("quicklinks-table")

    expect(table.childNodes[0]).toHaveTextContent("ESP-CFEFHG002")
    expect(table.childNodes[8]).toHaveTextContent("SHM-SN2500FG")
    expect(table.childNodes[11]).toHaveTextContent("NET11MHP40RWHSBSRRCAT")
    expect(table.childNodes[11]).toHaveTextContent("SB")
    expect(table.childNodes[20]).toBeFalsy()
})

test("Quicklink table add buttons call search and change on return search data.", async () => {
    render(<QuickLinksTable/>, {preloadedState: {"quickLinks": quickLinks}})
    const table = await screen.findByTestId("quicklinks-table")
    await waitFor(()=> table.childNodes[1].click())
})