import React from 'react';
import { AutoErrorBoundary } from './AutoErrorBoundary.js';

/**
 * Wrap a React component with an error boundary.
 */
export function withAutoErrorBoundary(Component, boundaryProps = {}) {
  const wrappedName = Component.displayName || Component.name || 'Component';

  function WrappedComponent(props) {
    return React.createElement(
      AutoErrorBoundary,
      boundaryProps,
      React.createElement(Component, props)
    );
  }

  WrappedComponent.displayName = `withAutoErrorBoundary(${wrappedName})`;
  return WrappedComponent;
}

/**
 * Wraps an existing React element tree in an error boundary.
 */
export function wrapElementWithBoundary(element, boundaryProps = {}) {
  return React.createElement(AutoErrorBoundary, boundaryProps, element);
}
