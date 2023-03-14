import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import {mockStore, renderWithProviders, screen} from "../../../../__mocks__/mock-store-wrapper";
import {
    addNewItem,
    setNewItemBarcode,
    setNewItemQuantity,
    setNewItemSuppliers,
} from "../../../../store/item-database/new-items-slice";
import NewItemsSideBar from "../../../../pages/item-database/new-items/new-items-sidebar";
import NewSupplierPopup from "../../../../pages/item-database/new-items/new-supplier-popup";
import NewBrandPopup from "../../../../pages/item-database/new-items/new-brand-popup";
import {reset} from "../../../../store/reset-store";
import ErrorPopup from "../../../../pages/item-database/new-items/error-popup";

const mockSuppliers = ['Drennan', 'ESP', 'Daiwa']
const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter() {
        return {
            query: mockQuery(),
            push: (route: any) => mockPush(route)
        }
    }
}))

const mockDispatchProps = jest.fn()
jest.mock('../../../../components/notification/dispatch-notification', () => ({
    dispatchNotification: (props: any) => mockDispatchProps(props)
}))
const mockToastProps = jest.fn()
jest.mock('../../../../components/toast/dispatch-toast', () => ({
    dispatchToast: (props: any) => mockToastProps(props)
}))
const mockNewItemRow = jest.fn()
jest.mock('../../../../pages/item-database/new-items/new-item-row/new-item-row', () => (props: any) => {
    mockNewItemRow(props)
    return <button onClick={() => props.deleteRow(0)}>Delete</button>
})
const mockLinnCall = jest.fn()
jest.mock('../../../../pages/api/linnworks/upload-new-items', () => ({
    handler: (props: any) => mockLinnCall(props)
}))
let mockStatus: number
const mockAPI = jest.fn()
global.fetch = jest.fn((props) => {
    mockAPI(props)
    return Promise.resolve({
        status: mockStatus,
        json: () => Promise.resolve([])
    })
}) as jest.Mock
beforeEach(() => {
    jest.clearAllMocks()
    mockQuery.mockReturnValue({tab: 'new-items'})
})
afterEach(() => {
    mockStore.dispatch(reset())
})
test("copy last item button adds a new item with previous items details included or a fresh item if nothing was there previously", async () => {
    const user = userEvent.setup()
    mockQuery.mockReturnValue({supplier: 'Drennan'})
    mockStore.dispatch(addNewItem("Drennan"))
    mockStore.dispatch(setNewItemBarcode({index: 0, barcode: "000001234567"}))
    mockStore.dispatch(setNewItemQuantity({index: 0, quantity: 5}))
    renderWithProviders(<NewItemsSideBar/>)
    await user.click(screen.getByText("Copy last item"))
    expect(mockStore.getState().newItems.items[0].supplier).toBe('Drennan')
    expect(mockStore.getState().newItems.items[0].EAN).toBe("000001234567")
    expect(mockStore.getState().newItems.items[0].stock.total).toBe(5)
})
test("new supplier button calls dispatch notification with NewSupplierPopup component", async () => {
    const user = userEvent.setup()
    renderWithProviders(<NewItemsSideBar/>)
    await user.click(screen.getByText("New Supplier"))
    expect(mockDispatchProps).toHaveBeenCalledWith({
        type: 'popup',
        title: 'New Supplier',
        content: <NewSupplierPopup/>
    })
})
test('add new row button onClick increments new items by 1', async () => {
    const user = userEvent.setup()
    mockQuery.mockReturnValue({supplier: 'Drennan'})
    renderWithProviders(<NewItemsSideBar/>)
    await user.click(screen.getByText('Add new item'))
    await user.click(screen.getByText('Add new item'))
    await user.click(screen.getByText('Add new item'))
    expect(mockStore.getState().newItems.items[2].supplier).toStrictEqual('Drennan')
    expect(mockStore.getState().newItems.items.length).toBe(3)
})
const supplierTestExpects = [
    [0, ''],
    [1, 'Drennan'],
    [2, 'ESP'],
    [3, 'Daiwa']] as const
test.each(supplierTestExpects)('suppliers select gets built and contains all options with correct values', async (index: number, supplier: string) => {
    mockStore.dispatch(setNewItemSuppliers(mockSuppliers))
    renderWithProviders(<NewItemsSideBar/>)
    const supplierOptions = await screen.findAllByRole('supplier-option')
    const supplierSelect = await screen.getByRole('supplier-select')
    expect(supplierSelect).toBeInTheDocument()
    expect(supplierOptions[index]).toHaveProperty('value', supplier)
})
test('new brand button, add new row button and add to linnworks button do not render unless a supplier is selected', async () => {
    mockStore.dispatch(setNewItemSuppliers(mockSuppliers))
    renderWithProviders(<NewItemsSideBar/>)
    expect(screen.queryByText('New Brand')).not.toBeInTheDocument()
    expect(screen.queryByText('Add new item')).not.toBeInTheDocument()
    expect(screen.queryByText('Add to Linnworks')).not.toBeInTheDocument()
})
test('new brand button onclick calls new brand popup', async () => {
    const user = userEvent.setup()
    mockStore.dispatch(setNewItemSuppliers(mockSuppliers))
    mockQuery.mockReturnValue({supplier: 'Drennan'})
    renderWithProviders(<NewItemsSideBar/>)
    await user.click(screen.getByText('New Brand'))
    expect(mockDispatchProps).toHaveBeenCalledWith({
        type: 'popup',
        title: 'New Brand',
        content: <NewBrandPopup/>
    })
})
test('newt router gets called correctly on supplier change when no supplier was previously selected', async () => {
    const user = userEvent.setup()
    mockStore.dispatch(setNewItemSuppliers(mockSuppliers))
    renderWithProviders(<NewItemsSideBar/>)
    await user.selectOptions(screen.getByRole('supplier-select'), ['Daiwa'])
    expect(mockPush).toHaveBeenCalledWith({pathname: undefined, query: {supplier: "Daiwa", tab:"new-items"}})
})

test("Add to linnworks button calls correct api", async () => {
    const user = userEvent.setup()
    mockQuery.mockReturnValue({supplier: 'Drennan'})
    renderWithProviders(<NewItemsSideBar/>)
    await user.click(screen.getByText('Add to Linnworks'))
    expect(mockAPI).toBeCalledWith("/api/linnworks/upload-new-items")
})
const errorExpects = [
    [mockToastProps, 1, 200, {content: "New items added successfully"}],
    [mockDispatchProps, 3, 300, {type: 'popup', title: "Upload Error", content: <ErrorPopup errors={[]}/>}],
    [mockDispatchProps, 3, 400, {
        type: 'alert',
        title: "Upload Error",
        content: "Please provide an SKU, Title, Barcode, Brand and Purchase Price for all items"
    }]
] as const
test.each(errorExpects)("error handling fires correct dispatch event and correct api is called", async (mockCall,nthCall, status, content) => {
    const user = userEvent.setup()
    mockQuery.mockReturnValue({supplier: 'Drennan'})
    renderWithProviders(<NewItemsSideBar/>)
    mockStatus = status
    await user.click(screen.getByText('Add to Linnworks'))
    expect(mockCall).nthCalledWith(nthCall, content)
})