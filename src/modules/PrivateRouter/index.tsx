import React from "react";
import { Helmet } from "react-helmet";
import { Route, Redirect, Switch } from "react-router-dom";
import ROUTER_CONFIG from "../../router";
import { PrivateLayoutContainer as PrivateLayout, PublicLayoutContainer as PublicLayout } from "../Layout";
import ROUTES from "../../router/routes";

interface Props {
  isAuthenticated: boolean;
}

const PrivateRouter = ({ isAuthenticated }: Props): React.ReactElement => (
  <Switch>
    {ROUTER_CONFIG.map((route) => {
      const {
        metaTitle,
        metaDescription,
        metaKeywords,
        metaOgImage,
        isPrivate,
        component: Comp,
        exact,
        key,
      } = route;
      const loginRedirect = (p: any): React.ReactElement =>
        isAuthenticated ? (
          <PrivateLayout>
            <Comp {...p} />
          </PrivateLayout>
        ) : (
          <Redirect to={{ pathname: ROUTES.login }} />
        );
      return (
        <Route
          exact={exact}
          key={key}
          path={route.path}
          render={(p): React.ReactElement => (
            <>
              <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="description" content={metaDescription} />
                <meta property="og:description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:image" content={metaOgImage} />
              </Helmet>
              {isPrivate ? (
                loginRedirect(p)
              ) : (
                <PublicLayout>
                  <Comp {...p} />
                </PublicLayout>
              )}
            </>
          )}
        />
      );
    })}
  </Switch>
);

export default PrivateRouter;
