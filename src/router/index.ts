import React from 'react';
import i18n from "i18next";
import Home from '../components/Home';
import OrgDtl from '../pages/admin/OrgDtl';
import Orgs from '../pages/admin/Orgs';
import UserDtl from '../pages/admin/UserDtl';
import Users from '../pages/admin/Users';
import Utils from '../pages/admin/Utils';
import Event from '../pages/Event';
import Login from '../pages/Login';
import TCategories from '../pages/ticket/admin/TCategories';
import TCategoryDtl from '../pages/ticket/admin/TCategoryDtl';
import TicketDtl from '../pages/ticket/TicketDtl';
import Tickets from '../pages/ticket/Tickets';
import Dashboard from '../charts/dashbord';


export interface IRoute {
    path: string,
    component: React.ComponentType,
    exact?: boolean
}

export enum RouteNames {
    HOME='/',
    LOGIN= '/login',
    UTILS= '/utils',
    USERS= '/users',
    USER_DTL= '/users/:id',
    EVENT='/events',
    ORGS= '/orgs',
    ORG_DTL= '/orgs/:id',
    TICKETS= '/tickets',
    TICKET_DTL= '/tickets/:id',
    TCATEGORIES = '/tcategories',
    TCATEGORY_DTL= '/tcategories/:id',
    DASHBOARD= '/dashboard'
}

export const privateRoutes:IRoute[] = [
    {path: RouteNames.HOME, component: Home, exact: true},   
    {path: RouteNames.EVENT, component: Event,   exact: true}, 
    {path: RouteNames.UTILS, component: Utils, exact: true}, 
    {path: RouteNames.USER_DTL, component: UserDtl, exact: false}, 
    {path: RouteNames.USERS, component: Users, exact: true},
    {path: RouteNames.ORG_DTL, component: OrgDtl, exact: false}, 
    {path: RouteNames.ORGS, component: Orgs, exact: true},
    {path: RouteNames.TICKET_DTL, component: TicketDtl, exact: true}, 
    {path: RouteNames.TICKETS, component: Tickets,  exact: true},
    {path: RouteNames.TCATEGORY_DTL, component: TCategoryDtl, exact: false}, 
    {path: RouteNames.TCATEGORIES, component: TCategories,  exact: true},
    {path: RouteNames.DASHBOARD, component: Dashboard, exact: true},
   
     
]
export const publicRoutes:IRoute[] = [
    {path:  RouteNames.LOGIN, component: Login,exact: true}
]