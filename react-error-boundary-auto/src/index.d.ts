import * as React from 'react';

export type FallbackRenderParams = {
  error: Error;
  resetErrorBoundary: () => void;
};

export type BoundaryProps = {
  fallback?: React.ReactNode | ((params: FallbackRenderParams) => React.ReactNode);
  fallbackRender?: (params: FallbackRenderParams) => React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: unknown[];
};

export class AutoErrorBoundary extends React.Component<
  BoundaryProps & { children?: React.ReactNode }
> {}

export function withAutoErrorBoundary<P>(
  Component: React.ComponentType<P>,
  boundaryProps?: BoundaryProps
): React.ComponentType<P>;

export function wrapElementWithBoundary(
  element: React.ReactNode,
  boundaryProps?: BoundaryProps
): React.ReactElement;

export type RouteLike = {
  element?: React.ReactNode;
  Component?: React.ComponentType<any>;
  children?: RouteLike[];
  [key: string]: unknown;
};

export type AutoWrapRouteOptions = BoundaryProps & {
  mapRouteProps?: (route: RouteLike) => Partial<BoundaryProps>;
};

export function autoWrapRoutes<T extends RouteLike>(
  routes: T[],
  options?: AutoWrapRouteOptions
): T[];
