// imports
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App/App';
import queryString from 'query-string';
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import ProtectedRoute from './helpers/ProtectedRoute';
import LSComponent from "./Components/LSComponent"
// style files
import './css/App.scss';

// Main App Container Component
function MainAppContainer(){
  return(
    <div className="mainAppContainer">
      <Router>
        <Switch>
          {/* Only go to app Route if Authorised*/}
          <ProtectedRoute path = "/app" >
          {/*App component that contains other Components*/}
            <App/>
          </ProtectedRoute>
          <Route exact path = "/">
            <LSComponent />
          </Route>
          <Route path = "/social" exact component = {(props) => {
                const token = queryString.parse(props.location.search).token;
                if(!token){
                  console.log("no token")
                  props.history.push("/")
                  return null
                }
                // checking token validity
                // TODO --decode
                //setting token
                localStorage.setItem("splitzoneToken", token)
                props.history.push("/app");
                return null
              }}>
            </Route>
            <Route component = {(props) => {
              props.history.push("/")
              return null
            }} />
        </Switch>
      </Router>
    </div>
  )
}

ReactDOM.render(<MainAppContainer />, document.getElementById('root'));
