import {render, waitFor} from "../../../__mocks__/mock-store-wrapper";
import {GetServerSidePropsContext} from "next";
import ShopOrdersLandingPage, {getServerSideProps} from "../../../pages/shop-orders";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([{
            _id: "Brand",
            arrived: [],
            complete: false,
            date: 23421,
            id: "anything",
            price: 2,
            order: [],
            supplier: "Supplier"
        }])
    })
) as jest.Mock;

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {},
            asPath: "",
        };
    },
}));

const mockDeadStock = jest.fn()
jest.mock("../../../server-modules/shop/shop", () => ({
    deadStockReport: () => mockDeadStock()
}));

const mockCompleteOrders = jest.fn()
jest.mock("../../../server-modules/shop/shop-order-tool", () => ({
    getCompleteOrders: () => mockCompleteOrders()
}));

afterEach(() => {
    jest.clearAllMocks();
});

test("Complete orders function is not called on server side props when tab is 'dead-stock'", async () => {
    await waitFor(() => render(<ShopOrdersLandingPage/>))
    mockDeadStock.mockImplementation(() => [{SUPPLIER: "Mainline", SKU: "this", TITLE: "Fishing Stuff", SOLDFLAG: 0}])
    const context = {query: {tab: "dead-stock"}} as unknown as GetServerSidePropsContext
    await waitFor(() => getServerSideProps(context))
    expect(mockDeadStock).toHaveBeenCalledTimes(1);
    expect(mockCompleteOrders).toHaveBeenCalledTimes(0);
});

test("Complete orders function is called on server side props when tab is 'complete-orders'", async () => {
    await waitFor(() => render(<ShopOrdersLandingPage/>))
    mockCompleteOrders.mockImplementation(() => [{_id: "Brand", arrived: [], complete: false, date: 23421, id: "anything", price: 2, order: [], supplier: "Supplier"}])
    mockDeadStock.mockImplementation(() => [{SUPPLIER: "Mainline", SKU: "this", TITLE: "Fishing Stuff", SOLDFLAG: 0}])
    const context = {query: {tab: "completed-orders"}} as unknown as GetServerSidePropsContext
    await waitFor(() => getServerSideProps(context))
    expect(mockDeadStock).toHaveBeenCalledTimes(1);
    expect(mockCompleteOrders).toHaveBeenCalledTimes(1);
});