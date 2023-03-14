import {mockStore, renderWithProviders, screen} from "../../../../__mocks__/mock-store-wrapper";
import NewBrandPopup from "../../../../pages/item-database/new-items/new-brand-popup";
import userEvent from "@testing-library/user-event";
import ErrorPopup from "../../../../pages/item-database/new-items/error-popup";

const mockQuery = jest.fn()
jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter() {
        return {
            query: mockQuery(),
        }
    }
}))
const mockToastProps = jest.fn()
jest.mock('../../../../components/toast/dispatch-toast', () => ({
    dispatchToast: (props: any) => mockToastProps(props)
}))
const mockNotificationProps = jest.fn()
jest.mock('../../../../components/notification/dispatch-notification', () => ({
    dispatchNotification: (props: any) => mockNotificationProps(props)
}))

const mockAPI = jest.fn()
let mockStatus:number
let mockJson:string | string[]

global.fetch = jest.fn((props: any) => {
    mockAPI(props)
    return Promise.resolve({
        status: mockStatus,
        json: () => Promise.resolve(mockJson)
    })
}) as jest.Mock


beforeEach(() => {
    mockQuery.mockReturnValue({tab:'new-items'})
})
test("input onChanges setState correctly and save button fires fetch request", async () => {
    mockStatus = 200
    mockJson = "All ok"
    const user = userEvent.setup()
    renderWithProviders(<NewBrandPopup/>)
    await user.type(screen.getByRole('brand-input'), 'Test Brand')
    await user.type(screen.getByRole('brand-prefix-input'), 'TBD')
    await user.click(screen.getByRole('save-button'))
    expect(mockAPI).toHaveBeenCalledWith('/api/item-database/save-new-brand')
    expect(mockToastProps).toHaveBeenCalledWith({content: mockJson})
    expect(mockStore.getState().newItems.brands).toContain("Test Brand")
})

test("toast error message is dispatched when prefix doesnt match regex", async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewBrandPopup/>)
    await user.type(screen.getByRole('brand-input'), 'Test Brand')
    await user.type(screen.getByRole('brand-prefix-input'), 'TB')
    await user.click(screen.getByRole('save-button'))
    expect(mockAPI).not.toHaveBeenCalled()
    expect(mockToastProps).toHaveBeenCalledWith({content:"Prefix must be A-Z and 3 characters long"})
})

test("correct notifications are displayed depending on status", async () => {
    mockStatus = 400
    mockJson = ["Error 1", "Error 2"]
    const user = userEvent.setup()
    renderWithProviders(<NewBrandPopup/>)
    await user.type(screen.getByRole('brand-input'), 'Test Brand')
    await user.type(screen.getByRole('brand-prefix-input'), 'TBD')
    await user.click(screen.getByRole('save-button'))
    expect(mockNotificationProps).toHaveBeenNthCalledWith(3, {type: 'alert', content:<ErrorPopup errors={["Error 1", "Error 2"]}/>})
})
afterEach(() => {
    jest.clearAllMocks()
})