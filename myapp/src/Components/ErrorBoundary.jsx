import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary:", error);
    console.error("Error Info:", errorInfo);

    // Production mein yahan Sentry / monitoring service
    // ko error send kar sakte ho.
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">

            <h2 className="text-2xl font-semibold mb-3">
              Something went wrong
            </h2>

            <p className="text-gray-500 mb-5">
              This page couldn't be loaded.
            </p>

            <button
              onClick={this.handleRetry}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white"
            >
              Try Again
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;