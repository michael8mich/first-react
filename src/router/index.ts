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
    breadcrumbName: string;
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
    {path: RouteNames.HOME, component: Home, breadcrumbName: i18n.t('home'),  exact: true},   
    {path: RouteNames.EVENT, component: Event,  breadcrumbName: i18n.t('events'), exact: true}, 
    {path: RouteNames.UTILS, component: Utils, breadcrumbName: i18n.t('utils'),exact: true}, 
    {path: RouteNames.USER_DTL, component: UserDtl, breadcrumbName: i18n.t('util'),exact: false}, 
    {path: RouteNames.USERS, component: Users, breadcrumbName: i18n.t('users'),exact: true},
    {path: RouteNames.ORG_DTL, component: OrgDtl, breadcrumbName: i18n.t('user'),exact: false}, 
    {path: RouteNames.ORGS, component: Orgs, breadcrumbName: i18n.t('orgs'),exact: true},
    {path: RouteNames.TICKET_DTL, component: TicketDtl, breadcrumbName: i18n.t('org'),exact: false}, 
    {path: RouteNames.TICKETS, component: Tickets, breadcrumbName: i18n.t('tickets'), exact: true},
    {path: RouteNames.TCATEGORY_DTL, component: TCategoryDtl, breadcrumbName: i18n.t('tcategories'),exact: false}, 
    {path: RouteNames.TCATEGORIES, component: TCategories, breadcrumbName: i18n.t('tcategory'), exact: true},
    {path: RouteNames.DASHBOARD, component: Dashboard, breadcrumbName: i18n.t('dashboard'), exact: true},
   
     
]
export const publicRoutes:IRoute[] = [
    {path:  RouteNames.LOGIN, component: Login, breadcrumbName: "TCategories", exact: true}
]