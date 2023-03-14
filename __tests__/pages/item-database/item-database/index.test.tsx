import {renderWithProviders, fireEvent, screen, mockStore} from "../../../../__mocks__/mock-store-wrapper";
import ItemDatabaseLandingPage from "../../../../pages/item-database/item-database";
import {itemTemplate} from "../../../../__mocks__/item-template";
import {setItem} from "../../../../store/item-database/item-database-slice";
import {waitFor} from "@testing-library/dom";

const mockPush = jest.fn()
const MockSidebar = jest.fn()
const MockItemDetails = jest.fn()

describe('item database index page tests', () => {
    test('SideBar does and does not get called depending on item.SKU', async () => {
        renderWithProviders(<ItemDatabaseLandingPage/>)
        expect(MockSidebar).not.toHaveBeenCalled()
        expect(MockItemDetails).not.toHaveBeenCalled()
        await waitFor(() => mockStore.dispatch(setItem({...itemTemplate(),SKU:'Test'})))
        expect(MockSidebar).toHaveBeenCalled()
        expect(MockItemDetails).toHaveBeenCalled()
    })
    test('search options pushes to router', () => {
        renderWithProviders(<ItemDatabaseLandingPage/>)
        fireEvent.click(screen.getByTestId('test-handler'))
        expect(mockPush).toBeCalledWith({pathname: undefined, query: {sku: 'test'}})
    })

})


jest.mock('next/router', () => ({
    useRouter: () => {
        return {
            push: (e: string) => mockPush(e),
        }
    }
}))
jest.mock('../../../../components/jarilo-template', () => ({
    jariloHtml: () => jest.fn()
}))
jest.mock('../../../../components/database-search-bar/database-search', () => {
        return MockDatabaseSearchBarComponent
    }
)
jest.mock("../../../../pages/item-database/item-database/sidebar", () => () => {
    MockSidebar()
    return <div/>
})
jest.mock("../../../../pages/item-database/item-database/item-details", () => () => {
    MockItemDetails()
    return <div/>
})
function MockDatabaseSearchBarComponent({handler}: any) {
    return (
        <button data-testid={"test-handler"} onClick={() => handler({
            SKU: "test",
            _id: "",
            title: "test-title"
        })}/>
    )
}