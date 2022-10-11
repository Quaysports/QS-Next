import {render, screen, fireEvent} from "../../../__mocks__/mock-store-wrapper";
import ShopOrdersTabs from "../../../pages/shop-orders/tabs";
import {ShopOrdersState} from "../../../store/shop-orders-slice";

const mockPush = jest.fn()
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {},
            asPath: "",
            push: (info: any) => mockPush(info)
        };
    },
}));

const mockNotification = jest.fn()
jest.mock("../../../server-modules/dispatch-notification", () => ({
    dispatchNotification: (info: any) => {
        mockNotification(info)
    }
}))

test("All tabs are rendered with clickable links", () => {
    render(<ShopOrdersTabs/>)
    const orders = screen.getByText('Orders')
    const completedOrders = screen.getByText('Completed Orders')
    const newOrders = screen.getByText('New Order')
    const deadStock = screen.getByText('Dead Stock')

    fireEvent.click(orders)
    expect(mockPush).toHaveBeenCalledWith("/shop-orders?tab=orders")
    fireEvent.click(completedOrders)
    expect(mockPush).toHaveBeenCalledWith("/shop-orders?tab=completed-orders")
    fireEvent.click(newOrders)
    expect(mockPush).toHaveBeenCalledWith("/shop-orders?tab=new-order")
    fireEvent.click(deadStock)
    expect(mockPush).toHaveBeenCalledWith("/shop-orders?tab=dead-stock")
})

test("Notification is being called correctly", () => {
    const initialState: ShopOrdersState = {
        deadStock: {},
        sideBarContent: {},
        sideBarTitle: "",
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
    render(<ShopOrdersTabs/>, {preloadedState: {"shopOrders": initialState}})
    fireEvent.click(screen.getByText('Orders'))
    expect(mockNotification).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledTimes(0)
})
//TODO test the edit order functionality