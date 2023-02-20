import SideBar from "../../../../pages/item-database/item-database/sidebar";
import {renderWithProviders, fireEvent, screen} from "../../../../__mocks__/mock-store-wrapper";
import NewTagPopUp from "../../../../pages/item-database/item-database/sidebar-components/new-tag-popup";
import JariloTemplatePopup from "../../../../pages/item-database/item-database/sidebar-components/jarilo-template-popup";
import ImportDetailsPopUp from "../../../../pages/item-database/item-database/sidebar-components/import-details-popup";
import BrandLabelPopUp from "../../../../pages/item-database/item-database/sidebar-components/brand-label-popup";

const mockLinnworksButton = jest.fn()
const mockDispatchProps = jest.fn()
const window = jest.fn()
// @ts-ignore
delete global.window.open;
global.window.open = window

jest.mock('../../../../components/jarilo-template', () => {
    return {
        jariloHtml: jest.fn()
    }
})

jest.mock('../../../../components/item-database-utils/linnworks-upload-function', () => () => {
    mockLinnworksButton()
})
jest.mock('../../../../components/notification/dispatch-notification', () => ({
    dispatchNotification: (props: any) => mockDispatchProps(props)
}))
jest.mock('next/router', () => ({
    useRouter: () => ({push: jest.fn()})
}))

const printButtons = [
    ['Barcode', 'barcode'],
    ['Tag', 'tag'],
    ['Shelf Tag', 'shelf-tag'],
    ['Rod Tag', 'rod-tag']
] as const

const sidebarButtons = [
    ['Jarilo Template', {
        type: 'popup',
        title: 'Jarilo Template',
        content: <JariloTemplatePopup/>
    }],
    ['Import Details', {
        type: 'popup',
        title: 'Import Details from SKU',
        content: <ImportDetailsPopUp/>
    }],
    ['Branded Labels', {
        type: 'popup',
        title: 'Brand Label',
        content: <BrandLabelPopUp print={expect.any(Function)}/>
    }],
    ['Create New Tag', {
        type: 'popup',
        title: 'New Tag',
        content: <NewTagPopUp/>
    }]
] as const

describe('SideBar', () => {
    test.each(printButtons)('print function is called with correct info when buttons are clicked', async (index, text) => {
        renderWithProviders(<SideBar/>)
        fireEvent.click(await screen.findByRole('button', {name: index}))
        expect(window).toHaveBeenCalledWith('/print?app=item-database&print=' + text, '_blank', 'width=515,height=580')
        console.log(global.window.localStorage.getItem('item'))
    })

    test.each(sidebarButtons)('dispatch notification is called correctly when buttons are clicked', async (index, content) => {
        jest.clearAllMocks()
        renderWithProviders(<SideBar/>)
        fireEvent.click(await screen.findByRole('button', {name: index}))
        expect(mockDispatchProps).toHaveBeenCalledWith(content)
    })

    test('linnworks button is called', async () => {
        renderWithProviders(<SideBar/>)
        fireEvent.click(await screen.findByRole('button', {name: 'Upload to Linnworks'}))
        expect(mockLinnworksButton).toHaveBeenCalled()
    })
})