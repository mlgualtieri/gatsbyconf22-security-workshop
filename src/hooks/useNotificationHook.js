import * as React from "react"

export function useNotification(defaultValue = "") {
  const [message, setMessage] = React.useState(defaultValue)

  const onSetMessage = (event, message) => {
    event.preventDefault()
    setMessage(message)
  }

  return {
    message,
    setMessage,
    onSetMessage,
  }
}
