import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import {user} from "./server-modules/users/user";

export async function middleware(request) {

    function rootRedirect(){ return NextResponse.redirect(new URL('/', request.url)) }

    const user = await getToken({ req: request, secret: process.env.JWT_SECRET })  as unknown as user
    if(!user) return NextResponse.redirect(new URL('/login', request.url))
    switch(request.nextUrl.pathname) {
        case '/item-database':          return user.permissions.itemDatabase?.auth ?        null: rootRedirect();
        case '/shop-orders':            return user.permissions.shopOrders?.auth ?          null: rootRedirect();
        case '/incorrect-stock-report': return user.permissions.incorrectStock?.auth ?      null: rootRedirect();
        case '/stock-forecast':         return user.permissions.stockForecast?.auth ?       null: rootRedirect();
        case '/shipments':              return user.permissions.shipments?.auth ?           null: rootRedirect();
        case '/margin-calculator':      return user.permissions.marginCalculator?.auth ?    null: rootRedirect();
        case '/stock-transfer':         return user.permissions.stockTransfer?.auth ?       null: rootRedirect();
        case '/stock-take-list':        return user.permissions.stockTakeList?.auth ?       null: rootRedirect();
        case '/webpages':               return user.permissions.webpages?.auth ?            null: rootRedirect();
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/",
        "/item-database",
        "/dashboard",
        "/shop-orders",
        "/incorrect-stock-report",
        "/item-database",
        "/stock-forecast",
        "/shipments",
        "/margin-calculator",
        "/stock-transfer",
        "/stock-take-list",
        "/webpages"
    ],
};