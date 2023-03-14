import {mockStore, renderWithProviders, screen} from "../../../../../__mocks__/mock-store-wrapper";
import TagsPopup from "../../../../../pages/item-database/new-items/new-item-row/tags-popup";
import userEvent from "@testing-library/user-event";
import {addNewItem, setNewItemAllTags, setNewItemTags} from "../../../../../store/item-database/new-items-slice";
import TagsCheckboxList from "../../../../../components/item-database-utils/tags-popup";
import {reset} from "../../../../../store/reset-store";

const mockDispatch = jest.fn()
function MockTagPopup(props:any){
    mockDispatch(props)
    props.content.props.handler(['carp,coarse'])
}
jest.mock("../../../../../components/notification/dispatch-notification", () => ({
    dispatchNotification: (props:any) => MockTagPopup(props)
}))
jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter() {
        return {
            query:{tab:'new-items'}
        }
    }
}))

const mockTags = ['coarse', 'carp', 'sea', 'game', 'predator', 'rods', 'reels']
test('tags popup fires dispatch notification with correct info and handler function updates state correctly', async () => {
    mockStore.dispatch(setNewItemAllTags(mockTags))
    mockStore.dispatch(addNewItem("ESP"))
    mockStore.dispatch(setNewItemTags({index:0, tags:mockTags}))
    const user = userEvent.setup()
    renderWithProviders(<TagsPopup index={0}/>)
    await user.click(screen.getByRole('tags-button'))
    expect(mockDispatch).toHaveBeenCalledWith({content: <TagsCheckboxList itemTags={mockTags} tags={mockTags} handler={expect.any(Function)} />, title:'Tags', type:'popup'})
    expect(mockStore.getState().newItems.items[0].tags).toStrictEqual(['carp,coarse'])
})

afterEach(() => {
    mockStore.dispatch(reset())
})