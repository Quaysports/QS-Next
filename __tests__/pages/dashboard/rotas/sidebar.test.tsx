import '@testing-library/jest-dom'
import {mockStore, renderWithProviders, screen} from "../../../../__mocks__/mock-store-wrapper";
import Sidebar from "../../../../pages/dashboard/rotas/sidebar";
import {setTemplate, setTemplatesNames} from "../../../../store/dashboard/rotas-slice";
import {fireEvent, waitFor} from "@testing-library/dom";
import RotasTab from "../../../../pages/dashboard/rotas";

let mockRoute = jest.fn()
const mockApi = jest.fn()

global.fetch = jest.fn(async(api:string) => {
    mockApi(api)
    return {
        json: async () => Promise.resolve(mockRota),
        status: 200
    }
}) as jest.Mock
jest.mock("next/router", () => ({
    useRouter: () => ({
        query: {tab: "rotas"},
        push:(route:any)=>mockRoute(route.query)
    }),
}))

let mockRota = {
    "_id": "63bd2f807beac6192ec3a20e",
    "name": "test",
    "location": "shop",
    "rota": [
        [
            {
                "username": "Mark",
                "colour": "#0080ff",
                "notes": "mark test",
                "total": 5.5,
                "hours": {
                    "06:00": false,
                    "06:30": false,
                    "07:00": false,
                    "07:30": false,
                    "08:00": false,
                    "08:30": false,
                    "09:00": true,
                    "09:30": true,
                    "10:00": true,
                    "10:30": true,
                    "11:00": true,
                    "11:30": true,
                    "12:00": true,
                    "12:30": true,
                    "13:00": true,
                    "13:30": true,
                    "14:00": true,
                    "14:30": false,
                    "15:00": false,
                    "15:30": false,
                    "16:00": false,
                    "16:30": false,
                    "17:00": false,
                    "17:30": false,
                    "18:00": false,
                    "18:30": false
                }
            },
            {
                "username": "Chris",
                "colour": "#3dc8ff",
                "notes": "",
                "total": 0,
                "hours": {
                    "06:00": false,
                    "06:30": false,
                    "07:00": false,
                    "07:30": false,
                    "08:00": false,
                    "08:30": false,
                    "09:00": false,
                    "09:30": false,
                    "10:00": false,
                    "10:30": false,
                    "11:00": false,
                    "11:30": false,
                    "12:00": false,
                    "12:30": false,
                    "13:00": false,
                    "13:30": false,
                    "14:00": false,
                    "14:30": false,
                    "15:00": false,
                    "15:30": false,
                    "16:00": false,
                    "16:30": false,
                    "17:00": false,
                    "17:30": false,
                    "18:00": false,
                    "18:30": false
                }
            }],
        [],
        [],
        [],
        [],
        [],
        []
    ]
}
describe("Rotas Sidebar", () => {
    test("sidebar renders correctly", () => {
        mockStore.dispatch(setTemplatesNames(["test"]))
        renderWithProviders(<Sidebar/>)
        expect(screen.getByText("Online")).toBeInTheDocument()
        expect(screen.getByText("Create Template")).toBeInTheDocument()
        expect(screen.getByText("Templates")).toBeInTheDocument()
        expect(screen.getByText("Blank")).toBeInTheDocument()
        expect(screen.getByText("test")).toBeInTheDocument()
    })

    test("sidebar select corretly routes to location", async () => {
        renderWithProviders(<Sidebar/>)
        expect(screen.getByRole("combobox")).toBeInTheDocument()
        await waitFor(() => {
            fireEvent.change(screen.getByRole("combobox"), {target: {value: "shop"}})
        })
        expect(mockRoute).toBeCalledWith({"location": "shop", "tab": "rotas"})
    })

    test("create template button brings up template window", async () => {
        renderWithProviders(<Sidebar/>)
        expect(screen.getByText("Create Template")).toBeInTheDocument()
        await waitFor(() => {
            fireEvent.click(screen.getByText("Create Template"))
        })
        expect(screen.getByText("New Template")).toBeInTheDocument()
        expect(screen.getByText("Save")).toBeInTheDocument()
    })

    test("blank button brings up publish window", async () => {
           renderWithProviders(<Sidebar/>)
            expect(screen.getByText("Blank")).toBeInTheDocument()
            await waitFor(() => {
                fireEvent.click(screen.getByText("Blank"))
            })
            expect(screen.getByText("Publish Rota")).toBeInTheDocument()
            expect(screen.getByRole("button", {name:"Publish"})).toBeInTheDocument()
    })

    test("test 2 button brings up template window", async () => {
        mockStore.dispatch(setTemplatesNames(["test"]))

        renderWithProviders(<RotasTab/>)
        expect(screen.getByText("test")).toBeInTheDocument()
        await waitFor(() => {
            fireEvent.click(screen.getByText("test"))
            mockStore.dispatch(setTemplate(mockRota))
            expect(mockApi).toBeCalledTimes(1)
        })
    })
})