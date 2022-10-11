import {render, screen} from "../../../__mocks__/mock-store-wrapper";
import SideBar from "../../../pages/shop-orders/sidebar/sidebar";
import {ShopOrdersState} from "../../../store/shop-orders-slice";
import "@testing-library/jest-dom"

const mockFilter = jest.fn()

test("Side bar renders elements correctly", async () => {

    const initialState: ShopOrdersState = {
        deadStock: {},
        sideBarContent: {"Martin Cocks": 3, Shimano: "13"},
        sideBarTitle: "Orders",
        loadedOrder: null,
        openOrders: null,
        editOrder: {
            _id: "",
            arrived: [],
            complete: true,
            date: 1,
            id: "",
            price: 1,
            order: [],
            supplier: ""
        },
        newOrderArray: [],
        totalPrice: 0,
        supplierItems: [],
        radioButtons: {
            lowStock: true,
            allItems: false
        },
        renderedArray: [],
        lowStockArray: [],
        threshold: 50,
        completedOrders: null,
        orderContents: null
    }
    render(<SideBar supplierFilter={(x) => mockFilter(x)}/>,{preloadedState:{"shopOrders": initialState}})
    expect(await screen.findByText("Orders")).toBeInTheDocument()
    screen.getByText("Martin Cocks(3)").click()
    expect(mockFilter).toHaveBeenCalledWith("Martin Cocks")
})