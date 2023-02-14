import {GetServerSidePropsContext} from "next";
import StockReports, {getServerSideProps} from "../../../pages/reports";
import {renderWithProviders, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import {StockError} from "../../../server-modules/shop/shop";
import userEvent from "@testing-library/user-event";
import {schema} from "../../../types";

let query = {}
const mockRouter = jest.fn()
jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: query,
            push: mockRouter
        };
    },
}));

const mockIncorrectStock = jest.fn()
const mockItems = jest.fn()
const mockBrands = jest.fn()

let incorrectStock: StockError[] = [{
    BRAND: "Shimano",
    TITLE: "Fishing Stuff",
    SKU: "SKU-1",
    CHECKED: false,
    QTY: 3,
    PRIORITY: true
}, {
    BRAND: "Mainline",
    TITLE: "Fishing Things",
    SKU: "SKU-2",
    CHECKED: false,
    QTY: 3,
    PRIORITY: false
}]
jest.mock("../../../server-modules/shop/shop", () => ({
    getIncorrectStock: () => {
        mockIncorrectStock()
        return incorrectStock
    }
}))

jest.mock("../../../server-modules/items/items", () => ({
    getItems: () => {
        mockItems()
        let items:Pick<schema.Item, "_id" | "SKU" | "EAN" | "stock" | "title" | "stockTake">[] = [{
            _id: '61bc9d799b9e0cb72301fec4',
            SKU: 'AKA-AFLC13',
            EAN: '8032895083969',
            stock: {
                default: 0,
                minimum: 0,
                value: 0,
                warehouse: 0,
                total:9
            },
            title: 'AKASHI Fluorocarbon 13.2lb Line 100m',
            stockTake: {
                checked: true,
                date: 'Fri Sep 30 2022 15:52:08 GMT+0100 (British Summer Time)',
                quantity: 10
            }
        },
            {
                _id: '61bc9d7e9b9e0cb723020bff',
                SKU: 'AKA-AFLC8',
                EAN: '8032895083952',
                stock: {
                    default: 0,
                    minimum: 0,
                    value: 0,
                    warehouse: 0,
                    total:2
                },
                title: 'AKASHI Fluorocarbon 8.8lb Line 100m',
                stockTake: {
                    checked: false,
                    date: null,
                    quantity: 0
                }
            }]

        return items
    },
    getBrands: () => {
        mockBrands()
        return ['AFW', 'AKASHI', 'AXIA',]
    }
}))

let fetchReq: StockError | undefined = undefined
global.fetch = jest.fn(async (url, options) => {
    fetchReq = JSON.parse(options.body).data
    switch (url) {
        case "/api/incorrect-stock/incorrect-stock-adjust-and-mongo-clean-up":
            return {json: async () => ({acknowledged: true, deletedCount: 1})}
        case "/api/linnworks/update-stock-levels":
            return {json: async () => ([{SKU: "AKA-AFLC8", StockLevel: 0}])}
        default:
            return null
    }
}) as jest.Mock;

afterEach(()=>{
    jest.clearAllMocks()
})

describe("Stock Report serverSideProps tests", () => {
    test("Incorrect stock function is called on server side props", async () => {
        renderWithProviders(<StockReports/>)
        const context = {query: {tab: "incorrect-stock"}} as unknown as GetServerSidePropsContext
        await getServerSideProps(context)
        expect(mockIncorrectStock).toBeCalledTimes(1)
    })

    test("Get brands is called on server side props", async () => {
        renderWithProviders(<StockReports/>)
        const context = {query: {tab: "shop"}} as unknown as GetServerSidePropsContext
        await getServerSideProps(context)
        expect(mockBrands).toBeCalledTimes(1)
    })

    test("Get items is called on server side props", async () => {
        renderWithProviders(<StockReports/>)
        const context = {query: {brand: "Shimano"}} as unknown as GetServerSidePropsContext
        await getServerSideProps(context)
        expect(mockItems).toBeCalledTimes(1)
    })
})

describe("Stock Report tabs tests", () => {

    beforeEach(() => {
        query = {tab: "incorrect-stock"}
        renderWithProviders(<StockReports/>)
    })

    test("All tabs are rendered with links", () => {

        const links = screen.getAllByRole("link") as HTMLLinkElement[]

        expect(links[0].textContent).toStrictEqual("Incorrect Stock")
        expect(links[0].href).toMatch("/reports?tab=incorrect-stock")
        expect(links[1].textContent).toStrictEqual("Shop")
        expect(links[1].href).toMatch("/reports?tab=shop")
    })
})

