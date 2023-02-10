import SalesReportTable from "../../../../pages/reports/sales/table";
import {fireEvent, mockStore, renderWithProviders, screen, waitFor} from "../../../../__mocks__/mock-store-wrapper";
import {setFirstYearAndLastYear} from "../../../../store/reports/sales-slice";

let mockPush = jest.fn();
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/reports",
            pathname: "/reports",
            query: {tab: "sales"},
            asPath: "/",
            push: (route: any) => {
                mockPush(route)
            }
        };
    }
}))

describe("Sales Report Table", () => {

    const firstYear = new Date(1624360419835).getFullYear()
    const lastYear = new Date(1675695034931).getFullYear()

    const yearCases = []
    for (let i = firstYear; i <= lastYear; i++) {
        yearCases.push([i.toString(), i === lastYear])
    }

    beforeEach(() => {
        mockStore.dispatch(setFirstYearAndLastYear({firstYear: "1624360419835", lastYear: "1675695034931"}))
        renderWithProviders(<SalesReportTable/>)
    })

    afterEach(() => {
        mockPush.mockReset();
    })

    test.each(yearCases)("Year select should render", async (year, value) => {
        expect(screen.getByRole<HTMLOptionElement>("option", {name: year as string}).selected).toEqual(value);
    })

    test("Year select should change route on change", async () => {
        await waitFor(() =>
            fireEvent.change(screen.getByRole<HTMLSelectElement>("year-select"), {target: {value: "2022"}}))
        expect(mockPush).toBeCalledWith({pathname: "/reports", query: {tab: "sales", year: "2022"}});
    })

    const monthCases = [["", true], ["January",false], ["February",false], ["March",false], ["April",false],
        ["May",false], ["June",false], ["July",false], ["August",false], ["September",false], ["October",false],
        ["November",false], ["December",false]]

    test.each(monthCases)("Month select should render", async (month, value) => {
        expect(screen.getByRole<HTMLOptionElement>("option", {name: month as string}).selected).toEqual(value);
    })

    test("Month select should change route on change", async () => {
        await waitFor(() =>
            fireEvent.change(screen.getByRole<HTMLSelectElement>("month-select"), {target: {value: 4}}))
        expect(mockPush).toBeCalledWith({pathname: "/reports", query: {tab: "sales", month: 4}});
    })

    test("Month select should remove month from route if empty string", async () => {
        await waitFor(() =>
            fireEvent.change(screen.getByRole<HTMLSelectElement>("month-select"), {target: {value: ""}}))
        expect(mockPush).toBeCalledWith({pathname: "/reports", query: {tab: "sales"}});
    })

    test("Changing year should reset month",async () => {
        await waitFor(() => {
            fireEvent.change(screen.getByRole<HTMLSelectElement>("month-select"), {target: {value:4}})
            fireEvent.change(screen.getByRole<HTMLSelectElement>("year-select"), {target: {value: "2021"}})
        })
        expect(mockPush).toBeCalledWith({pathname: "/reports", query: {tab: "sales", year: "2021"}});
    })
})