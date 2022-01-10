import React from "react";
import { Helmet } from "react-helmet";
import { Route, Navigate, Routes } from "react-router-dom";
import ROUTER_CONFIG from "../../router";
import { LayoutContainer as Layout } from "../Layout";
import NotFound from "../../pages/NotFound";
import ROUTES from "../../router/routes";

interface Props {
  isAuthenticated: boolean;
}

const PrivateRouter = ({ isAuthenticated }: Props): React.ReactElement => (
  <Routes>
    {ROUTER_CONFIG.map((route) => {
      const {
        metaTitle,
        metaDescription,
        metaKeywords,
        metaOgImage,
        isPrivate,
        component: Comp,
        key,
      } = route;
      const loginRedirect = (): React.ReactElement => {
        return isAuthenticated ? (
          <Comp />
        ) : (
          <Navigate to={{ pathname: ROUTES.login }} />
        );
      }
      const renderPage: React.FC = () => {
        return (
          <>
            <Helmet>
              <title>{metaTitle}</title>
              <meta property="og:title" content={metaTitle} />
              <meta name="description" content={metaDescription} />
              <meta property="og:description" content={metaDescription} />
              <meta name="keywords" content={metaKeywords} />
              <meta property="og:image" content={metaOgImage} />
            </Helmet>
            <Layout page={key}>
              {
                isPrivate
                ? loginRedirect()
                : <Comp />
              }
            </Layout>
          </>
        )
      }
      return (
        <Route
          key={key}
          path={route.path}
          element={renderPage({})}
        />
      );
    })}
    <Route
      path="*"
      element={<Layout page="404"><NotFound /></Layout>}
    />
  </Routes>
);

export default PrivateRouter;
