import {render, screen, waitFor} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import ShopStockTake from "../../../pages/stock-reports/shop";
import {useRouter} from "next/router";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({acknowledged: true, deletedCount: 2}),
    })
) as jest.Mock;

jest.mock('next/router', () => ({useRouter: jest.fn()}))

const hydrateBrandsOnly = {
    incorrectStockReport: {},
    zeroStockReport: {},
    brands: ['AFW', 'AXIA'],
    brandItems: [],
    validData: true
}

test("Page loads correctly on Shop tab router query.", async () => {

    render(<ShopStockTake/>,{preloadedState:{"stockReports":hydrateBrandsOnly}})

    expect(screen.getByText("AFW")).toBeInTheDocument()
    expect(screen.getByText("AXIA")).toBeInTheDocument()
});

test("Route changes on click.", async () => {

    const router = { push: jest.fn() };

    (useRouter as jest.Mock).mockReturnValue(router)

    render(<ShopStockTake/>,{preloadedState:{"stockReports":hydrateBrandsOnly}})

    await waitFor(()=> screen.getByText("AFW").click())

    expect(router.push).toHaveBeenCalledWith({query:{brand:"AFW"}})
});


const hydrateBrandandBrandItems = {
    incorrectStockReport: {},
    zeroStockReport: {},
    brands: ['Akashi'],
    brandItems: [{
        _id: '61bc9d799b9e0cb72301fec4',
        SKU: 'AKA-AFLC13',
        EAN: '8032895083969',
        STOCKTOTAL: 9,
        TITLE: 'AKASHI Fluorocarbon 13.2lb Line 100m',
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
            STOCKTOTAL: 2,
            TITLE: 'AKASHI Fluorocarbon 8.8lb Line 100m',
            stockTake: {
                checked: false,
                date: null,
                quantity: 0
            }
        }],
    validData: true
}

test("Table loads when brandItems[] in slice contains items.", async () => {

    render(<ShopStockTake/>,{preloadedState:{"stockReports":hydrateBrandandBrandItems}})

    expect(screen.getByTestId("AKA-AFLC13")).toBeInTheDocument()
    expect(screen.getByTestId("AKA-AFLC13").childNodes[0]).toHaveTextContent("AKA-AFLC13")
    expect(screen.getByTestId("AKA-AFLC13").childNodes[1]).toHaveTextContent("8032895083969")
    expect(screen.getByTestId("AKA-AFLC13").childNodes[2]).toHaveTextContent("AKASHI Fluorocarbon 13.2lb Line 100m")
    expect(screen.getByTestId("AKA-AFLC13").childNodes[3]).toHaveTextContent("9")
    expect(screen.getByTestId("AKA-AFLC13").childNodes[4]).toHaveTextContent("10")
    expect(screen.getByTestId("AKA-AFLC13").childNodes[5].childNodes[0]).toHaveAttribute("type","checkbox")
})

test("Loaded brand items correctly hide input if stockTake.date is not null", async () => {

    render(<ShopStockTake/>,{preloadedState:{"stockReports":hydrateBrandandBrandItems}})

    expect(screen.getByTestId("AKA-AFLC13").childNodes[4].childNodes.length === 0)
    expect(screen.getByTestId("AKA-AFLC8").childNodes[4].childNodes[0]).toHaveAttribute("pattern")
})

test("Check all button calculates and checks inputs correctly.", async()=>{
    render(<ShopStockTake/>,{preloadedState:{"stockReports":hydrateBrandandBrandItems}})

    let checkBox1 = screen.getByTestId("AKA-AFLC13").childNodes[5].childNodes[0] as HTMLInputElement
    let checkBox2 = screen.getByTestId("AKA-AFLC8").childNodes[5].childNodes[0] as HTMLInputElement

    await waitFor(()=> screen.getByRole("button", {name:"Check All"}).click())
    await waitFor(()=> expect(checkBox2).toBeChecked())

    expect(checkBox1.checked).toEqual(true)
    expect(checkBox2.checked).toEqual(true)

    await waitFor(()=> screen.getByRole("button", {name:"Check All"}).click())
    await waitFor(()=> expect(checkBox2).not.toBeChecked())

    expect(checkBox1.checked).toEqual(true)
    expect(checkBox2.checked).toEqual(false)
})

test("Commit button correctly disables inputs after click", async()=>{
    render(<ShopStockTake/>,{preloadedState:{"stockReports":hydrateBrandandBrandItems}})

    let input = screen.getByTestId("AKA-AFLC8").childNodes[4].childNodes[0] as HTMLInputElement
    let checkBox = screen.getByTestId("AKA-AFLC8").childNodes[5].childNodes[0] as HTMLInputElement

    await waitFor(()=> checkBox.click())
    await waitFor(()=> expect(checkBox).toBeChecked())

    await waitFor(()=> screen.getByRole("button", {name:"Commit"}).click())
    await waitFor(()=> expect(input).not.toBeInTheDocument())

})