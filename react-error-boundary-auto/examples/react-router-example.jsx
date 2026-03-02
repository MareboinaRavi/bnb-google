import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { autoWrapRoutes } from '../src';

function Home() {
  return <h1>Home</h1>;
}

function Crash() {
  throw new Error('Boom!');
}

const routes = autoWrapRoutes([
  { path: '/', Component: Home },
  { path: '/crash', Component: Crash }
], {
  fallbackRender: ({ error, resetErrorBoundary }) => (
    <div>
      <p>Oops: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  )
});

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
