import {render} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import ShopTills, {getServerSideProps} from "../../../pages/shop-tills";
import {GetServerSidePropsContext} from "next";

jest.mock("next/router", () => ({
    useRouter: () => ({query: {tab:"quick-links"}}),
}));

const mockGetQuickLinks = jest.fn()
jest.mock("../../../server-modules/shop/shop",()=>({
    getQuickLinks:()=> mockGetQuickLinks()
}))

const context = {query:{tab:"quick-links"}} as unknown as GetServerSidePropsContext

test("GetQuicklinks is called if route contains ?tab=quick-links", async()=>{
    render(<ShopTills/>)

    await getServerSideProps(context)
    expect(mockGetQuickLinks).toBeCalledTimes(1)
})