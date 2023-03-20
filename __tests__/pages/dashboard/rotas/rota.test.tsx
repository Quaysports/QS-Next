import '@testing-library/jest-dom'
import {renderWithProviders, screen} from "../../../../__mocks__/mock-store-wrapper";
import RotaWeek from "../../../../pages/dashboard/rotas/rota";
import {schema} from "../../../../types";
import {within} from "@testing-library/dom";

jest.mock("next/router", () => ({
    useRouter: () => ({query: {tab: "rotas"}}),
}))

let mockRota = {
    "_id": "63bd2f807beac6192ec3a20e",
    "name": "Test 2",
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
let mockWeekData = {
    "monday": "2023-02-06T08:29:50.630Z",
    "days": [
        "2023-02-06T08:29:50.630Z",
        "2023-02-07T08:29:50.630Z",
        "2023-02-08T08:29:50.630Z",
        "2023-02-09T08:29:50.630Z",
        "2023-02-10T08:29:50.630Z",
        "2023-02-11T08:29:50.630Z",
        "2023-02-12T08:29:50.630Z"
    ],
    "week": 6
}
let mockHolidayData:schema.HolidayDay[] = [
    {
        date: "Mon Feb 06 2023",
        booked: {
            "Chris": {
                "type": "holiday",
                "paid": true,
                "duration": 100
            }
        }
    },
    {
        date: "Tue Feb 07 2023",
        booked: {
            "Chris": {
                "type": "holiday",
                "paid": true,
                "duration": 100
            }
        }
    },
    {
        date: "Wed Feb 08 2023",
        booked: {
            "Chris": {
                "type": "holiday",
                "paid": true,
                "duration": 100
            }
        }
    },
    {
        date: "Thu Feb 09 2023"
    },
    {
        date: "Fri Feb 10 2023"
    },
    {
        date: "Sat Feb 11 2023"
    },
    {
        date: "Sun Feb 12 2023"
    }
]

describe("Rota tests", () => {
    test("should render", () => {
        renderWithProviders(<RotaWeek rota={mockRota} weekData={mockWeekData} holiday={mockHolidayData} />)
        expect(screen.getByText("Mark")).toBeInTheDocument()
        expect(screen.getByText("Chris")).toBeInTheDocument()
        expect(screen.getByText("Mon 6th")).toBeInTheDocument()
    })

    test("Mark should have time booked on monday", () => {
        renderWithProviders(<RotaWeek rota={mockRota} weekData={mockWeekData} holiday={mockHolidayData} />)
        const parent = screen.getAllByRole("rota-day")[0]
        expect(within(parent).getByText("Mark")).toBeInTheDocument()
        expect(within(parent).getByText("5.5")).toBeInTheDocument()
        let cell = parent.childNodes[1].childNodes[7] as HTMLDivElement
        expect(cell.style.background).toBe("rgb(0, 128, 255)")
    })

    test("Chris should have holiday flag on monday", async () => {
        renderWithProviders(<RotaWeek rota={mockRota} weekData={mockWeekData} holiday={mockHolidayData}/>)
        const parent = screen.getAllByRole("rota-day")[0]
        expect(within(parent).getByText("Chris")).toBeInTheDocument()
        let row = parent.childNodes[2] as HTMLDivElement
        let holElements = within(row).getAllByText("Hol")
        expect(holElements[0]).toBeInTheDocument()
        expect(holElements.length).toBe(26)
    })
})