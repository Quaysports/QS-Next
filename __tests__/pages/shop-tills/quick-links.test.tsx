import {render, screen, waitFor, fireEvent} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import QuickLinksSidebar from "../../../pages/shop-tills/quick-links/sidebar";
import QuickLinksTable from "../../../pages/shop-tills/quick-links/table";
import {quickLinksState} from "../../../store/shop-tills/quicklinks-slice";
import {NextRouter} from "next/router";

afterEach(()=>jest.clearAllMocks())

global.fetch = jest.fn(async(req) => {
    console.log(req)
    return {json:async()=> ([{_id:"000", SKU:"HVSB", TITLE:"Test HVSB" }])}
}) as jest.Mock;

jest.mock('react-redux', () => {
    return {
        __esModule: true,
        ...jest.requireActual('react-redux')
    };
});

const routeValue = jest.fn()
jest.mock("next/router", () => ({
    useRouter: () => ({
        query: {tab:"quick-links", linksIndex:0},
        push:(req:NextRouter)=>{routeValue(req)}
    }),
}));

/*const mockPopup = jest.fn()
jest.mock("../../../server-modules/dispatch-notification", () => ({
    dispatchNotification: (info: any) => {
        if(info.type === "popup"){
            info.fn({SKU: "Test Item", TITLE: "Test Title", _id: "0"})
            //mockPopup({type:info.type, title:info.title})
        }
    }
}))*/

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

    await waitFor(()=>(divButtons[0].childNodes[1] as HTMLDivElement).click())
    expect(routeValue).toHaveBeenCalledWith({ pathname: undefined, query: { tab: 'quick-links', linksIndex: 0 } })

    await waitFor(()=>(divButtons[0].childNodes[0] as HTMLDivElement).click())
    expect(await screen.findByText("New QuickLink Menu")).toBeInTheDocument()
})

test("Edit link popup menu correctly loads with existing id ready for editing.", async () => {
    render(<QuickLinksSidebar/>, {preloadedState:{"quickLinks":quickLinks}})
    const divButtons = await screen.findAllByTestId("sidebar-button")

    await waitFor(()=>(divButtons[0].childNodes[0] as HTMLDivElement).click())

    expect(await screen.findByRole("textbox")).toHaveValue('test 2')
})

test("Edit update button correctly dispatches to redux store.", async () => {

    render(<QuickLinksSidebar/>, {preloadedState:{"quickLinks":quickLinks}})
    const divButtons = await screen.findAllByTestId("sidebar-button")

    await waitFor(()=>(divButtons[0].childNodes[0] as HTMLDivElement).click())
    const input = await screen.findByRole("textbox") as HTMLInputElement
    input.value = "New Title"

    await waitFor(()=> screen.getByRole("button",{name:"Update"}).click())
    expect(await screen.findByText("New Title")).toBeInTheDocument()
})

test("Edit delete button correctly dispatches to redux store.", async () => {
    render(<QuickLinksSidebar/>, {preloadedState: {"quickLinks": quickLinks}})

    const divButtons = await screen.findAllByTestId("sidebar-button")

    await waitFor(()=>(divButtons[0].childNodes[0] as HTMLDivElement).click())
    await waitFor(()=> screen.getByRole("button",{name:"Delete"}).click())
    expect(await screen.queryByText("test 2")).toBeNull()
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

test("Quicklink table add buttons calls search popup and changes on return search data.", async () => {
    render(<QuickLinksTable/>, {preloadedState: {"quickLinks": quickLinks}})
    const table = await screen.findByTestId("quicklinks-table")
    await waitFor(()=> (table.childNodes[1] as HTMLDivElement).click())

    await waitFor(async()=>{
        const input = await screen.findByTestId("search-input") as HTMLInputElement
        input.defaultValue = "HVSB"
        await waitFor(()=>fireEvent.change(input))
    })

    expect(await screen.findByText("HVSB")).toBeInTheDocument()
    let divBtn = screen.getByText("HVSB").parentNode as HTMLDivElement
    await waitFor(()=>divBtn.click())

    expect(table.childNodes[1].childNodes[2]).toHaveTextContent("Test HVSB")
    screen.debug()

})

test("Quicklink table items change background colour on colour select.", async () => {
    render(<QuickLinksTable/>, {preloadedState: {"quickLinks": quickLinks}})
    const parent = (await screen.findByTestId("quicklinks-table")).childNodes[0];
    const input = parent.childNodes[3].childNodes[0] as HTMLInputElement
    input.value = "#000000"
    await waitFor(()=>fireEvent.blur(input))
    await waitFor(()=>expect(parent).toHaveAttribute("style","background: rgb(0, 0, 0);"))
})

test("Quicklink table delete button removes item.", async () => {
    render(<QuickLinksTable/>, {preloadedState: {"quickLinks": quickLinks}})
    const parent = (await screen.findByTestId("quicklinks-table")).childNodes[0];
    const deleteBtn = parent.childNodes[3].childNodes[1] as HTMLInputElement
    await waitFor(()=>deleteBtn.click())
    const yesBtn = await screen.findByRole("button",{name:"Yes"})
    await waitFor(()=>yesBtn.click())
    screen.debug()
})