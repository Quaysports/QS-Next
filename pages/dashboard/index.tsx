import {useRouter} from "next/router";
import UserTab from "./user";
import HomeTab from "./home";
import Menu from "../../components/menu/menu";
import DashboardTabs from "./tabs";
import OneColumn from "../../components/layouts/one-column";
import {appWrapper} from "../../store/store";
import {setAllUserData} from "../../store/dashboard/users-slice";
import {
    getHolidayCalendar,
    getHolidayYearsForLocation,
    getUsers, getUserSettings,
    getUsersHoliday
} from "../../server-modules/users/user";
import HolidayTab from "./holiday";
import {setAvailableCalendarsYears, setHolidayCalendar, setHolidayUsers} from "../../store/dashboard/holiday-slice";
import {updateSettings} from "../../store/session-slice";
import {getSession} from "next-auth/react";
import {getPublishedRotas, getRotaNames, getRotaTemplates} from "../../server-modules/rotas/rotas";
import {setPublishedRotas, setTemplatesNames, setUserData} from "../../store/dashboard/rotas-slice";
import ReportsTab from "./reports";
import RotasTab from "./rotas";


/**
 * Dashboard landing page
 */
export default function Dashboard() {
    const router = useRouter()

    return (
        <OneColumn>
            <Menu><DashboardTabs/></Menu>
            {router.query.tab === undefined || router.query.tab === "home" ? <HomeTab/> : null}
            {router.query.tab === "user" ? <UserTab/> : null}
            {router.query.tab === "rotas" ? <RotasTab/> : null}
            {router.query.tab === "holidays" ? <HolidayTab/> : null}
            {router.query.tab === "reports" ? <ReportsTab/> : null}
        </OneColumn>
    );
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async(context)=>{

    const session = await getSession(context)
    const user = await getUserSettings(session?.user.username)
    if(user?.settings) store.dispatch(updateSettings(user!.settings))

    if(context.query.tab === "user"){
        const data = await getUsers()
        if(data) store.dispatch(setAllUserData(data))
    }

    if(context.query.tab === "rotas"){
        const location = context.query.location as string ?? "online"
        const users = await getRotaNames(location)
        if(users) store.dispatch(setUserData({location:location, users:users}))

        const locationTemplates = await getRotaTemplates(location)
        if(locationTemplates) store.dispatch(setTemplatesNames(locationTemplates))

        let currentYear = new Date().getFullYear()
        const data = await getHolidayCalendar({year:currentYear, location:location})
        if(data) store.dispatch(setHolidayCalendar(data))

        let oneWeekAgo = new Date(new Date().getTime() - 604800000).toISOString()

        const publishedRotas = await getPublishedRotas(location, oneWeekAgo)
        if(publishedRotas) store.dispatch(setPublishedRotas(publishedRotas))
    }

    if(context.query.tab === "holidays"){

        const location = context.query.location
            ? context.query.location as string
            : user?.settings?.dashboard?.holiday.location
                ? user?.settings?.dashboard?.holiday.location
                : "shop"

        let currentYear = new Date().getFullYear()
        const years = await getHolidayYearsForLocation(location)
        const year = context.query.year
            ? Number(context.query.year)
            : years.indexOf(currentYear) !== -1
                ? currentYear
                : years[0]
        store.dispatch(setAvailableCalendarsYears(years))

        const data = await getHolidayCalendar({year:year, location:location})
        if(data) store.dispatch(setHolidayCalendar(data))

        const users = await getUsersHoliday()
        console.dir(users)
        if(users) store.dispatch(setHolidayUsers(users))
    }

    if(context.query.tab === 'reports'){
        const opts ={
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '9b9983e5-30ae-4581-bdc1-3050f8ae91cc'
            },
            body: null
        }
        if(context.query.location === 'shop' || context.query.location === undefined){

        }
        if(context.query.location === 'online'){
            if(!context.query.year) await fetch("http://localhost:3001/Orders/OnlineSalesReport", opts)
            let order = await fetch("http://localhost:3001/Orders/OnlineSalesSpan", opts)

        }
    }
    return {props:{}}
})