import ItemDatabase, {getServerSideProps} from "../../../pages/item-database";
import {GetServerSidePropsContext} from "next";
import '@testing-library/jest-dom'
import {renderWithProviders} from "../../../__mocks__/mock-store-wrapper";
import React from 'react'
import {jariloHtml} from "../../../components/jarilo-template";

const mockGetItem = jest.fn()
const mockGetLinkedItems = jest.fn()
const mockGetTags = jest.fn()
const mockGetAllSuppliers = jest.fn()
jest.mock("../../../server-modules/items/items", () => ({
        getItem: () => mockGetItem(),
        getLinkedItems: () => mockGetLinkedItems(),
        getTags: () => mockGetTags(),
        getAllSuppliers: () => mockGetAllSuppliers()
}))

jest.mock("next/router", () => ({
        useRouter: () => ({})
}))

jest.mock('../../../components/jarilo-template', () => ({
        jariloHtml: () => jest.fn()
}))
jest.mock('next-auth/react', () => ({

        async getSession() {
                return {
                        user: {
                                theme: {},
                                role: "admin",
                                username: "Geoff",
                                permissions: {
                                        itemDatabase:{auth:true}
                                }
                        },
                        expires: ""
                }
        },
}));



describe('item database index page getServerSideProps tests', () => {

        beforeEach(() => {
                jest.clearAllMocks()
        })

        const itemIsNull = [[mockGetItem, 1],[mockGetLinkedItems, 0],[mockGetTags, 0],[mockGetAllSuppliers, 1]] as const

        test.each(itemIsNull)('sku query calls appropriate functions when item is not found', async (fn, calls) => {
                await getServerSideProps({query:{sku:"test", tab:""}} as unknown as GetServerSidePropsContext)
                expect(fn).toBeCalledTimes(calls)
        })

        const itemIsNotNull = [[mockGetItem, 1],[mockGetLinkedItems, 1],[mockGetTags, 0],[mockGetAllSuppliers, 1]] as const

        test.each(itemIsNotNull)('sku query calls appropriate functions when item is found', async (fn, calls) => {
                mockGetItem.mockReturnValueOnce({sku:'test'})
                await getServerSideProps({query:{sku:"test",  tab:""}} as unknown as GetServerSidePropsContext)
                expect(fn).toBeCalledTimes(calls)
        })

        const tabAndItemExist = [[mockGetItem, 1],[mockGetLinkedItems, 1],[mockGetTags, 1],[mockGetAllSuppliers, 1]] as const

        test.each(tabAndItemExist)('function gets called when item and query.tab exists', async (fn, calls) => {
                mockGetItem.mockReturnValueOnce({sku:'test'})
                await getServerSideProps({query:{sku:"test",  tab:"new-items"}} as unknown as GetServerSidePropsContext)
                expect(fn).toBeCalledTimes(calls)
        })
})