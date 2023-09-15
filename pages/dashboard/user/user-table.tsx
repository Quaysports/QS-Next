import style from "./user.module.css";
import PermissionsPopup from "./permissions-popup";
import {
    deleteUser,
    selectUsers,
    setUserData,
} from "../../../store/dashboard/users-slice";
import {useDispatch, useSelector} from "react-redux";
import {User} from "../../../server-modules/users/user";
import CreateUser from "./create-user-popup";
import {dispatchNotification} from "../../../components/notification/dispatch-notification";
import RegexInput from "../../../components/regex-input";
import {ReactElement} from "react";

/**
 * User Table component. Takes user data from database and turns into table.
 */
export default function UserTable() {
    const userInfo = useSelector(selectUsers);
    const cy = new Date().getFullYear();
    const ny = cy + 1;

    const userArray: ReactElement[] = [
        <div key="title" className={style["user-table-row"]}>
            <span></span>
            <span>
        <button
            className={style["add-user-button"]}
            onClick={() => {
                dispatchNotification({
                    type: "popup",
                    title: "User Permissions",
                    content: <CreateUser/>,
                });
            }}
        >
          Add User
        </button>
      </span>
            <span>Username</span>
            <span>Role</span>
            <span>Rota</span>
            <span>{cy} Holiday</span>
            <span>{ny} Holiday</span>
            <span>Password</span>
            <span>Pin</span>
            <span>User Colour</span>
        </div>,
    ];

    if (!userInfo || userInfo.length === 0) return null;

    for (const [index, user] of Object.entries(userInfo)) {
        userArray.push(<UserRow key={index} index={index} user={user}/>);
    }
    return <div className={style["user-table"]}>{userArray}</div>;
}

function UserRow({index, user}: { index: string; user: User }) {
    const dispatch = useDispatch();
    const cy = new Date().getFullYear();

    const currentYearHoliday = {
        ...(user.holiday?.find((h) => h.year === cy) || {year: cy, days: 0}),
    };
    const nextYearHoliday = {
        ...(user.holiday?.find((h) => h.year === cy + 1) || {
            year: cy + 1,
            days: 0,
        }),
    };
    const selectOptions = (values: string[]) => {
        const options = [];
        for (const value of values)
            options.push(
                <option key={options.length} value={value}>
                    {value}
                </option>
            );
        return options;
    };

    function updateHoliday(year: number, days: number) {
        console.log(year, days);
        const clone = structuredClone(user);
        clone.holiday ??= [];
        const pos = clone.holiday.findIndex((h) => h.year === year);
        clone.holiday[pos] === undefined
            ? clone.holiday.push({year, days})
            : clone.holiday[pos].days = days;
        dispatch(setUserData({index: Number(index), user: clone}));
    }

    return (
        <div data-testid={"user-table-row"} className={style["user-table-row"]}>
      <span>
        <button
            onClick={() => {
                dispatchNotification({
                    type: "confirm",
                    title: "Delete User",
                    content: "Are you sure you wish to delete this user?",
                    fn: () => dispatch(deleteUser({index: Number(index)})),
                });
            }}
        >
          X
        </button>
      </span>

            <span>
        <button
            onClick={() => {
                dispatchNotification({
                    type: "popup",
                    title: "User Permissions",
                    content: <PermissionsPopup index={index}/>,
                });
            }}
        >
          Permissions
        </button>
      </span>

            <span>
        <input
            type="text"
            defaultValue={user.username}
            onBlur={(e) => {
                const update = {...user, username: e.target.value};
                dispatch(setUserData({index: Number(index), user: update}));
            }}
        />
      </span>

            <span>
        <select
            defaultValue={user.role}
            onChange={(e) => {
                const update = {...user, role: e.target.value};
                dispatch(setUserData({index: Number(index), user: update}));
            }}
        >
          {selectOptions(["admin", "senior", "user"])}
        </select>
      </span>

            <span>
        <select
            defaultValue={user.rota}
            onChange={(e) => {
                const update = {...user, rota: e.target.value};
                dispatch(setUserData({index: Number(index), user: update}));
            }}
        >
          {selectOptions(["online", "shop", "both"])}s
        </select>
      </span>

            <span>
        <input
            type="number"
            defaultValue={currentYearHoliday.days}
            onBlur={(e) => {
                updateHoliday(currentYearHoliday.year, Number(e.target.value));
            }}
        />
      </span>
            <span>
        <input
            type="number"
            defaultValue={nextYearHoliday.days}
            onBlur={(e) => {
                updateHoliday(nextYearHoliday.year, Number(e.target.value));
            }}
        />
      </span>
            <span>
        <input
            type="text"
            defaultValue={user.password}
            onBlur={(e) => {
                const update = {...user, password: e.target.value};
                dispatch(setUserData({index: Number(index), user: update}));
            }}
        />
      </span>
            <span>
        <RegexInput
            type={"pin"}
            value={user.pin ? user.pin : ""}
            errorMessage={
                "Pin must contain only numbers and be exactly four digits long."
            }
            handler={(value) => {
                const update = {...user, pin: value};
                dispatch(setUserData({index: Number(index), user: update}));
            }}
        />
      </span>
            <span>
        <input
            type="color"
            defaultValue={user.colour}
            onBlur={(e) => {
                const update = {...user, colour: e.target.value};
                dispatch(setUserData({index: Number(index), user: update}));
            }}
        />
      </span>
        </div>
    );
}
