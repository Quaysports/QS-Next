import {mockCompletedOrders, mockDeadStockReport} from "./shop-orders-data";
import ShopOrdersLandingPage, {getServerSideProps} from "../../../pages/shop-orders";
import {render, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import userEvent from '@testing-library/user-event'
import {GetServerSidePropsContext} from "next";
import '@testing-library/jest-dom'
import {beforeEach, describe} from "@jest/globals";

jest.mock("../../../server-modules/shop/shop", () => ({
    deadStockReport: () => mockDeadStockReport
}));

const mockOpenOrders = jest.fn()
jest.mock("../../../server-modules/shop/shop-order-tool", () => ({
    getCompleteOrders: () => mockCompletedOrders,
    getOpenOrders: () => mockOpenOrders()
}));

const mockRoute = jest.fn((route) => ({query: route.query}))
let query = {}
jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: (route: string) => {
                mockRoute(route)
            },
            query: query,
        };
    },
}));

describe("Tabs onClick tests", () => {
    beforeEach(async () => {
        jest.clearAllMocks()
    })
    test("Tab onClicks push to router with correct URL", async () => {
        const context = {query: {tab: ""}} as unknown as GetServerSidePropsContext
        await waitFor(() => {
            getServerSideProps(context)
            render(<ShopOrdersLandingPage/>)
        })
        await waitFor(() => screen.getByText("Orders").click())
        expect(mockRoute).toHaveBeenCalledWith("/shop-orders?tab=orders")
        await waitFor(() => screen.getByText("Completed Orders").click())
        expect(mockRoute).toHaveBeenCalledWith("/shop-orders?tab=completed-orders")
        await waitFor(() => screen.getByText("New Order").click())
        expect(mockRoute).toHaveBeenCalledWith("/shop-orders?tab=new-order")
        await waitFor(() => screen.getByText("Dead Stock").click())
        expect(mockRoute).toHaveBeenCalledWith("/shop-orders?tab=dead-stock")
    })
})
beforeEach(async () => {
    jest.clearAllMocks()
})

describe("Dead stock tab tests", () => {
    beforeEach(async () => {
        const context = {query: {tab: "dead-stock"}} as unknown as GetServerSidePropsContext
        await waitFor(() => {
            getServerSideProps(context)
        })
    })

    test("Dead stock sidebar renders correctly and onClicks call router with correct information", async () => {
        await waitFor(async () => {
            render(<ShopOrdersLandingPage/>)
            screen.getByText("FOX(2)").click()
            expect(mockRoute).toHaveBeenCalledWith({query: {index: '1'}})
        })
    })

    test("Dead stock functionality works and UI renders correctly", async () => {
        query = {tab: "dead-stock", index: 1}
        render(<ShopOrdersLandingPage/>)
        await waitFor(async () => {
            expect(screen.getByText("FOX-SKU-2")).toBeInTheDocument()
            expect(screen.queryByText("DRENNAN-SKU-2")).not.toBeInTheDocument()
        })
    })
})

describe("Completed orders tab tests", () => {
    beforeEach(async () => {
        const context = {query: {tab: "completed-orders"}} as unknown as GetServerSidePropsContext
        await waitFor(() => {
            getServerSideProps(context)
        })
    })

    test("Completed orders sidebar renders correctly and onClicks call router with correct information", () => {
        render(<ShopOrdersLandingPage/>)
        screen.getByText("Leeda(1)").click()
        expect(mockRoute).toHaveBeenCalledWith({query: {index: '1'}})
    })

    test("Select box available with correct dropdowns and fires onChange function correctly", async () => {
        query = {tab: "completed-orders", index: "1"}
        await waitFor(() => render(<ShopOrdersLandingPage/>))
        await waitFor(() => userEvent.selectOptions(
            screen.getByRole("combobox"),
            screen.getByRole('option', {name:"Some ID-123"})
        ))
        screen.debug()
        expect(screen.getByRole('option', {selected:true}).textContent).toBe("Some ID-123")
    })
})