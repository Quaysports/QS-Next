import {fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import IncorrectStock from "../../../../pages/stock-reports/incorrect-stock";
import {renderWithProviders} from "./new-index.test";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({acknowledged: true, deletedCount: 2}),
    })
) as jest.Mock;

const mockDispatch = jest.fn()
jest.mock("react-redux", () => ({
    useSelector: (reducer: any) => {
        if (reducer.name === "selectIncorrectStockState") {
            return ({
                Shimano: [{
                    BRAND: "Shimano",
                    TITLE: "Fishing Stuff",
                    SKU: "SKU-1",
                    CHECKED: true,
                    QTY: 2,
                    PRIORITY: true
                }]
            })
        }

        if (reducer.name === "selectZeroStockState") {
            return ({
                Mainline: [{
                    BRAND: "Mainline",
                    TITLE: "Fishing Things",
                    SKU: "SKU-2",
                    CHECKED: true,
                    QTY: 4,
                    PRIORITY: false
                }]
            })
        }
        if (reducer.name === "selectValidData") {
            return true

        }
    },
    useDispatch: () => mockDispatch
}))

const mockNotification = jest.fn()
jest.mock("../../../../server-modules/dispatch-notification", () => ({dispatchNotification: (info:any) => mockNotification(info)}))

test("renders IncorrectStockList and ZeroStockList components", () => {
    renderWithProviders(<IncorrectStock/>,{})
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
    render(<IncorrectStock/>)
    const button = screen.getByRole('button', {name: "Save"})
    fireEvent.click(button)
    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockNotification).toHaveBeenCalledWith({
            type: "alert",
            title: "Error",
            content: "Please enter only numbers in stock levels"
    })
})

test("Save button checks data is valid before API call and notification pop up", () => {
    render(<IncorrectStock/>)
    const button = screen.getByRole('button', {name: "Save"})
    fireEvent.click(button)
    expect(mockDispatch).toHaveBeenCalledWith({
        "payload": {"amount": 1, "brand": "Mainline", "index": 0},
        "type": "stockReports/setZeroStockSplice"
    });
    expect(mockDispatch).toHaveBeenCalledWith({
        "payload": {"amount": 1, "brand": "Shimano", "index": 0},
        "type": "stockReports/setIncorrectStockSplice"
    })
    expect(mockDispatch).toHaveBeenCalledTimes(4)
    expect(mockNotification).toHaveBeenCalledWith({
            type: "alert",
            title: "Stock Update",
            content: "2 items updated"
        })
})