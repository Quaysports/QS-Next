import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {User} from "../../server-modules/users/user";
import {PublishedRota, Rota, UserHours, WeekData} from "../../server-modules/rotas/rotas";
import {dispatchToast} from "../../components/toast/dispatch-toast";
import {schema} from "../../types";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "../store";

export const hydrate = createAction<RootState>(HYDRATE);

export type RotaUserPick = Pick<User, '_id' | 'username' | 'colour'>

export interface rotaWrapper {
    rota: rotaState
}

export interface rotaState {
    users: RotaUserPick[]
    location: string
    publishedRotas: PublishedRota[]
    templatesNames: string[]
    template: Rota | null
    weekData: WeekData | null
    holidays: schema.HolidayDay[] | null
}

const initialState: rotaState = {
    users: [],
    location: "",
    publishedRotas: [],
    templatesNames: [],
    template: null,
    weekData: null,
    holidays: null
}

export const rotaSlice = createSlice({
        name: "rota",
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.rota
                    };
                })
                .addDefaultCase(() => {})
        },
        reducers: {
            setUserData: (state, action: PayloadAction<{ location: string, users: RotaUserPick[] }>) => {
                state.location = action.payload.location
                state.users = action.payload.users
            },
            setPublishedRotas: (state, action: PayloadAction<PublishedRota[]>) => {
                state.publishedRotas = action.payload
            },
            setTemplatesNames: (state, action: PayloadAction<string[]>) => {
                state.templatesNames = action.payload
            },
            setTemplate: (state, action: PayloadAction<Rota>) => {
                state.template = action.payload
            },
            setWeekData: (state, action: PayloadAction<WeekData>) => {
                state.weekData = action.payload
            },
            setHolidayData: (state, action: PayloadAction<schema.HolidayDay[] | null>) => {
                state.holidays = action.payload
            },
            createTemplate(state) {
                let template: Rota = {
                    name: "",
                    location: state.location,
                    rota: []
                }
                for (let i = 0; i < 7; i++) {
                    for (let user of state.users) {
                        template.rota[i] ??= []
                        template.rota[i].push({
                            username: user.username,
                            colour: user.colour ?? "",
                            notes: "",
                            total: 0,
                            hours: {
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
                        })
                    }
                }
                state.template = template
                state.weekData = null
            },
            updateTemplate(state, action: PayloadAction<{ index: number, day: number, userHours: UserHours }>) {
                const {index, day, userHours} = action.payload
                if (state.template) state.template.rota[day][index] = userHours
            },
            saveTemplate(state, action: PayloadAction<string>) {

                let template = {...state.template, ...{name: action.payload}}

                const opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(template)
                }

                fetch('/api/rotas/update-template', opts).then(res => res.json()).then(() => {
                    dispatchToast({content: "Template Updated"})
                })
            },
            publishRota(state) {
                if (!state.template || !state.weekData) return
                const publishedRota: PublishedRota = {
                    ...state.template, ...{
                        weekData: state.weekData,
                        holidays: state.holidays
                    }
                }

                const opts = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(publishedRota)
                }

                fetch('/api/rotas/publish-rota', opts).then(res => res.json()).then(() => {
                    dispatchToast({content: "Template Published"})
                })
            },
            editPublishedRota(state, action: PayloadAction<PublishedRota>) {
                state.template = action.payload
                state.weekData = action.payload.weekData
                state.holidays = action.payload.holidays
            }
        },
    })
;

export const {
    setUserData, setPublishedRotas, setTemplatesNames, setWeekData, setHolidayData, setTemplate,
    createTemplate, updateTemplate, saveTemplate, publishRota, editPublishedRota
} = rotaSlice.actions

export const selectUsers = (state: rotaWrapper) => state.rota.users
export const selectPublishedRotas = (state: rotaWrapper) => state.rota.publishedRotas
export const selectTemplatesNames = (state: rotaWrapper) => state.rota.templatesNames
export const selectTemplate = (state: rotaWrapper) => state.rota.template
export const selectWeekData = (state: rotaWrapper) => state.rota.weekData
export const selectHolidays = (state: rotaWrapper) => state.rota.holidays