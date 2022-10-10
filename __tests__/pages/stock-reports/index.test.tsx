import {GetServerSidePropsContext} from "next";
import StockReports, {getServerSideProps} from "../../../pages/stock-reports";
import {render} from "../../mock-store-wrapper";

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

const mockIncorrectStock = jest.fn()
const mockItems = jest.fn()
const mockBrands = jest.fn()

jest.mock("../../../server-modules/shop/shop", () => ({
    getIncorrectStock: () =>  mockIncorrectStock()
}))

jest.mock("../../../server-modules/items/items",()=>({
    getItems: () =>  mockItems(),
    getBrands: () =>  mockBrands()
}))

test("Incorrect stock function is called on server side props", async () => {
    render(<StockReports/>)
    const context = {query:{tab:"incorrect-stock"}} as unknown as GetServerSidePropsContext
    await getServerSideProps(context)
    expect(mockIncorrectStock).toBeCalledTimes(1)
})

test("Get brands is called on server side props", async () => {
    render(<StockReports/>)
    const context = {query:{tab:"shop"}} as unknown as GetServerSidePropsContext
    await getServerSideProps(context)
    expect(mockBrands).toBeCalledTimes(1)
})

test("Get items is called on server side props", async () => {
    render(<StockReports/>)
    const context = {query:{brand:"Shimano"}} as unknown as GetServerSidePropsContext
    await getServerSideProps(context)
    expect(mockItems).toBeCalledTimes(1)
})