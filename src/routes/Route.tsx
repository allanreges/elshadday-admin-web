import React from 'react';
import {
  Route as ReactDomRoute,
  RouteProps as ReactRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/Auth';

interface RouteProps extends ReactRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  console.log(user);

  return (
    <ReactDomRoute
      {...rest}
      render={() => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
            <Redirect to={{ pathname: isPrivate ? '/' : '/dashboard' }} />
          );
      }}
    />
  );
};

export default Route;
