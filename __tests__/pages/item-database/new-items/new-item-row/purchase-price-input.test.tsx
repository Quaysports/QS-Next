import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import PurchasePriceInput from "../../../../../pages/item-database/new-items/new-item-row/purchase-price-input";
import userEvent from "@testing-library/user-event";
import {addNewItem} from "../../../../../store/item-database/new-items-slice";
import {reset} from "../../../../../store/reset-store";

jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter() {
        return {
            query:{tab:'new-items'}
        }
    }
}))
const mockRegexProps = jest.fn()
jest.mock('../../../../../components/regex-input/index', () => (props:any) => {
    mockRegexProps(props)
    return <input onBlur={(e) => (props.handler(e.target.value))}/>
})
test('purchase price updates store item onBlur', async () => {
    const user = userEvent.setup()
    mockStore.dispatch(addNewItem("ESP"))
    renderWithProviders(<PurchasePriceInput index={0}/>)
    await user.type(screen.getByRole('textbox'), '02.65')
    await user.tab()
    expect(mockRegexProps).toHaveBeenCalledWith({"errorMessage": expect.any(String), "handler": expect.any(Function), "type": "money", "value": 0})
    expect(mockStore.getState().newItems.items[0].prices.purchase).toStrictEqual(2.65)
})

afterEach(() => {
    mockStore.dispatch(reset())
})