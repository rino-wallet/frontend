import React from "react";
import { NavLink } from "react-router-dom";
import routes from "../../router/routes";

export const PublicLayout: React.FC = ({ children }) => {
  return (
    <div className="container md:max-w-2xl min-h-screen flex flex-col bg-white m-auto text-sm">
      <header className="flex justify-end border-b border-gray-100 py-2 px-3">
        <NavLink id="nav-link-login" className="link mx-3 inline-block my-3" to={routes.login}>Login</NavLink>
        <NavLink id="nav-link-register" className="link mx-3 inline-block my-3" to={routes.register}>Register</NavLink>
      </header>
      <main className="flex-1 container mx-auto p-5">{children}</main>
    </div>
  )
}

interface Props {
  signOut: () => Promise<void>
}

export const PrivateLayout: React.FC<Props> = ({ children, signOut }) => {
  return (
    <div className="container md:max-w-2xl min-h-screen flex flex-col bg-white m-auto text-sm">
      <header className="flex justify-end border-b border-gray-100 py-2 px-3">
        <NavLink id="nav-link-wallets" className="link mx-3 inline-block my-3" to={routes.wallets}>Wallets</NavLink>
        <NavLink id="nav-link-settings" className="link mx-3 inline-block my-3" to={routes.profile}>Settings</NavLink>
        <button className="link mx-3 inline-block my-3" name="log-out" onClick={signOut}>Logout</button>
      </header>
      <main className="flex-1 container mx-auto p-5">{children}</main>
    </div>
  )
}
