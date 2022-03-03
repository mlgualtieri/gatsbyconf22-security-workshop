import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/privateRoute"
import Dashboard from "../components/dashboard"
import Login from "../components/login"
import Logout from "../components/logout"

const App = () => (
  <Layout>
    <Router basepath="/app">
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <Login path="/login" />
      <Logout path="/logout" />
    </Router>
  </Layout>
)

export default App
