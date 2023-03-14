import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import TitleInput from "../../../../../pages/item-database/new-items/new-item-row/title-input";
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
test('title input update state correctly onChange', async () => {
    mockStore.dispatch(addNewItem("ESP"))
    const user = userEvent.setup()
    renderWithProviders(<TitleInput index={0}/>)
    await user.type(screen.getByRole('textbox'), 'test-title')
    expect(mockStore.getState().newItems.items[0].title).toStrictEqual('test-title')
})

afterEach(() => {
    mockStore.dispatch(reset())
})