import {mockStore, renderWithProviders, screen} from "../../../../__mocks__/mock-store-wrapper";
import userEvent from "@testing-library/user-event";
import NewSupplierPopup from "../../../../pages/item-database/new-items/new-supplier-popup";
import {setNewItemSuppliers} from "../../../../store/item-database/new-items-slice";

jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter() {
        return {
            query: {tab:'new-items'},
        }
    }
}))

const mockAPI = jest.fn()
let mockStatus: any
let mockJson: any
global.fetch = jest.fn((api:string) => {
    mockAPI(api)
    return Promise.resolve({
        status:mockStatus,
        json: () => Promise.resolve(mockJson)
    })
}) as jest.Mock

const mockDispatchProps = jest.fn()
jest.mock('../../../../components/notification/dispatch-notification', () => ({
    dispatchNotification: (props: any) => mockDispatchProps(props)
}))
const mockToastProps = jest.fn()
jest.mock('../../../../components/toast/dispatch-toast', () => ({
    dispatchToast: (props: any) => mockToastProps(props)
}))

beforeEach(() => {
    jest.clearAllMocks()
})
test("it hits correct api on save", async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewSupplierPopup/>)
    await user.click(screen.getByText('Save'))
    expect(mockAPI).toHaveBeenCalledWith('/api/linnworks/add-new-supplier')
})

const responseParams = [
    [200, "All good", mockToastProps, {content:"All good"}, 1],
    [300, "Supplier already exists", mockDispatchProps, {content:"Supplier already exists", title:expect.any(String), type: 'alert'}, 3],
    [400, "Supplier creation error", mockDispatchProps, {content:"Supplier creation error", title:expect.any(String), type: 'alert'}, 3]
] as const
test.each(responseParams)("Correct notifications are displayed on status return", async (status,json, mock, args, nth ) => {
    mockStatus = status
    mockJson = json
    const user = userEvent.setup()
    renderWithProviders(<NewSupplierPopup/>)
    await user.click(screen.getByText('Save'))
    expect(mock).toHaveBeenNthCalledWith(nth, args)
})
test("new supplier gets added to dropdown list when created", async () => {
    mockStore.dispatch(setNewItemSuppliers(["this", "that"]))
    mockStatus = 200
    mockJson = {}
    const user = userEvent.setup()
    renderWithProviders(<NewSupplierPopup/>)
    await user.type(screen.getByRole("textbox"), "Test")
    await user.click(screen.getByText('Save'))
    expect(mockStore.getState().newItems.suppliers).toContain('Test')
})