describe("Incorrect Stock tab tests", () => {

    beforeEach(async () => {
        query = {tab: "incorrect-stock"}
        await waitFor(async () => {
            renderWithProviders(<StockReports/>)
        })
    })

    test("Renders IncorrectStockList and ZeroStockList components with data", async () => {

        await waitFor(async () => {
            const context = {query: {tab: "incorrect-stock"}} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })

        expect(screen.queryByTestId("incorrect-list-wrapper")).toBeInTheDocument()
        expect(screen.queryByTestId("zero-list-wrapper")).toBeInTheDocument()
        expect(screen.getByRole("button", {name: "Save"})).toBeInTheDocument()
        expect(screen.getByTestId("incorrect-list-brand").textContent).toBe("Shimano")
        expect(screen.getByTestId("incorrect-list-title").textContent).toBe("Fishing Stuff")
        expect(screen.getByTestId("incorrect-list-SKU").textContent).toBe("SKU-1")
        expect(screen.getByTestId("zero-list-brand").textContent).toBe("Mainline")
        expect(screen.getByTestId("zero-list-title").textContent).toBe("Fishing Things")
        expect(screen.getByTestId("zero-list-SKU").textContent).toBe("SKU-2")
    })

    test("Save button checks data is invalid before notification pop up", async () => {
        const user = userEvent.setup()
        await waitFor(async () => {
            const context = {query: {tab: "incorrect-stock"}} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })

        await user.type(screen.getAllByRole("textbox")[0], 'a')

        await waitFor(async () => {
            screen.getByRole('button', {name: "Save"}).click()
        })
        expect(await screen.findByText("Please enter only numbers in stock levels")).toBeInTheDocument()
    })

    test("Save button checks data is valid before API call and notification pop up", async () => {
        const user = userEvent.setup()

        await waitFor(async () => {
            const context = {query: {tab: "incorrect-stock"}} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })

        await user.type(screen.getAllByRole("textbox")[0], '{Backspace}5')
        await user.click(screen.getAllByRole("checkbox")[0])

        await waitFor(() => screen.getByRole('button', {name: "Save"}).click())
        expect(await screen.findByText("1 items updated")).toBeInTheDocument()
        expect(fetchReq).toEqual([{
            "BRAND": "Shimano",
            "CHECKED": true,
            "PRIORITY": true,
            "QTY": 5,
            "SKU": "SKU-1",
            "TITLE": "Fishing Stuff"
        }])
    })
})

describe("Stock Take tab tests", () => {

    test("Page loads correctly on Shop tab router query.", async () => {

        query = {tab: "shop"}
        await waitFor(async () => {
            renderWithProviders(<StockReports/>)
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })

        expect(screen.getByText("AFW")).toBeInTheDocument()
        expect(screen.getByText("AKASHI")).toBeInTheDocument()
        expect(screen.getByText("AXIA")).toBeInTheDocument()

    });

    test("Route changes on click.", async () => {

        query = {tab: "shop"}
        await waitFor(async () => {
            renderWithProviders(<StockReports/>)
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })

        await waitFor(() => screen.getByText("AFW").click())

        expect(mockRouter).toHaveBeenCalledWith({pathname: undefined, query: {brand: "AFW", tab: "shop"}})
    });

    test("Table loads when brandItems[] in slice contains items.", async () => {

        query = {tab: "shop", brand: "AKASHI"}
        await waitFor(async () => {
            renderWithProviders(<StockReports/>)
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })

        expect(screen.getByTestId("AKA-AFLC13")).toBeInTheDocument()
        expect(screen.getByTestId("AKA-AFLC13").childNodes[0]).toHaveTextContent("AKA-AFLC13")
        expect(screen.getByTestId("AKA-AFLC13").childNodes[1]).toHaveTextContent("8032895083969")
        expect(screen.getByTestId("AKA-AFLC13").childNodes[2]).toHaveTextContent("AKASHI Fluorocarbon 13.2lb Line 100m")
        expect(screen.getByTestId("AKA-AFLC13").childNodes[3]).toHaveTextContent("9")
        expect(screen.getByTestId("AKA-AFLC13").childNodes[4]).toHaveTextContent("10")
        expect(screen.getByTestId("AKA-AFLC13").childNodes[5].childNodes[0]).toHaveAttribute("type", "checkbox")
    })

    test("Loaded brand items correctly hide input if stockTake.date is not null", async () => {

        query = {tab: "shop", brand: "AKASHI"}
        await waitFor(async () => {
            renderWithProviders(<StockReports/>)
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })

        expect(screen.getByTestId("AKA-AFLC13").childNodes[4].childNodes.length === 0)
        expect(screen.getByTestId("AKA-AFLC8").childNodes[4].childNodes[0]).toHaveAttribute("pattern")
    })

    test("Check all button calculates and checks inputs correctly.", async () => {

        query = {tab: "shop", brand: "AKASHI"}
        await waitFor(async () => {
            renderWithProviders(<StockReports/>)
            const context = {query: query} as unknown as GetServerSidePropsContext
            await getServerSideProps(context)
        })

        let checkBox1 = screen.getByTestId("AKA-AFLC13").childNodes[5].childNodes[0] as HTMLInputElement
        let checkBox2 = screen.getByTestId("AKA-AFLC8").childNodes[5].childNodes[0] as HTMLInputElement

        await waitFor(() => screen.getByRole("button", {name: "Check All"}).click())
        await waitFor(() => expect(checkBox2).toBeChecked())

        expect(checkBox1.checked).toEqual(true)
        expect(checkBox2.checked).toEqual(true)

        await waitFor(() => screen.getByRole("button", {name: "Check All"}).click())
        await waitFor(() => expect(checkBox2).not.toBeChecked())

        expect(checkBox1.checked).toEqual(true)
        expect(checkBox2.checked).toEqual(false)
    })

    test("Commit button correctly disables inputs after click", async () => {

        query = {tab: "shop", brand: "AKASHI"}
        renderWithProviders(<StockReports/>)
        const context = {query: query} as unknown as GetServerSidePropsContext
        await waitFor(async () => getServerSideProps(context))

        let input = screen.getByTestId("AKA-AFLC8").childNodes[4].childNodes[0] as HTMLInputElement
        let checkBox = (await screen.findByTestId("AKA-AFLC8")).childNodes[5].childNodes[0] as HTMLInputElement

        await waitFor(async () => {
            checkBox.click()
            expect(checkBox).toBeChecked()
        })

        await waitFor(async () => {
            screen.getByRole("button", {name: "Commit"}).click()
            expect(input).not.toBeInTheDocument()
            expect(screen.getByTestId("AKA-AFLC8").childNodes[3].childNodes[0]).toHaveTextContent("0")
        })
    })
})