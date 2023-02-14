import {renderWithProviders, fireEvent, screen} from "../../../../__mocks__/mock-store-wrapper";
import ItemDatabaseLandingPage from "../../../../pages/item-database/item-database";

const mockPush = jest.fn()
jest.mock('next/router', () => ({
    useRouter: () => {
        return {
            push: (e: string) => mockPush(e)
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
function MockDatabaseSearchBarComponent({handler}:any){
    return (
        <button data-testId={"test-handler"} onClick={() => handler({
        SKU: "test",
        _id: "",
        title: "test-title"
    })}/>
    )
}

describe('item database index page tests', () => {
    test('search options pushes to router', () => {
        renderWithProviders(<ItemDatabaseLandingPage/>)
        fireEvent.click(screen.getByTestId('test-handler'))
        expect(mockPush).toBeCalledWith({pathname:undefined, query:{sku:'test'}})
    })
})
