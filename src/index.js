// imports
import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App/App';
import { 
  BrowserRouter as Router,
} from 'react-router-dom';
import ProtectedRoute from './helpers/ProtectedRoute';

// style files
import './css/App.scss';



// Main App Container Component

function MainAppContainer(){
  return(
    <div className="mainAppContainer">
      <Router>
        {/* Only go to app Route if Authorised*/}
        <ProtectedRoute path = "/app" >
          {/*App component that contains other Components*/}
          <App/>
        </ProtectedRoute>
      </Router>
    </div>
  )
}



ReactDOM.render(<MainAppContainer />, document.getElementById('root'));
