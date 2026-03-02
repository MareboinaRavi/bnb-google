import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';

import {
  AutoErrorBoundary,
  autoWrapRoutes,
  withAutoErrorBoundary,
  wrapElementWithBoundary
} from '../src/index.js';

function Example() {
  return React.createElement('div', null, 'ok');
}

test('exports are available', () => {
  assert.equal(typeof AutoErrorBoundary, 'function');
  assert.equal(typeof autoWrapRoutes, 'function');
  assert.equal(typeof withAutoErrorBoundary, 'function');
  assert.equal(typeof wrapElementWithBoundary, 'function');
});

test('withAutoErrorBoundary wraps component with AutoErrorBoundary', () => {
  const Wrapped = withAutoErrorBoundary(Example);
  const element = Wrapped({});

  assert.equal(element.type, AutoErrorBoundary);
  assert.equal(element.props.children.type, Example);
});

test('wrapElementWithBoundary wraps arbitrary element', () => {
  const child = React.createElement('span', null, 'value');
  const wrapped = wrapElementWithBoundary(child);

  assert.equal(wrapped.type, AutoErrorBoundary);
  assert.equal(wrapped.props.children, child);
});

test('autoWrapRoutes wraps component routes and nested children', () => {
  function Child() {
    return React.createElement('div', null, 'child');
  }

  const routes = autoWrapRoutes([
    {
      path: '/',
      Component: Example,
      children: [{ path: '/child', Component: Child }]
    }
  ]);

  const rootComp = routes[0].Component;
  const childComp = routes[0].children[0].Component;

  assert.equal(typeof rootComp, 'function');
  assert.equal(typeof childComp, 'function');

  const rootElement = rootComp({});
  assert.equal(rootElement.type, AutoErrorBoundary);
  assert.equal(rootElement.props.children.type, Example);

  const childElement = childComp({});
  assert.equal(childElement.type, AutoErrorBoundary);
  assert.equal(childElement.props.children.type, Child);
});
