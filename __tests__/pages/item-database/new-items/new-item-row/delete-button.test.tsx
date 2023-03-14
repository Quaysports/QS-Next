import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import userEvent from "@testing-library/user-event";
import DeleteButton from "../../../../../pages/item-database/new-items/new-item-row/delete-button";
import {reset} from "../../../../../store/reset-store";

jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter() {
        return {
            query:{tab:'new-items'}
        }
    }
}))
const mockDelete = jest.fn()
test('delete button removes item row ', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DeleteButton deleteRow={() => mockDelete()}/>)
    await user.click(screen.getByRole('button'))
    expect(mockDelete).toHaveBeenCalledTimes(1)
})

afterEach(() => {
    mockStore.dispatch(reset())
})