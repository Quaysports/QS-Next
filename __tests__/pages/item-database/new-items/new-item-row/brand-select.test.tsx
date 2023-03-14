import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import {addNewItem, setNewItemsBrands} from "../../../../../store/item-database/new-items-slice";
import BrandSelect from "../../../../../pages/item-database/new-items/new-item-row/brand-select";
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
const mockBrandTest = [['ESP'], ['Korda'], ['Drennan']] as const
test.each(mockBrandTest)('brand select displays options depending on supplier', async (brand) => {
    const mockBrands = ['ESP', 'Korda', 'Drennan']
    mockStore.dispatch(addNewItem("ESP"))
    mockStore.dispatch(setNewItemsBrands(mockBrands))
    const user = userEvent.setup()
    renderWithProviders(<BrandSelect index={0}/>)
    await user.selectOptions(screen.getByRole('combobox'),[brand])
    expect(mockStore.getState().newItems.items[0].brand).toStrictEqual(brand)
})

afterEach(() => {
    mockStore.dispatch(reset())
})