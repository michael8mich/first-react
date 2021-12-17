import React from 'react';
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
import Empty from '../components/Empty';
import NotificationDtl from '../pages/admin/NotificationDtl';
import Notifications from '../pages/admin/Notifications';
import CisDtl from '../pages/cis/CiDtl';
import Cis from '../pages/cis/Cis';
import TicketsAllWfs from '../components/tickets/TicketsAllWfs';


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
    CIS= '/cis',
    CI_DTL= '/cis/:id',
    EVENT='/events',
    ORGS= '/orgs',
    ORG_DTL= '/orgs/:id',
    NOTIFICATION_DTL= '/notifications/:id',
    NOTIFICATIONS= '/notifications',
    TICKETS= '/tickets',
    TICKET_DTL= '/tickets/:id',
    TCATEGORIES = '/tcategories',
    TCATEGORY_DTL= '/tcategories/:id',
    WFS='/wfs',
    DASHBOARD= '/dashboard',
    EMPTY='/empty'
}

export const privateRoutes:IRoute[] = [
    {path: RouteNames.HOME, component: Home, exact: true},   
    {path: RouteNames.EVENT, component: Event,   exact: true}, 
    {path: RouteNames.UTILS, component: Utils, exact: true}, 
    {path: RouteNames.USER_DTL, component: UserDtl, exact: false}, 
    {path: RouteNames.USERS, component: Users, exact: true},
    {path: RouteNames.CI_DTL, component: CisDtl, exact: false}, 
    {path: RouteNames.CIS, component: Cis, exact: true},
    {path: RouteNames.ORG_DTL, component: OrgDtl, exact: false}, 
    {path: RouteNames.ORGS, component: Orgs, exact: true},
    {path: RouteNames.NOTIFICATION_DTL, component: NotificationDtl, exact: false}, 
    {path: RouteNames.NOTIFICATIONS, component:  Notifications, exact: true},
    {path: RouteNames.TICKET_DTL, component: TicketDtl, exact: true}, 
    {path: RouteNames.TICKETS, component: Tickets,  exact: true},
    {path: RouteNames.TCATEGORY_DTL, component: TCategoryDtl, exact: false}, 
    {path: RouteNames.TCATEGORIES, component: TCategories,  exact: true},
    {path: RouteNames.WFS, component: TicketsAllWfs,  exact: true},
    {path: RouteNames.DASHBOARD, component: Dashboard, exact: true},
    {path: RouteNames.EMPTY, component: Empty, exact: true},
    
     
]
export const publicRoutes:IRoute[] = [
    {path:  RouteNames.LOGIN, component: Login,exact: true}
]