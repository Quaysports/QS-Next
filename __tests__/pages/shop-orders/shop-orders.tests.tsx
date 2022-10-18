import {mockCompletedOrders, mockDeadStockReport, mockOrdersState} from "./shop-orders-data";
import ShopOrdersLandingPage, {getServerSideProps} from "../../../pages/shop-orders";
import {render, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import userEvent from '@testing-library/user-event'
import {GetServerSidePropsContext} from "next";
import '@testing-library/jest-dom'
import {beforeEach, describe} from "@jest/globals";

global.fetch = jest.fn(async () => {
    return {json: async () => ({res:"ok"})}
}) as jest.Mock;

jest.mock("../../../server-modules/shop/shop", () => ({
    deadStockReport: () => mockDeadStockReport
}));

jest.mock("../../../server-modules/shop/shop-order-tool", () => ({
    getCompleteOrders: () => mockCompletedOrders,
    getOpenOrders: () => mockOrdersState
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
            await waitFor(() => screen.getByText("FOX(2)").click())
            expect(mockRoute).toHaveBeenCalledWith({query: {index: '1', brand: "All Items"}})
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

    test("Completed orders sidebar renders correctly and onClicks call router with correct information", async () => {
        query = {tab: "completed-orders"}
        render(<ShopOrdersLandingPage/>)
        await waitFor(() => screen.getByText("Completed Orders").click())
        screen.getByText("Leeda(1)").click()
        expect(mockRoute).toHaveBeenCalledWith({query: {index: '1', brand: "All Items", tab: "completed-orders"}})
    })

    test("Select box available with correct dropdowns and fires onChange function correctly", async () => {
        query = {tab: "completed-orders", index: "1"}
        await waitFor(() => render(<ShopOrdersLandingPage/>))
        expect(screen.queryByText("SKU-7")).toBeFalsy()
        expect(screen.queryByText("SKU-1")).toBeFalsy()
        await waitFor(() => userEvent.selectOptions(
            screen.getByRole("combobox"),
            screen.getByRole('option', {name:"Some ID-123"})
        ))
        expect(screen.queryByText("SKU-7")).toBeFalsy()
        expect(screen.getByText("SKU-1")).toBeInTheDocument()
    })
})

describe("Orders tab tests", () => {
    beforeEach(async () => {
        const context = {query: {tab:"orders"}} as unknown as GetServerSidePropsContext
        await waitFor(() => {
            getServerSideProps(context)
        })
    })
    test("Orders side bar loads up when orders tab is assigned",async () => {
        query = {tab: "orders"}
        await waitFor(() => render(<ShopOrdersLandingPage/>))
        expect(screen.getByText("2 - Wychwood(22-43-45)")).toBeInTheDocument()
        screen.getByText("2 - Wychwood(22-43-45)").click()
        expect(mockRoute).toHaveBeenCalledWith({query:{tab:"orders", index: "1", brand:"All Items"}})
    })
    test("Renders the selected order and edit order button works as expected", () => {
        query = {tab:"orders", index: "1"}
        render(<ShopOrdersLandingPage/>)
        expect(screen.getByText("WYCHWOOD-SKU-2")).toBeInTheDocument()
        expect(screen.getByText("WYCHWOOD-SKU-1")).toBeInTheDocument()
        expect(screen.queryByText("SWIFT-SKU-1")).toBeFalsy()
        screen.getByRole("button", {name: "Edit Order"}).click()
        expect(mockRoute).toHaveBeenCalledWith({pathname:"/shop-orders", query:{tab:"new-order", editOrder:"1", brand: "All Items"}})
    })
    test("Buttons to move items from order to arrived work", async () => {
        query = {tab:"orders", index: "1"}
        render(<ShopOrdersLandingPage/>)
        let buttons = await screen.findAllByRole("button", {name: "⇅"})
        let inputs = await screen.findAllByRole("textbox")
        expect(screen.queryByText("Please increase the amount that has arrived")).toBeFalsy()
        await waitFor(() => buttons[0].click())
        expect(screen.getByText("Please increase the amount that has arrived")).toBeInTheDocument()
        await waitFor(() => screen.getByRole("button", {name:"Ok"}).click())
        userEvent.clear(inputs[0])
        userEvent.type(inputs[0], "3")
        expect(screen.queryByText("More have arrived than were ordered, please increase the order amount or check the amount that have arrived")).toBeFalsy()
        await waitFor(() => buttons[0].click())
        expect(screen.getByText("More have arrived than were ordered, please increase the order amount or check the amount that have arrived")).toBeInTheDocument()
        await waitFor(() => screen.getByRole("button", {name:"Ok"}).click())
        userEvent.clear(inputs[0])
        userEvent.type(inputs[0], "1")
        expect(screen.queryByText("Did only part of the order arrive?")).toBeFalsy()
        await waitFor(() => buttons[0].click())
        expect(screen.getByText("Did only part of the order arrive?")).toBeInTheDocument()
        await waitFor(() => screen.getByRole("button", {name:"Yes"}).click())
        let SKUs = await screen.findAllByText("WYCHWOOD-SKU-2")
        expect(SKUs.length).toBe(2)
    })
    /*  userEvent.type(inputs[0], "2")
        await waitFor(() => buttons[0].click())*/
})