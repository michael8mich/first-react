
import {  Route, Switch, Redirect, Link} from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector';
import { publicRoutes, privateRoutes, RouteNames } from '../router/index'


const AppRouter = () => {
    const {isAuth} = useTypedSelector(state => state.auth)
    return ( 
        isAuth ?
             <Switch>
                  { privateRoutes.map( (r,index) => 
                  <Route 
                  key={index} 
                  path={r.path} 
                  exact={r.exact} 
                  component={r.component} 
                  />
                  )}
                  <Redirect to={RouteNames.HOME}  />
              </Switch>
                  :
              <Switch>    
                 { publicRoutes.map( (r,index) => 
                  <Route 
                  key={index} 
                  path={r.path} 
                  exact={r.exact} 
                  component={r.component} />
                  ) }
                  <Redirect to={RouteNames.LOGIN} exact />
              </Switch>
    )
}
export default AppRouter