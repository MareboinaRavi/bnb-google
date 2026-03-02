# react-error-boundary-auto

Automatically add React Error Boundaries to routes and components with minimal setup.

## Why

Many React apps ship without complete error-boundary coverage because manually wrapping every route/component is tedious and easy to forget.

`react-error-boundary-auto` solves this by providing:

- A lightweight built-in `AutoErrorBoundary`
- Reset support via `resetKeys` and `resetErrorBoundary()`
- `autoWrapRoutes()` for route object trees
- `withAutoErrorBoundary()` for individual components

## Install

```bash
npm install react-error-boundary-auto
```

## Quick start

### 1) Auto-wrap React Router route objects

```jsx
import { createBrowserRouter } from 'react-router-dom';
import { autoWrapRoutes } from 'react-error-boundary-auto';
import HomePage from './HomePage';
import SettingsPage from './SettingsPage';

const routes = autoWrapRoutes([
  { path: '/', Component: HomePage },
  { path: '/settings', Component: SettingsPage }
], {
  fallbackRender: ({ error }) => <div>Route crashed: {error.message}</div>,
  onError: (error, info) => {
    console.error('Route error', error, info);
  }
});

export const router = createBrowserRouter(routes);
```

### 2) Auto-wrap a component

```jsx
import { withAutoErrorBoundary } from 'react-error-boundary-auto';
import Dashboard from './Dashboard';

export default withAutoErrorBoundary(Dashboard, {
  fallbackRender: () => <div>Dashboard unavailable.</div>
});
```

## How to use

Choose one of the integration styles below depending on your app architecture.

### A) Wrap your route definitions (recommended)

Use `autoWrapRoutes()` when you define routes as objects (for example in React Router v6+).

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { autoWrapRoutes } from 'react-error-boundary-auto';

import HomePage from './HomePage';
import SettingsPage from './SettingsPage';

const rawRoutes = [
  { path: '/', Component: HomePage },
  { path: '/settings', Component: SettingsPage }
];

const routes = autoWrapRoutes(rawRoutes, {
  fallbackRender: ({ error, resetErrorBoundary }) => (
    <div role="alert">
      <p>Something crashed: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  ),
  onError: (error, info) => {
    // send to Sentry/Datadog/etc
    console.error('Captured route error:', error, info);
  }
});

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
```

### B) Wrap one component using HOC

Use `withAutoErrorBoundary()` when you want a single component protected without changing parents.

```jsx
import { withAutoErrorBoundary } from 'react-error-boundary-auto';
import Dashboard from './Dashboard';

const SafeDashboard = withAutoErrorBoundary(Dashboard, {
  fallbackRender: ({ error }) => <div>Dashboard failed: {error.message}</div>
});

export default SafeDashboard;
```

### C) Wrap an existing element tree

Use `wrapElementWithBoundary()` when you already have an element and want to wrap it on the fly.

```jsx
import { wrapElementWithBoundary } from 'react-error-boundary-auto';

const protectedTree = wrapElementWithBoundary(<SomeComplexTree />, {
  fallbackRender: ({ error }) => <div>Tree failed: {error.message}</div>
});
```

### Reset behavior

- Call `resetErrorBoundary()` from your fallback UI to retry rendering.
- Or pass `resetKeys` to `AutoErrorBoundary`; when any key changes, the boundary resets automatically.

## API

### `AutoErrorBoundary`
A dependency-free class-based error boundary. Supports fallback elements, fallback render functions, and reset mechanics.

Props:
- `fallback`
- `fallbackRender`
- `onError(error, info)`
- `onReset()`
- `resetKeys`

### `autoWrapRoutes(routes, options)`
Recursively wraps each route's `element` and/or `Component` in `AutoErrorBoundary`.

Options include all boundary props plus:
- `mapRouteProps(route)` to customize boundary props per route.

### `withAutoErrorBoundary(Component, boundaryProps)`
Higher-order component that wraps a component with `AutoErrorBoundary`.

### `wrapElementWithBoundary(element, boundaryProps)`
Utility for directly wrapping any React element tree.

## License

MIT

## Development

```bash
npm test
```
