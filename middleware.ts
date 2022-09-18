import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import {user} from "./server-modules/users/user";

export async function middleware(request) {

    function rootRedirect(){ return NextResponse.redirect(new URL('/', request.url)) }

    const user = await getToken({ req: request, secret: process.env.JWT_SECRET })  as unknown as user
    if(!user) return NextResponse.redirect(new URL('/login', request.url))
    switch(request.nextUrl.pathname) {
        case '/item-database':          return !user.permissions.itemDatabase.auth ?        rootRedirect() : null;
        case '/shop-orders':            return !user.permissions.shopOrders.auth ?          rootRedirect() : null;
        case '/incorrect-stock-report': return !user.permissions.incorrectStock.auth ?      rootRedirect() : null;
        case '/stock-forecast':         return !user.permissions.stockForecast.auth ?       rootRedirect() : null;
        case '/shipments':              return !user.permissions.shipments.auth ?           rootRedirect() : null;
        case '/margin-calculator':      return !user.permissions.marginCalculator.auth ?    rootRedirect() : null;
        case '/stock-transfer':         return !user.permissions.stockTransfer.auth ?       rootRedirect() : null;
        case '/stock-take-list':        return !user.permissions.stockTakeList.auth ?       rootRedirect() : null;
        case '/webpages':               return !user.permissions.webpages.auth ?            rootRedirect() : null;
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