import SideBar from "../../../../pages/item-database/item-database/sidebar";
import {renderWithProviders, fireEvent, screen} from "../../../../__mocks__/mock-store-wrapper";
jest.mock('../../../../components/layouts/sidebar-layout', () => {
    return MockSidebarLayout
})
const mockProps = jest.fn()
jest.mock('../../../../components/layouts/sidebar-button', () => (props: any) => {
    mockProps(props)
    return MockSidebarButton(props)
})
jest.mock('../../../../components/jarilo-template', () => ({
    jariloHtml: () => jest.fn()
}))
jest.mock('../../../../pages/item-database/item-database/sidebar-components/linnworks-upload-button', () => {
    return MockLinnworksButton
})
jest.mock('next/router', () => ({
    useRouter: () => {
        return {
            push: jest.fn()
        }
    }
}))
const window = jest.fn()
// @ts-ignore
delete global.window.open;
global.window.open = window
function MockSidebarLayout({children}: any) {
    return <div>{children}</div>
}
function MockSidebarButton(props: any) {
    return <div data-testid={'mock-button'} onClick={() => props.onClick()}/>
}
function MockLinnworksButton(){
    return <div/>
}
const expectedProps = [
    [{children: "Barcode", onClick: expect.any(Function)}],
    [{children: "Tag", onClick: expect.any(Function)}],
    [{children: "Shelf Tag", onClick: expect.any(Function)}],
    [{children: "Jarilo Template", onClick: expect.any(Function)}],
    [{children: "Import Details", onClick: expect.any(Function)}],
    [{children: "Branded Labels", onClick: expect.any(Function)}],
    [{children: "Create New Tag", onClick: expect.any(Function)}]
    ]

test('test', () => {
    renderWithProviders(<SideBar/>)
    expect(mockProps.mock.calls).toEqual(expectedProps)
})

const buttonIndexAndText:[number, string][] = [[0, 'barcode'], [1, 'tag'], [2, 'shelf-tag']]
test.each(buttonIndexAndText)('correct functions are called when buttons are pressed', async (index, text) => {
    renderWithProviders(<SideBar/>)
    const buttons = await screen.findAllByTestId('mock-button')
    fireEvent.click(buttons[index])
    expect(window).toHaveBeenCalledWith('/print?app=item-database&print=' + text, '_blank', 'width=515,height=580')
})