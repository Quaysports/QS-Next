import handler from "../../../../pages/api/linnworks/upload-new-items";
import {NextApiRequest, NextApiResponse} from "next";

const mockLinnApi = jest.fn()
    .mockReturnValueOnce(["Linn error"])
    .mockReturnValueOnce([])
jest.mock('../../../../server-modules/linn-api/linn-api', () => ({
    createNewItems: (args:any) => mockLinnApi(args),
}))
const mockJson = jest.fn()
const mockStatus = jest.fn()
const status = {
    status: (props:any) => {
        mockStatus(props)
        return {
            json: (props:any) => mockJson(props),
        }
    }
}

const testParams = [
    [{SKU:"test", brand:"", prices:{purchase: "test"}, title:"test", EAN:"test"}, 400, ["Input Error"]],
    [{SKU:"test", brand:"test", prices:{purchase: 0}, title:"test", EAN:"test"}, 400, ["Input Error"]],
    [{SKU:"test", brand:"test", prices:{purchase: "test"}, title:"", EAN:"test"}, 400, ["Input Error"]],
    [{SKU:"test", brand:"test", prices:{purchase: "test"}, title:"test", EAN:""}, 400, ["Input Error"]],
    [{SKU:"", brand:"test", prices:{purchase: "test"}, title:"test", EAN:"test"}, 400, ["Input Error"]],
    [{SKU:"test", brand:"test", prices:{purchase: "test"}, title:"test", EAN:"test"}, 300, ["Linn error"]],
    [{SKU:"test", brand:"test", prices:{purchase: "test"}, title:"test", EAN:"test"}, 200, []]
] as const
test.each(testParams)('upload new items api calls correct server function', async (mockItem, statusCode, jsonRes) => {
    await handler({body:[mockItem]} as NextApiRequest, status as unknown as NextApiResponse)
    expect(mockStatus).toHaveBeenCalledWith(statusCode)
    expect(mockJson).toHaveBeenCalledWith(jsonRes)
})
