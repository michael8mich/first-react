import React from 'react';
import OrgDtl from '../pages/admin/OrgDtl';
import Orgs from '../pages/admin/Orgs';
import UserDtl from '../pages/admin/UserDtl';
import Users from '../pages/admin/Users';
import Utils from '../pages/admin/Utils';
import Event from '../pages/Event';
import Login from '../pages/Login';


export interface IRoute {
    path: string,
    component: React.ComponentType,
    exact?: boolean
}

export enum RouteNames {
    LOGIN= '/login',
    UTILS= '/utils',
    USERS= '/users',
    USER_DTL= '/users/:id',
    EVENT='/events',
    ORGS= '/orgs',
    ORG_DTL= '/orgs/:id',

}

export const privateRoutes:IRoute[] = [
    {path: RouteNames.EVENT, component: Event, exact: true}, 
    {path: RouteNames.UTILS, component: Utils, exact: true}, 
    {path: RouteNames.USER_DTL, component: UserDtl, exact: false}, 
    {path: RouteNames.USERS, component: Users, exact: true},
    {path: RouteNames.ORG_DTL, component: OrgDtl, exact: false}, 
    {path: RouteNames.ORGS, component: Orgs, exact: true},
  
    
     
]
export const publicRoutes:IRoute[] = [
    {path:  RouteNames.LOGIN, component: Login, exact: true}
]