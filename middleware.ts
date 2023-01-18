import { getToken } from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';
import {User} from "./server-modules/users/user";

export async function middleware(request:NextRequest) {

    function rootRedirect(){ return NextResponse.redirect(new URL('/', request.url)) }

    const user = await getToken({ req: request, secret: process.env.JWT_SECRET})  as unknown as User

    if(!user) return NextResponse.redirect(new URL('/login?redirect=http://192.168.1.200:3000'+request.nextUrl.pathname+request.nextUrl.search, request.url))
    switch(request.nextUrl.pathname) {
        case '/item-database':          return user.permissions.itemDatabase?.auth ?        null: rootRedirect();
        case '/shop-orders':            return user.permissions.shopOrders?.auth ?          null: rootRedirect();
        case '/shop-tills':             return user.permissions.shopTills?.auth ?           null: rootRedirect();
        case '/stock-reports':          return user.permissions.stockReports?.auth ?      null: rootRedirect();
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
        "/shop-tills",
        "/stock-reports",
        "/item-database",
        "/stock-forecast",
        "/shipments",
        "/margin-calculator",
        "/stock-transfer",
        "/stock-take-list",
        "/webpages"
    ],
};