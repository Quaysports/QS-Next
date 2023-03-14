import {mockStore, renderWithProviders} from "../../../../../__mocks__/mock-store-wrapper";
import NewItemRow from "../../../../../pages/item-database/new-items/new-item-row/new-item-row";
import {reset} from "../../../../../store/reset-store";

jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter() {
        return {
            query:{tab:'new-items'}
        }
    }
}))

const mockBrandSelect = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/brand-select', () => {
    return (props:any) => mockBrandSelect(props)
})
const mockSKUInput = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/sku-input', () => {
    return (props:any) => mockSKUInput(props)
})
const mockTitleInput = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/title-input', () => {
    return (props:any) => mockTitleInput(props)
})
const mockPurchasePriceInput = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/purchase-price-input', () => {
    return (props:any) => mockPurchasePriceInput(props)
})
const mockRetailPrice = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/retail-price-input', () => {
    return (props:any) => mockRetailPrice(props)
})
const mockBarcodeInput = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/barcode-input', () => {
    return (props:any) => mockBarcodeInput(props)
})
const mockQuantityInput = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/quantity-input', () => {
    return (props:any) => mockQuantityInput(props)
})
const mockShippingSelect = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/shipping-select', () => {
    return (props:any) => mockShippingSelect(props)
})
const mockTagsPopup = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/tags-popup', () => {
    return (props:any) => mockTagsPopup(props)
})
const mockDeleteButton = jest.fn()
jest.mock('../../../../../pages/item-database/new-items/new-item-row/delete-button', () => {
    return (props:any) => mockDeleteButton(props)
})
const mockComponents = [
    [mockBrandSelect, {index: 0}],
    [mockSKUInput, {index: 0}],
    [mockTitleInput, {index: 0}],
    [mockPurchasePriceInput, {index: 0}],
    [mockRetailPrice, {index: 0}],
    [mockBarcodeInput, {index: 0}],
    [mockQuantityInput, {index: 0}],
    [mockShippingSelect, {index: 0}],
    [mockTagsPopup, {index: 0}],
    [mockDeleteButton, {deleteRow:expect.any(Function)}]
] as const

const mockDeleteRow = jest.fn()
beforeEach(() => {
    jest.clearAllMocks()
})
test.each(mockComponents)('new item row calls all the required components', (component, props) => {
    renderWithProviders(<NewItemRow deleteRow={() => mockDeleteRow(0)} index={0}/>)
    expect(component).toHaveBeenCalledTimes(1)
    expect(component).toHaveBeenCalledWith(props)
})

afterEach(() => {
    mockStore.dispatch(reset())
})