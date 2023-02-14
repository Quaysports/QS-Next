import {renderWithProviders} from "../../../../__mocks__/mock-store-wrapper";
import ShopTills, {getServerSideProps} from "../../../../pages/shop-tills";
import {GetServerSidePropsContext} from "next";
import {mockGetQuickLinks} from "../../../../__mocks__/quicklinks.mocks";
import {NextRouter} from "next/router";

jest.mock("../../../../server-modules/shop/shop", () => ({
    getQuickLinks: () => mockGetQuickLinks()
}))

let query = {}
const routeValue = jest.fn()
jest.mock("next/router", () => ({
    useRouter: () => ({
        query: query,
        push: (req: NextRouter) => {
            routeValue(req)
        }
    })
}));

describe("Shop tills serverside props tests", () => {
    test("GetQuicklinks is called if route contains ?tab=quick-links", async () => {
        renderWithProviders(<ShopTills/>)
        const context = {query: {tab: "quick-links"}} as unknown as GetServerSidePropsContext
        await getServerSideProps(context)
        expect(mockGetQuickLinks).toBeCalledTimes(1)
    })
})