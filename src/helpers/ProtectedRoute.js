import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom'


import Authentication from './Authentication'

export default function ProtectedRoute({children, ...rest}){
  return(
    <Route
    {...rest}
    render={({ location }) =>
      Authentication.checkLogIn() ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: location }
          }}
        />
      )
    }
  />
  )
} 