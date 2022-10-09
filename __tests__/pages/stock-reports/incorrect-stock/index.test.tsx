import {fireEvent, render, screen} from "../../../mock-store-wrapper"
import '@testing-library/jest-dom'
import IncorrectStock from "../../../../pages/stock-reports/incorrect-stock";
import {waitFor} from "@testing-library/react";


//TODO add tests to check checkbox functionality and input validity checks


global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({acknowledged: true, deletedCount: 2}),
    })
) as jest.Mock;

const mockNotification = jest.fn()
jest.mock("../../../../server-modules/dispatch-notification", () => ({dispatchNotification: (info: any) => {
    mockNotification(info)
    }}))

test("does not render IncorrectStockList and ZeroStockList components", () => {
    const initialState = {
        incorrectStockReport: {},
        zeroStockReport: {},
        brands: [],
        brandItems: [],
        validData: true,
    }

    render(<IncorrectStock/>, {preloadedState: {stockReports: initialState}})
    expect(screen.queryByTestId("incorrect-list-wrapper")).not.toBeInTheDocument()
    expect(screen.queryByTestId("zero-list-wrapper")).not.toBeInTheDocument()
    expect(screen.getByRole("button", {name: "Save"})).toBeInTheDocument()
})

test("renders IncorrectStockList and ZeroStockList components with data", () => {
    const initialState = {
        incorrectStockReport: {
            Shimano: [{
                BRAND: "Shimano",
                TITLE: "Fishing Stuff",
                SKU: "SKU-1",
                CHECKED: false,
                QTY: 3,
                PRIORITY: true
            }]
        },
        zeroStockReport: {
            Mainline: [{
                BRAND: "Mainline",
                TITLE: "Fishing Things",
                SKU: "SKU-2",
                CHECKED: false,
                QTY: 3,
                PRIORITY: false
            }]
        },
        brands: [],
        brandItems: [],
        validData: true,
    }

    render(<IncorrectStock/>, {preloadedState: {stockReports: initialState}})
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

test("Save button checks data is invalid before notification pop up", () => {

    const initialState = {
        incorrectStockReport: {},
        zeroStockReport: {},
        brands: [],
        brandItems: [],
        validData: false,
    }

    render(<IncorrectStock/>, {preloadedState: {stockReports: initialState}})
    const button = screen.getByRole('button', {name: "Save"})
    fireEvent.click(button)
    expect(mockNotification).toHaveBeenCalledWith({
        type: "alert",
        title: "Error",
        content: "Please enter only numbers in stock levels"
    })
})

test("Save button checks data is valid before API call and notification pop up", async() => {
    const initialState = {
        incorrectStockReport: {
            Shimano: [{
                BRAND: "Shimano",
                TITLE: "Fishing Stuff",
                SKU: "SKU-1",
                CHECKED: true,
                QTY: 3,
                PRIORITY: true
            }],
            Mainline: [{
                BRAND: "Mainline",
                TITLE: "Fishing Things",
                SKU: "SKU-2",
                CHECKED: false,
                QTY: 3,
                PRIORITY: true
            }]
        },
        zeroStockReport: {
            Mainline: [{
                BRAND: "Mainline",
                TITLE: "Fishing Things",
                SKU: "SKU-2",
                CHECKED: true,
                QTY: 3,
                PRIORITY: false
            }],
            Shimano: [{
                BRAND: "Shimano",
                TITLE: "Fishing Stuff",
                SKU: "SKU-1",
                CHECKED: false,
                QTY: 3,
                PRIORITY: false
            }]
        },
        brands: [],
        brandItems: [],
        validData: true,
    }
    const wrapper = render(<IncorrectStock/>,{preloadedState: {stockReports: initialState}})
    const button = screen.getByRole('button', {name: "Save"})
    fireEvent.click(button)
    expect(wrapper.store?.getState()).not.toContain({
        "stockReports": {"incorrectStockReport": {"Shimano": [{"BRAND": "Shimano", "CHECKED": true, "PRIORITY": true, "QTY": 3, "SKU": "SKU-1", "TITLE": "Fishing Stuff"}], "Mainline": []}, "zeroStockReport": {"Shimano": [], "Mainline": [{"BRAND": "Mainline", "CHECKED": true, "PRIORITY": false, "QTY": 3, "SKU": "SKU-2", "TITLE": "Fishing Things"}]}}
    });
    await waitFor(() => {
        expect( mockNotification).toHaveBeenCalledWith({
            type: "alert",
            title: "Stock Update",
            content: "2 items updated"
        })
    })
})