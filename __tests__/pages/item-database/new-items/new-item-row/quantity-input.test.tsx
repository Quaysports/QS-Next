import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import QuantityInput from "../../../../../pages/item-database/new-items/new-item-row/quantity-input";
import {addNewItem} from "../../../../../store/item-database/new-items-slice";
import userEvent from "@testing-library/user-event";
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
    return <input onBlur={(e) => {props.handler(e.target.value)}}/>
})
test('quantity input sets state correctly onBlur', async () => {
    const user = userEvent.setup()
    mockStore.dispatch(addNewItem("ESP"))
    renderWithProviders(<QuantityInput index={0}/>)
    await user.type(screen.getByRole('textbox'), '9')
    await user.tab()
    expect(mockRegexProps).toHaveBeenCalledWith({errorMessage: expect.any(String), handler:expect.any(Function), value:0, type: "number"})
    expect(mockStore.getState().newItems.items[0].stock.total).toStrictEqual(9)
})
afterEach(() => {
    mockStore.dispatch(reset())
})