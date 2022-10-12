import OrderInformation from "../../../pages/shop-orders/orders/order-information";
import {render, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import {ShopOrdersState} from "../../../store/shop-orders-slice";
import "@testing-library/jest-dom"
import SubmitToLinnworksButtons from "../../../pages/shop-orders/orders/submit-to-linnworks-buttons";

afterEach(() => {
    jest.clearAllMocks();
});

let initialState: ShopOrdersState = {
    deadStock: {},
    sideBarContent: {},
    sideBarTitle: "",
    loadedOrder: {
        _id: "Anything",
        arrived: [{
            IDBEP: {BRAND: "Brand"},
            MINSTOCK: 2,
            SKU: "SKU-1",
            STOCKTOTAL: "3",
            TITLE: "Some Title",
            SUPPLIER: "Some Supplier",
            _id: "sdg",
            qty: 2,
            tradePack: 1,
            PURCHASEPRICE: 2,
            newProduct: false,
            submitted: false,
            SOLDFLAG: 3
        }],
        complete: false,
        date: 12345,
        id: "Some ID",
        price: 5,
        order: [{
            IDBEP: {BRAND: "Brand"},
            MINSTOCK: 2,
            SKU: "SKU-1",
            STOCKTOTAL: "3",
            TITLE: "Some Title",
            SUPPLIER: "Some Supplier",
            _id: "sdg",
            qty: 2,
            tradePack: 1,
            PURCHASEPRICE: 2,
            newProduct: false,
            submitted: false,
            SOLDFLAG: 3
        }],
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

let mockDeleteButtonCall = jest.fn()
const mockLinnworksCall = jest.fn()
global.fetch = jest.fn(async (req) =>{
    if(req === "/api/shop-orders/adjust-stock") {
        return {json: async () => ([{SKU: "SKU-1", StockLevel: 5}] as linn.ItemStock[])}
    }
    if(req === "/api/shop-orders/shop-stock-order") {
        return mockLinnworksCall()
    }
    if(req === "/api/shop-orders/delete-order") {
        return mockDeleteButtonCall()
    }

}) as jest.Mock;

const mockNotification = jest.fn()

jest.mock("../../../server-modules/dispatch-notification", () => ({
    dispatchNotification: (info: any) => {
        if (info.type === "confirm") {
            mockNotification()
            info.fn()
        }
        if (info.type === "alert") mockNotification(info)
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
    mockDeleteButtonCall.mockImplementation(() => ({ok: true}))
    await waitFor(() => screen.getByRole("button", {name: "Delete Order"}).click())
    await waitFor(() => expect(mockNotification).toHaveBeenCalledWith({
        type: "alert",
        title: "Success",
        content: "Some Supplier(Some ID) has been deleted"
    }))
})

test("Order information delete button failed functionality works as expected", async () => {
    render(<OrderInformation supplierFilter={() => mockFilter()}/>, {preloadedState: {"shopOrders": initialState}})
    mockDeleteButtonCall.mockImplementation(() => ({ok: false}))
    await waitFor(() => screen.getByRole("button", {name: "Delete Order"}).click())
    await waitFor(() => expect(mockNotification).toHaveBeenCalledWith({
        type: "alert",
        title: "Failed",
        content: "Error, please contact IT"
    }))
})

test("Submit to linnworks button calls fetch api", async () => {
    render(<SubmitToLinnworksButtons supplierFilter={() => mockFilter()}/>, {preloadedState: {"shopOrders": initialState}})
    screen.getByRole("button", {name:"Submit To Linnworks"}).click()
    await waitFor(() => expect(mockLinnworksCall).toHaveBeenCalledTimes(1))
})

test("Submit to linnworks button error and calls dispatch notification", async () => {
    initialState.loadedOrder!.arrived[0].qty = 0
    render(<SubmitToLinnworksButtons supplierFilter={() => mockFilter()}/>, {preloadedState: {"shopOrders": initialState}})
    screen.getByRole("button", {name:"Submit To Linnworks"}).click()
    await waitFor(() => expect(mockNotification).toHaveBeenCalledWith({type:"alert", title: "Error", content:"Nothing to book in! Check for zero ordered quantities"}))
})

test("Complete order button calls dispatch notification and fetch api ", async () => {
    await waitFor(() => render(<SubmitToLinnworksButtons supplierFilter={() => mockFilter()}/>, {preloadedState: {"shopOrders": initialState}}))
    await waitFor(() => screen.getByRole("button", {name:"Complete Order"}).click())
    expect(mockLinnworksCall).toHaveBeenCalledTimes(1)
    expect(mockNotification).toHaveBeenCalledTimes(1)
})

test("Complete order button calls fetch api but not notification ", async () => {
    initialState.loadedOrder!.order = []
    await waitFor(() => render(<SubmitToLinnworksButtons supplierFilter={() => mockFilter()}/>, {preloadedState: {"shopOrders": initialState}}))
    await waitFor(() => screen.getByRole("button", {name:"Complete Order"}).click())
    expect(mockLinnworksCall).toHaveBeenCalledTimes(1)
    expect(mockNotification).toHaveBeenCalledTimes(0)
})

test("")