import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import {addNewItem} from "../../../../../store/item-database/new-items-slice";
import ShippingSelect from "../../../../../pages/item-database/new-items/new-item-row/shipping-select";
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

const shippingSelectExpects = [
    [""],
    ['RM Large Letter'],
    ['RM Packet'],
    ['RM Packet 24'],
    ['Courier'],
]
test.each(shippingSelectExpects)('changing shipping select sets correct state', async (value) => {
    mockStore.dispatch(addNewItem("ESP"))
    const user = userEvent.setup()
    renderWithProviders(<ShippingSelect index={0}/>)
    await user.selectOptions(screen.getByRole('combobox'), value)
    const options = await screen.findAllByRole('option')
    expect(options.length).toStrictEqual(5)
    expect(mockStore.getState().newItems.items[0].mappedExtendedProperties.shippingFormat).toStrictEqual(value)
})

afterEach(() => {
    mockStore.dispatch(reset())
})