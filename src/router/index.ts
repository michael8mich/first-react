import React from 'react';
import Event from '../pages/Event';
import Login from '../pages/Login';


export interface IRoute {
    path: string,
    component: React.ComponentType,
    exact?: boolean
}

export enum RouteNames {
    LOGIN= '/login',
    EVENT='/'
}

export const privateRoutes:IRoute[] = [
    {path: RouteNames.EVENT, component: Event, exact: true},   
]
export const publicRoutes:IRoute[] = [
    {path:  RouteNames.LOGIN, component: Login, exact: true}
]