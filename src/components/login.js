import * as React from "react"
import { useForm } from "react-hook-form"
import { useNotification } from "../hooks/useNotificationHook"
import { handleLogin, isLoggedIn } from "../services/auth"

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { message, setMessage } = useNotification()
  if (isLoggedIn()) {
    window.location.href = `/app/dashboard`
  }

  const onSubmit = data => {
    handleLogin(data).catch(error => {
      setMessage(error.message)
    })
  }

  console.log({ errors })

  return (
    <>
      <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="first-name">Username</label>
        <input
          id="username"
          type="text"
          defaultValue="user@test.com"
          {...register("username", { required: true, maxLength: 80 })}
        />

        <label htmlFor="last-name">Password</label>
        <input
          id="password"
          type="password"
          defaultValue="my_secret_password"
          {...register("password", { required: true, maxLength: 100 })}
        />

        <h5 id="error" className="error">
          {message}
        </h5>

        <input type="submit" value="Login" />
      </form>
    </>
  )
}

export default LoginPage
