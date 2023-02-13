import {GetServerSidePropsContext} from "next";
import {renderWithProviders} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import Dashboard, {getServerSideProps} from "../../../pages/dashboard";

jest.mock("next/router", () => ({
    useRouter: () => ({query: {tab: "home"}}),
}))

jest.mock('next-auth/react', () => ({
    async getSession() {
        return {
            user: {
                theme: {},
                role: "admin",
                username: "Geoff",
                permissions: {
                    users: {auth: true},
                    rotas: {auth: true},
                    holidays: {auth: true},
                }
            },
            expires: ""
        }
    },
}));

let mockGetUsers = jest.fn(() => Promise.resolve())
let mockGetUserSettings = jest.fn(() => Promise.resolve())
let mockGetUsersHoliday = jest.fn(() => Promise.resolve())
let mockGetHolidayCalendar = jest.fn(() => Promise.resolve())
let mockGetHolidayYearsForLocation = jest.fn(() => Promise.resolve([]))
jest.mock("../../../server-modules/users/user", () => ({
    getHolidayCalendar: () => mockGetHolidayCalendar(),
    getHolidayYearsForLocation: () => mockGetHolidayYearsForLocation(),
    getUsers: () => mockGetUsers(),
    getUserSettings: () => mockGetUserSettings(),
    getUsersHoliday: () => mockGetUsersHoliday()
}));

let mockGetPublishedRotas = jest.fn(() => Promise.resolve())
let mockRotaNames = jest.fn(() => Promise.resolve())
let mockRotaTemplates = jest.fn(() => Promise.resolve())
jest.mock("../../../server-modules/rotas/rotas", () => ({
    getPublishedRotas: () => mockGetPublishedRotas(),
    getRotaNames: () => mockRotaNames(),
    getRotaTemplates: () => mockRotaTemplates()
}));

describe("Dashboard index page tests", () => {



    beforeEach(() => jest.clearAllMocks())

    const userCases = [
        [mockGetUserSettings, 1], [mockGetUsers, 1], [mockRotaNames, 0],
        [mockRotaTemplates, 0], [mockGetHolidayCalendar, 0], [mockGetPublishedRotas, 0],
        [mockGetHolidayYearsForLocation, 0], [mockGetUsersHoliday, 0]
    ] as const

    test.each(userCases)("check functions are call correct number of times on user query", async (fn, times) => {
        await getServerSideProps({query: {tab: "user"}} as unknown as GetServerSidePropsContext)
        renderWithProviders(<Dashboard/>)
        expect(fn).toBeCalledTimes(times)
    })

    const rotaCases = [
        [mockGetUserSettings, 1], [mockGetUsers, 0], [mockRotaNames, 1],
        [mockRotaTemplates, 1], [mockGetHolidayCalendar, 1], [mockGetPublishedRotas, 1],
        [mockGetHolidayYearsForLocation, 0], [mockGetUsersHoliday, 0]
    ] as const

    test.each(rotaCases)("check functions are call correct number of times on rota query", async (fn, times) => {
        await getServerSideProps({query: {tab: "rotas"}} as unknown as GetServerSidePropsContext)
        renderWithProviders(<Dashboard/>)
        expect(fn).toBeCalledTimes(times)
    })

    const holidayCases = [
        [mockGetUserSettings, 1], [mockGetUsers, 0], [mockRotaNames, 0],
        [mockRotaTemplates, 0], [mockGetHolidayCalendar, 1], [mockGetPublishedRotas, 0],
        [mockGetHolidayYearsForLocation, 1], [mockGetUsersHoliday, 1]
    ] as const

    test.each(holidayCases)("check functions are call correct number of times on holiday tab", async (fn, times) => {
        await getServerSideProps({query: {tab: "holidays"}} as unknown as GetServerSidePropsContext)
        renderWithProviders(<Dashboard/>)
        expect(fn).toBeCalledTimes(times)
    })
})