import NewItemsLandingPage from "../../../pages/item-database/new-items";
import {render, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import userEvent from "@testing-library/user-event";
import {mockSupplierList, mockBrandList} from "../../../__mocks__/new-item-mocks";
import {getServerSideProps} from "../../../pages/item-database";
import {GetServerSidePropsContext} from "next";

const mockApi = jest.fn()
global.fetch = jest.fn(async(api:string) => {
    mockApi(api)
    return {
        json: async () => Promise.resolve(mockBrandList),
        status: 200
    }
}) as jest.Mock

jest.mock("../../../server-modules/items/items", () => ({
    getItem: () => {},
    getItems: () => []
}));

jest.mock("../../../server-modules/shop/shop-order-tool", () => ({
    getSuppliers: () => mockSupplierList,
}));

describe("New items tests",() => {
    test("Renders with correct inputs/selects", async () => {
        const context = {query:{tab:"new-items"}} as unknown as GetServerSidePropsContext
        await waitFor(() => {
            getServerSideProps(context)
        })
        render(<NewItemsLandingPage/>)
        let rowContainers = await screen.findAllByTestId("row-container")
        expect(rowContainers.length).toBe(10)
        userEvent.click(screen.getByRole("button", {name: "Add Rows"}))
        rowContainers = await screen.findAllByTestId("row-container")
        expect(rowContainers.length).toBe(20)
    });
    test("onChange events in elements working as expected and submit ", async () => {
        const context = {query:{tab:"new-items"}} as unknown as GetServerSidePropsContext

        await waitFor(() => {
            getServerSideProps(context)
        })
        render(<NewItemsLandingPage/>)

        const skuInputs = await screen.findAllByTestId("sku-input")
        const brandSelects = await screen.findAllByTestId("brand-select")
        const supplierSelects = await screen.findAllByTestId("supplier-select")
        const titleInputs = await screen.findAllByTestId("title-input")
        const qtyInputs = await screen.findAllByTestId("qty-input")
        const minimumSelects = await screen.findAllByTestId("minimum-select")
        const RRPInputs = await screen.findAllByTestId("rrp-input")
        const costPriceInputs = await screen.findAllByTestId("cost-price-input")
        const weightInputs = await screen.findAllByTestId("weight-input")
        const shippingSelects = await screen.findAllByTestId("shipping-select")
        const barcodeInputs = await screen.findAllByTestId("barcode-input")
        const filterSelects = await screen.findAllByTestId("filter-select")

        expect(screen.queryByTestId("brand-options")).toBeFalsy()

        await userEvent.selectOptions(supplierSelects[0],["Martin Cocks"])
        userEvent.selectOptions(filterSelects[0],["international"])
        userEvent.selectOptions(minimumSelects[0],["1"] )
        userEvent.selectOptions(shippingSelects[0],["RM Large Letter"] )

        let brands = await screen.findAllByTestId("brand-options")
        expect(brands.length).toBe(3)
        //expect(brandSelects[0].children.length).toBe(4)
        expect(mockApi).toHaveBeenCalledWith("api/item-database/get-supplier-brands")
        userEvent.selectOptions(brandSelects[0],["Gardner"])
        userEvent.type(titleInputs[0], "title input")
        userEvent.type(qtyInputs[0], "1")
        userEvent.type(RRPInputs[0], "2")
        userEvent.type(costPriceInputs[0], "3")
        userEvent.type(weightInputs[0], "4")
        userEvent.type(barcodeInputs[0], "5")
        userEvent.type(skuInputs[0], "sku input")
    });
})