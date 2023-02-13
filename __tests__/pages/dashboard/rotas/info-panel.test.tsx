import '@testing-library/jest-dom'
import {renderWithProviders} from "../../../../__mocks__/mock-store-wrapper";
import InfoPanel from "../../../../pages/dashboard/rotas/info-panel";
import {Rota} from "../../../../server-modules/rotas/rotas";

jest.mock("next/router", () => ({
    useRouter: () => ({query: {tab: "rotas"}}),
}))

let mockRota:Rota = {
    _id: "",
    location: "shop",
    name: "test",
    rota: [
        [
            {colour: "#ffffff",
                hours: {
                    "06:00": true,
                    "06:30": true,
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
                },
                notes: "Test Note",
                total: 1,
                username: "Mark"
            }
        ],
        [],
        [],
        [],
        [],
        [],
        []
    ]
}
describe("Rota Info Panel", () => {
  test("info panel renders correctly", () => {
      renderWithProviders(<InfoPanel rota={mockRota}/>)
      expect(document.querySelector(".info-panel-title")).toHaveTextContent("Total Hours")
        expect(document.querySelectorAll(".day-cell")[0]).toHaveTextContent("Mark")
        expect(document.querySelectorAll(".day-cell")[1]).toHaveTextContent("1")
  })
})