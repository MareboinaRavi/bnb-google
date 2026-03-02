import React from 'react';
import { AutoErrorBoundary } from './AutoErrorBoundary.js';

/**
 * Recursively wraps route objects (React Router style) with error boundaries.
 *
 * Supports both route.element and route.Component shapes.
 */
export function autoWrapRoutes(routes, options = {}) {
  const {
    fallback,
    fallbackRender,
    onError,
    onReset,
    mapRouteProps
  } = options;

  const baseBoundaryProps = {
    fallback,
    fallbackRender,
    onError,
    onReset
  };

  return routes.map((route) => {
    const routeBoundaryProps = typeof mapRouteProps === 'function'
      ? {
          ...baseBoundaryProps,
          ...mapRouteProps(route)
        }
      : baseBoundaryProps;

    const wrappedRoute = { ...route };

    if (route.element) {
      wrappedRoute.element = React.createElement(
        AutoErrorBoundary,
        routeBoundaryProps,
        route.element
      );
    }

    if (route.Component) {
      const Original = route.Component;
      wrappedRoute.Component = function AutoBoundRouteComponent(props) {
        return React.createElement(
          AutoErrorBoundary,
          routeBoundaryProps,
          React.createElement(Original, props)
        );
      };
      wrappedRoute.Component.displayName =
        `AutoBound(${Original.displayName || Original.name || 'RouteComponent'})`;
    }

    if (Array.isArray(route.children)) {
      wrappedRoute.children = autoWrapRoutes(route.children, options);
    }

    return wrappedRoute;
  });
}

export default autoWrapRoutes;
