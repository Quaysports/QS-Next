import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import BarcodeInput from "../../../../../pages/item-database/new-items/new-item-row/barcode-input";
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
const mockProps = jest.fn()
jest.mock('../../../../../components/regex-input/index', () => (props:any) => {
    mockProps(props)
    return <input onBlur={(e) => {props.handler(e.target.value)}}/>
})
test('when regex input handler function is called store is updated correctly', async () => {
    const user = userEvent.setup()
    mockStore.dispatch(addNewItem("ESP"))
    renderWithProviders(<BarcodeInput index={0}/>)
    await user.type(screen.getByRole('textbox'), '012345678901')
    await user.tab()
    expect(mockProps).toHaveBeenCalledWith({"errorMessage": expect.any(String), "handler": expect.any(Function), "type": "barcode", "value": ""})
    expect(mockStore.getState().newItems.items[0].EAN).toStrictEqual('012345678901')
})

afterEach(() => {
    mockStore.dispatch(reset())
})