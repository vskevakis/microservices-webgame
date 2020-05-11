import React from 'react'
// import { Subscribe } from 'unstated'
import { Switch, Route } from 'react-router-dom'
// import { PrivateRoute, NoMatch } from './Helpers'

import Home from './Home'
import Register from './Register'
import Login from './Login'

const Routes = () => (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={Register} />
      <Route exact path="/login" component={Login} />
      {/* <Route exact path="/login" render={(props) => 
        <Subscribe to={[UserContainer]}>
          {userContainer => (
            <LogIn {...props} userContainer={userContainer}/>
          )}
        </Subscribe>
      } /> */}
      {/* <Route exact path="/verify/:verification" render={(props) =>
        <Subscribe to={[UserContainer]}>
          {userContainer => (
            <Verify {...props} userContainer={userContainer}/>
          )}
        </Subscribe>
      } /> */}
{/*   
      <PrivateRoute exact path="/posts" component={Posts}/>
      <PrivateRoute exact path="/post/create" component={PostForm}/>
      <PrivateRoute exact path="/post/:id/edit" component={PostForm}/> */}
  
      {/* <Route component={NoMatch} /> */}
    </Switch>
  );
  
  export default Routes;