'use client';

import React, { Component, ReactNode } from 'react';

/**
 * ERROR BOUNDARY COMPONENT
 * ========================
 *
 * WHAT IT IS:
 * An Error Boundary catches JavaScript errors that occur during RENDERING
 * of its child components. Instead of crashing the whole app with a white
 * screen, it displays a fallback UI.
 *
 * WHAT IT CATCHES:
 * - Errors in render methods
 * - Errors in lifecycle methods (componentDidMount, componentDidUpdate, etc.)
 * - Errors in constructors of child components
 * - Example: props.something.toString() when props.something is undefined
 *
 * WHAT IT DOES NOT CATCH:
 * - Event handlers (use try/catch inside onClick, onChange, etc.)
 * - Async code like setTimeout or promises (use .catch() on promises)
 * - API/network errors (use isError from React Query)
 * - Server-side rendering errors
 * - Errors thrown in the Error Boundary itself
 *
 * WHY IT MUST BE A CLASS COMPONENT:
 * React only supports Error Boundaries as class components (as of React 18).
 * The lifecycle methods getDerivedStateFromError and componentDidCatch have
 * no hook equivalents. This is a React limitation, not a choice.
 *
 * HOW IT WORKS:
 * 1. A child component throws an error during rendering
 * 2. React calls getDerivedStateFromError() -> sets hasError = true
 * 3. React calls componentDidCatch() -> logs the error (optional)
 * 4. The component re-renders, showing the fallback UI instead of children
 *
 * USAGE:
 * Basic - shows default error message:
 *   <ErrorBoundary>
 *     <ComponentThatMightCrash />
 *   </ErrorBoundary>
 *
 * With custom fallback UI:
 *   <ErrorBoundary fallback={<MyCustomErrorComponent />}>
 *     <ComponentThatMightCrash />
 *   </ErrorBoundary>
 *
 * WHEN TO USE:
 * - Wrap components that render external/API data (data might be malformed)
 * - Wrap third-party components you don't control
 * - Wrap complex components with many nested children
 * - Around route-level components for page isolation
 *
 * WHEN NOT TO USE:
 * - For handling API errors (use React Query's isError instead)
 * - For form validation errors (use form state)
 * - For user-facing error messages (use component state)
 */

interface IErrorBoundaryProps {
    children: ReactNode;
    /** Optional custom fallback UI to show when an error occurs */
    fallback?: ReactNode;
}

interface IErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
    constructor(props: IErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    /**
     * Called when a child component throws an error.
     * Updates state so the next render shows the fallback UI.
     * This is a static method - it cannot access 'this'.
     */
    static getDerivedStateFromError(error: Error): IErrorBoundaryState {
        return {
            hasError: true,
            error: error
        };
    }

    /**
     * Called after an error is caught. Use this for logging.
     * Unlike getDerivedStateFromError, this has access to component info.
     */
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log to console in development
        console.error('ErrorBoundary caught an error:', error);
        console.error('Component stack:', errorInfo.componentStack);

        // TODO: In production, you could send this to an error tracking service
        // Example: Sentry.captureException(error, { extra: errorInfo });
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // If a custom fallback was provided, use it
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI - matches the app's existing error styling
            return (
                <div className="ms-error-boundary ms-side-spacing ms-centered">
                    <p className="ms-body-text">Something went wrong while loading this content.</p>
                    <p className="ms-small-text">Please try refreshing the page.</p>
                </div>
            );
        }

        // No error - render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;
