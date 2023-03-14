import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import SKUInput from "../../../../../pages/item-database/new-items/new-item-row/sku-input";
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
const mockProps = jest.fn()
jest.mock('../../../../../components/regex-input/index', () => (props:any) => {
    mockProps(props)
    return <input onBlur={(e) => {props.handler(e.target.value)}}/>
})
test('SKU input set state correctly onChange', async () => {
    mockStore.dispatch(addNewItem("ESP"))
    const user = userEvent.setup()
    renderWithProviders(<SKUInput index={0}/>)
    await user.type(screen.getByRole('textbox'), 'test-sku')
    await user.tab()
    expect(mockProps).toHaveBeenCalledWith({"errorMessage": expect.any(String), "handler": expect.any(Function), "type": "alphanumeric", "value": ""})
    expect(mockStore.getState().newItems.items[0].SKU).toStrictEqual('test-sku')
})

afterEach(() => {
    mockStore.dispatch(reset())
})