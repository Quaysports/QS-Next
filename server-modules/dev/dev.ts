import {find} from "../mongo-interface/mongo-interface";

export async function getCalendars(){
    return await find("Holiday-Calendar", {})
}