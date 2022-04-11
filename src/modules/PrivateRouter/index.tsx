import React from "react";
import { Helmet } from "react-helmet";
import { Route, Navigate, Routes } from "react-router-dom";
import ROUTER_CONFIG from "../../router";
import { LayoutContainer as Layout } from "../Layout";
import { browserFeatures } from "../../constants";
import { wasmSupported } from "../../utils";
import NotFound from "../../pages/NotFound";
import UnsupportedBrowser from "../../pages/UnsupportedBrowser";
import ROUTES from "../../router/routes";


const featuresMap = {
  [browserFeatures.webassembly]: wasmSupported,
}

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
        requiredFeatures,
      } = route;
      const loginRedirect = (): React.ReactElement => {
        return isAuthenticated ? (
          <Comp />
        ) : (
          <Navigate to={{ pathname: ROUTES.login }} />
        );
      }
      const renderPage: React.FC = () => {
        // Check if browser supports all features required for the current page
        // Show error message if at leasT one feature is not available
        if (requiredFeatures && requiredFeatures.length) {
          const unsupported = !requiredFeatures.reduce((result, feature) => featuresMap[feature], true);
          if (unsupported) {
            return <Layout page="unsupported_browser"><UnsupportedBrowser /></Layout>
          }
        }
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
      path="/"
      element={<Navigate to={ROUTES.wallets} />}
    />
    <Route
      path="*"
      element={<Layout page="404"><NotFound /></Layout>}
    />
  </Routes>
);

export default PrivateRouter;
