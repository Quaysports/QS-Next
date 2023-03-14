import {mockStore, renderWithProviders,screen} from "../../../../../__mocks__/mock-store-wrapper";
import RetailPriceInput from "../../../../../pages/item-database/new-items/new-item-row/retail-price-input";
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
    return <input onBlur={(e) => (props.handler(e.target.value))}/>
})
test('retail price input updates state onBlur', async () => {
    const user = userEvent.setup()
    mockStore.dispatch(addNewItem("ESP"))
    renderWithProviders(<RetailPriceInput index={0}/>)
    await user.type(screen.getByRole('textbox'), '08.53')
    await user.tab()
    expect(mockRegexProps).toHaveBeenCalledWith({errorMessage:expect.any(String), handler:expect.any(Function), type:'money', value:0})
    expect(mockStore.getState().newItems.items[0].prices.retail).toStrictEqual(8.53)
})

afterEach(() => {
    mockStore.dispatch(reset())
})