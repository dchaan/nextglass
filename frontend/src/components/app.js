import React from 'react';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import { Switch, Route } from 'react-router-dom';
import NavBarContainer from './nav/navbar_container';
import MainPage from './main/main_page';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import Splash from './splash/splash';
import WineIndexContainer from './wine_index/wine_index_container'

const App = () => (
  <div>
    <NavBarContainer />
    <Switch>
        <Route path="/welcome" component={Splash} />
        <ProtectedRoute exact path="/" component={MainPage} />
        <ProtectedRoute exact path="/wines" component={WineIndexContainer} />
        <AuthRoute exact path="/login" component={LoginFormContainer} />
        <AuthRoute exact path="/signup" component={SignupFormContainer} />
    </Switch>
  </div>
);

export default App;