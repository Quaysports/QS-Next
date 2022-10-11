import StockReportTabs from "../../../pages/stock-reports/tabs";
import {render, screen} from "../../../__mocks__/mock-store-wrapper";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {tab:"incorrect-stock"},
            asPath: "",
        };
    },
}));

test("All tabs are rendered with links", () => {
    render(<StockReportTabs/>)

    const links = screen.getAllByRole("link") as HTMLLinkElement[]

    expect(links[0].textContent).toStrictEqual("Incorrect Stock")
    expect(links[0].href).toMatch("/stock-reports?tab=incorrect-stock")
    expect(links[1].textContent).toStrictEqual("Shop")
    expect(links[1].href).toMatch("/stock-reports?tab=shop")
})