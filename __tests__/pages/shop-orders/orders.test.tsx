import OrderInformation from "../../../pages/shop-orders/orders/order-information";
import {render, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import {ShopOrdersState} from "../../../store/shop-orders-slice";
import "@testing-library/jest-dom"

const initialState: ShopOrdersState = {
    deadStock: {},
    sideBarContent: {},
    sideBarTitle: "",
    loadedOrder:  {
        _id: "Anything",
        arrived: [],
        complete: false,
        date: 12345,
        id: "Some ID",
        price: 5,
        order: [],
        supplier: "Some Supplier"
    },
    openOrders: null,
    editOrder: null,
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


let mockData = jest.fn()
global.fetch = jest.fn(async() => mockData()) as jest.Mock;

const mockNotification = jest.fn()

jest.mock("../../../server-modules/dispatch-notification", () => ({
    dispatchNotification: (info: any) => {
        if(info.type === "confirm") info.fn()
        if(info.type === "alert") mockNotification(info)
    }
}))

const mockFilter = jest.fn()

test("Order information renders correctly", async () => {
    render(<OrderInformation supplierFilter={() => mockFilter()}/>, {preloadedState: {"shopOrders": initialState}})
    expect(await screen.findByText("ID: Some Supplier(Some ID)")).toBeInTheDocument()
    expect(await screen.findByText("Cost: £5")).toBeInTheDocument()
    expect(await screen.findByText("Download CSV")).toBeInTheDocument()
})

test("Order information delete button successful functionality works as expected", async () => {
    render(<OrderInformation supplierFilter={() => mockFilter()}/>, {preloadedState: {"shopOrders": initialState}})
    mockData.mockImplementation(()=>({ok:true}))
    await waitFor(() => screen.getByRole("button", {name:"Delete Order"}).click())
    await waitFor(() => expect(mockNotification).toHaveBeenCalledWith({type:"alert", title: "Success", content:"Some Supplier(Some ID) has been deleted"}))
})

test("Order information delete button failed functionality works as expected", async () => {
    render(<OrderInformation supplierFilter={() => mockFilter()}/>, {preloadedState: {"shopOrders": initialState}})
    mockData.mockImplementation(()=>({ok:false}))
    await waitFor(() => screen.getByRole("button", {name:"Delete Order"}).click())
    await waitFor(() => expect(mockNotification).toHaveBeenCalledWith({type:"alert", title: "Failed", content:"Error, please contact IT"}))
})