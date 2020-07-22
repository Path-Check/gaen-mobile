import React from "react"

import { ErrorFallbackComponent } from "./ErrorFallbackComponent"

type Props = {
  children: JSX.Element
  onError?: () => void
}

type State = { error: Error | string; hasError: boolean }

export class ErrorBoundary extends React.Component<Props, State> {
  state = { error: "", hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { error, hasError: true }
  }

  resetError = (): void => {
    this.setState({ error: "", hasError: false })
  }

  render(): JSX.Element {
    return this.state.hasError ? (
      <ErrorFallbackComponent
        error={this.state.error}
        resetError={this.resetError}
      />
    ) : (
      this.props.children
    )
  }
}
