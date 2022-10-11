import {render, screen} from "../../../__mocks__/mock-store-wrapper";
import ShopOrdersTabs from "../../../pages/shop-orders/tabs";
import {fireEvent} from "@testing-library/dom";

const mockPush = jest.fn()
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {},
            asPath: "",
            push: (info:any) => mockPush(info)
        };
    },
}));

test("All tabs are rendered with links", () => {
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

//TODO test the edit order functionality