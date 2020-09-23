import React, { ReactNode, Component } from "react"

import { ErrorScreen } from "./ErrorScreen"

type Props = {
  children: ReactNode
  onError?: () => void
}

type State = { error: Error | string; hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state = { error: "", hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { error, hasError: true }
  }

  resetError = (): void => {
    this.setState({ error: "", hasError: false })
  }

  render(): ReactNode {
    return this.state.hasError ? (
      <ErrorScreen error={this.state.error} resetError={this.resetError} />
    ) : (
      this.props.children
    )
  }
}
