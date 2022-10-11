import {render, screen} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import QuickLinksSidebar from "../../../pages/shop-tills/quick-links/sidebar";
import QuickLinksTable from "../../../pages/shop-tills/quick-links/table";
import {quickLinksState} from "../../../store/shop-tills/quicklinks-slice";
import DashboardTabs from "../../../pages/dashboard/tabs";


jest.mock("next/router", () => ({
    useRouter: () => ({query: {tab:"quick-links"}}),
}));

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

test("Page initially loads with sidebar", ()=>{
    render(<QuickLinksSidebar/>, {preloadedState:{"quickLinks":quickLinks}})
    screen.debug()
})