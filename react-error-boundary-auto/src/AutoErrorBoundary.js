import React from 'react';

/**
 * Default fallback UI when no custom fallback is provided.
 */
function DefaultFallback({ error, resetErrorBoundary }) {
  return React.createElement(
    'div',
    {
      role: 'alert',
      style: {
        padding: '1rem',
        border: '1px solid #ffcccc',
        borderRadius: '8px',
        background: '#fff5f5',
        color: '#7f1d1d',
        fontFamily: 'sans-serif'
      }
    },
    React.createElement('strong', null, 'Something went wrong.'),
    error ? React.createElement('pre', { style: { marginTop: '0.5rem' } }, error.message) : null,
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: resetErrorBoundary,
        style: {
          marginTop: '0.5rem',
          padding: '0.4rem 0.75rem',
          borderRadius: '6px',
          border: '1px solid #fecaca',
          background: '#fff',
          color: '#7f1d1d',
          cursor: 'pointer'
        }
      },
      'Try again'
    )
  );
}

/**
 * A minimal, dependency-free React error boundary.
 */
export class AutoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    const { onError } = this.props;

    if (typeof onError === 'function') {
      onError(error, info);
    }
  }

  componentDidUpdate(prevProps) {
    const { resetKeys = [] } = this.props;
    const { error } = this.state;

    if (!error) {
      return;
    }

    if (haveResetKeysChanged(prevProps.resetKeys || [], resetKeys)) {
      this.reset();
    }
  }

  reset() {
    const { onReset } = this.props;
    this.setState({ error: null });

    if (typeof onReset === 'function') {
      onReset();
    }
  }

  render() {
    const { error } = this.state;
    const { fallback, fallbackRender, children } = this.props;

    if (!error) {
      return children;
    }

    const fallbackProps = { error, resetErrorBoundary: this.reset };

    if (typeof fallbackRender === 'function') {
      return fallbackRender(fallbackProps);
    }

    if (React.isValidElement(fallback)) {
      return React.cloneElement(fallback, fallbackProps);
    }

    if (typeof fallback === 'function') {
      return fallback(fallbackProps);
    }

    return React.createElement(DefaultFallback, fallbackProps);
  }
}

function haveResetKeysChanged(prevResetKeys, nextResetKeys) {
  return (
    prevResetKeys.length !== nextResetKeys.length ||
    prevResetKeys.some((item, index) => !Object.is(item, nextResetKeys[index]))
  );
}

export default AutoErrorBoundary;
