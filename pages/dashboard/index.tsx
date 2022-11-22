import {useRouter} from "next/router";
import UserTab from "./user";
import HomeTab from "./home";
import Menu from "../../components/menu/menu";
import DashboardTabs from "./tabs";
import OneColumn from "../../components/layouts/one-column";
import {appWrapper} from "../../store/store";
import {setAllUserData} from "../../store/dashboard/users-slice";
import {getUsers} from "../../server-modules/users/user";

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
        </OneColumn>
    );
}

export const getServerSideProps = appWrapper.getServerSideProps(store => async(context)=>{
    if(context.query.tab === "user"){
        const data = await getUsers()
        store.dispatch(setAllUserData(data))
    }
    return {props:{}}
})