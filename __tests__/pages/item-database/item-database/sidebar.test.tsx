import SideBar from "../../../../pages/item-database/item-database/sidebar";
import {renderWithProviders, fireEvent, screen} from "../../../../__mocks__/mock-store-wrapper";
import {waitFor} from "@testing-library/dom";
import NewTagPopUp from "../../../../pages/item-database/item-database/sidebar-components/new-tag-popup";
import JariloTemplatePopup from "../../../../pages/item-database/item-database/sidebar-components/jarilo-template-popup";

const mockSidebarButtonProps = jest.fn()
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


test('test', () => {

    const expectedProps = [
        [{children: "Barcode", onClick: expect.any(Function)}],
        [{children: "Tag", onClick: expect.any(Function)}],
        [{children: "Shelf Tag", onClick: expect.any(Function)}],
        [{children: "Rod Tag", onClick: expect.any(Function)}],
        [{children: "Jarilo Template", onClick: expect.any(Function)}],
        [{children: "Import Details", onClick: expect.any(Function)}],
        [{children: "Branded Labels", onClick: expect.any(Function)}],
        [{children: "Create New Tag", onClick: expect.any(Function)}]
    ]

    renderWithProviders(<SideBar/>)
    expect(mockSidebarButtonProps.mock.calls).toEqual(expectedProps)
    expect(mockLinnworksButton).toHaveBeenCalled()
})

const buttonIndexAndText = [
    [0, 'Barcode'],
    [1, 'Tag'],
    [2, 'Shelf Tag'],
    [3, 'Rod Tag']
] as const


test.each(buttonIndexAndText)('print function is called with correct info when buttons are clicked', async (index, text) => {
    renderWithProviders(<SideBar/>)
    const buttons = await screen.findAllByTestId('mock-button')
    fireEvent.click(buttons[index])
    expect(window).toHaveBeenCalledWith('/print?app=item-database&print=' + text, '_blank', 'width=515,height=580')
})

const buttonIndexAndArgs = [
    [4, {
        type: 'popup',
        title: 'Jarilo Template',
        content: <JariloTemplatePopup/>
    }],
    [5, {
        type: 'popup',
        title: 'Import Details from SKU',
        content: <MockImportDetails/>
    }],
    [6, {
        type: 'popup',
        title: 'Brand Label',
        content: <MockBrandLabel print={expect.any(Function)}/>
    }],
    [7, {
        type: 'popup',
        title: 'New Tag',
        content: <NewTagPopUp/>
    }]
] as const
test.each(buttonIndexAndArgs)('dispatch notification is called correctly when buttons are clicked', async (index, content) => {
    renderWithProviders(<SideBar/>)
    const buttons = await screen.findAllByTestId('mock-button')
    await waitFor(() => fireEvent.click(buttons[index]))
    expect(mockDispatchProps).toHaveBeenCalledWith(content)
})


/*jest.mock('../../../../components/layouts/sidebar-layout', () => {
    return MockSidebarLayout
})*/
jest.mock('../../../../components/layouts/sidebar-button', () => (props: any) => {
    mockSidebarButtonProps(props)
    return MockSidebarButton(props)
})
/*jest.mock('../../../../pages/item-database/item-database/sidebar-components/jarilo-template-popup', () => {
    return MockJariloTemplate
})*/
jest.mock('../../../../pages/item-database/item-database/sidebar-components/import-details-popup', () => {
    return MockImportDetails
})
/*jest.mock('../../../../pages/item-database/item-database/sidebar-components/new-tag-popup', () => {
    return MockNewTags
})*/
jest.mock('../../../../pages/item-database/item-database/sidebar-components/brand-label-popup', () => {
    return MockBrandLabel
})
jest.mock('../../../../pages/item-database/item-database/sidebar-components/linnworks-upload-button', () => () => {
    mockLinnworksButton()
})
jest.mock('../../../../components/notification/dispatch-notification', () => ({
    dispatchNotification: (props:any) => {
        mockDispatchProps(props)
        return MockDispatchNotification()
    }
}))
jest.mock('next/router', () => ({
    useRouter: () => {
        return {
            push: jest.fn()
        }
    }
}))
function MockSidebarLayout({children}: any) {
    return <div>{children}</div>
}
function MockSidebarButton({onClick}: any) {
    return <div data-testid={'mock-button'} onClick={() => onClick()}/>
}
function MockJariloTemplate() {
    return <div/>
}
function MockImportDetails() {
    return <div/>
}
function MockBrandLabel({print}:any) {
    return <div/>
}
/*function MockNewTags() {
    return <div/>
}*/
function MockDispatchNotification() {
    return <div/>
}