import {fireEvent, renderWithProviders, screen, waitFor} from "../../../../__mocks__/mock-store-wrapper";
import SalesSidebar from "../../../../pages/reports/sales/sidebar";

let mockPush = jest.fn();
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/reports",
            pathname: "/reports",
            query: {tab: "sales", location: "shop"},
            asPath: "/",
            push: (route: string) => {
                mockPush(route)
            }
        };
    },
}))
describe("Location Select", () => {
    it("should render", () => {
        renderWithProviders(<SalesSidebar />);
        expect( screen.getByRole<HTMLOptionElement>("option", {name: "Shop"}).selected).toBeTruthy();
    });

    it("it should change route on change", async () => {
        renderWithProviders(<SalesSidebar/>);
        const select = screen.getByRole<HTMLSelectElement>("combobox");
        await waitFor(() => fireEvent.change(select, {target: {value: "online"}}))
        expect(mockPush).toBeCalledWith({pathname: "/reports", query: {tab: "sales", location: "online"}});
    })
})