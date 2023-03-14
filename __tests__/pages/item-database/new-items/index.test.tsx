import {mockStore, renderWithProviders, screen} from "../../../../__mocks__/mock-store-wrapper";
import NewItems from "../../../../pages/item-database/new-items";
import userEvent from "@testing-library/user-event";
import {reset} from "../../../../store/reset-store";
import {addNewItem} from "../../../../store/item-database/new-items-slice";

const mockPush = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter() {
        return {
            query: mockQuery(),
            push:(route:any) => mockPush(route)
        }
    }
}))

beforeEach(() => {
    mockQuery.mockReturnValue({tab:'new-items'})
})
afterEach(() => {
    mockStore.dispatch(reset())
})

test('delete row function removes element and updates store', async () => {
    const user = userEvent.setup()
    mockStore.dispatch(addNewItem('Drennan'))
    mockQuery.mockReturnValue({supplier:'Drennan'})
    renderWithProviders(<NewItems/>)
    expect(mockStore.getState().newItems.items.length).toBe(1)
    await user.click(screen.getByText('X'))
    expect(mockStore.getState().newItems.items.length).toBe(0)
})



