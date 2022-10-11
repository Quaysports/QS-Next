import {render, waitFor, screen} from "../../../__mocks__/mock-store-wrapper";
import '@testing-library/jest-dom'
import UserTab from "../../../pages/dashboard/user";
import {User} from "../../../server-modules/users/user";
import PermissionsPopup from "../../../pages/dashboard/user/permissions-popup";

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({acknowledged: true, deletedCount: 2}),
    })
) as jest.Mock;

const user:User = {
    theme: {},
    _id: "607ead6b6697cdb944005d0a",
    username: "Test User",
    pin: "0000",
    password: "password123",
    role: "admin",
    colour: "#0080ff",
    permissions: {
        users: {auth: true, label: "Users"}
    },
    holiday: "",
    rota: "shop"
}

const userInfo = {usersArray:[user]}

const mockPopup = jest.fn()
jest.mock("../../../server-modules/dispatch-notification", () => ({
    dispatchNotification: (info: any) => {
        if(info.type === "confirm") info.fn()
        if(info.type === "popup") mockPopup()
    }
}))

test("User table loads if data is present in slice.", async () => {
    render(<UserTab/>,{preloadedState:{"users":userInfo}})

    expect(await screen.findByRole("button",{name:"Add User"})).toBeInTheDocument()
})

test("User table fields render correct information based on slice data.", async()=>{
    render(<UserTab/>,{preloadedState:{"users":userInfo}})
    expect(await screen.findByRole("button",{name:"Add User"})).toBeInTheDocument()

    const row = await screen.findByTestId("user-table-row")

    //Close button
    expect(row.childNodes[0]).toContainHTML("<button>X</button>")

    //Permissions button
    expect(row.childNodes[1]).toContainHTML("<button>Permissions</button>")

    //Username
    expect(row.childNodes[2].childNodes[0]).toHaveValue("Test User")

    //User auth select
    expect(row.childNodes[3].childNodes[0]).toHaveValue("admin")
    expect(row.childNodes[3].childNodes[0].childNodes[0]).toHaveTextContent("admin")
    expect(row.childNodes[3].childNodes[0].childNodes[1]).toHaveTextContent("senior")
    expect(row.childNodes[3].childNodes[0].childNodes[2]).toHaveTextContent("user")

    //User department select
    expect(row.childNodes[4].childNodes[0]).toHaveValue("shop")

    //User holiday allowance
    expect(row.childNodes[5].childNodes[0]).toHaveValue(null)

    //User password
    expect(row.childNodes[6].childNodes[0]).toHaveValue("password123")

    //User pin
    expect(row.childNodes[7].childNodes[0]).toHaveValue("0000")

    //User colour
    expect(row.childNodes[8].childNodes[0]).toHaveValue("#0080ff")
})

test("X button removes user from table.", async () => {
    render(<UserTab/>,{preloadedState:{"users":userInfo}})

    expect(await screen.findByRole("button",{name:"Add User"})).toBeInTheDocument()

    await waitFor(()=>screen.getByRole("button",{name:"X"}).click())
    await waitFor(()=>expect(screen.queryByTestId("user-table-row")).toBeNull())
})

test("Permissions button calls popup", async () => {
    render(<UserTab/>,{preloadedState:{"users":userInfo}})

    expect(await screen.findByRole("button",{name:"Add User"})).toBeInTheDocument()

    await waitFor(()=>screen.getByRole("button",{name:"Permissions"}).click())
    expect(mockPopup).toHaveBeenCalledTimes(1)
})

test("Permissions popup renders user data correctly", async () => {
    render(<PermissionsPopup index={"0"}/>,{preloadedState:{"users":userInfo}})
    const checkBoxes = await screen.findAllByRole("checkbox")

    expect(checkBoxes[0]).toBeChecked()
    expect(checkBoxes[1]).not.toBeChecked()
    expect(checkBoxes[2]).not.toBeChecked()

})