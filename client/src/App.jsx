import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import PrivateRoute from './components/routes/privateRoute';
import PrivateScreen from './components/screens/privateScreen';
import RegisterScreen from './components/screens/registerScreen';
import LoginScreen from './components/screens/loginScreen';
import ResetPasswordScreen from './components/screens/resetPasswordScreen';
import ForgotPasswordScreen from './components/screens/forgotPasswordScreen';


const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <PrivateRoute exact path="/" component={PrivateScreen} />
          <Route exact path='/register' component={RegisterScreen}></Route>
          <Route exact path='/login' component={LoginScreen}></Route>
          <Route exact path='/forgotPassword' component={ForgotPasswordScreen}></Route>
          <Route exact path='/resetPassword/:resetToken' component={ResetPasswordScreen}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
