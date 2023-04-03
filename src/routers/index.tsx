import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Page } from "./types";
import ScrollToTop from "./ScrollToTop";
import Footer from "shared/Footer/Footer";
import PageHome from "containers/PageHome/PageHome";
import Page404 from "containers/Page404/Page404";
import AuthorPage from "containers/AuthorPage/AuthorPage";
import AccountPage from "containers/AccountPage/AccountPage";
import PageContact from "containers/PageContact/PageContact";
import PageAbout from "containers/PageAbout/PageAbout";
import PageSignUp from "containers/PageSignUp/PageSignUp";
import PageLogin from "containers/PageLogin/PageLogin";
import PageSubcription from "containers/PageSubcription/PageSubcription";
import BlogPage from "containers/BlogPage/BlogPage";
import BlogSingle from "containers/BlogPage/BlogSingle";
import SiteHeader from "containers/SiteHeader";
import NftDetailPage from "containers/NftDetailPage/NftDetailPage";
import PageCollection from "containers/PageCollection.jsx";
import PageSearch from "containers/PageSearch";
import PageUploadItem from "containers/PageUploadItem";
import PageUploadMultipleItems from "containers/PageUploadMultipleItems";
import PageUploadBulkItems from "containers/PageUploadBulkItems";
import PageConnectWallet from "containers/PageConnectWallet";
import PageHome2 from "containers/PageHome/PageHome2.jsx";
import PageHome3 from "containers/PageHome/PageHome3";
import AllCollection from "components/allcollection";
import MyNFTs from "components/mynfts";
import CreateCollection from "components/CreateCollection/CreateCollection.js";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "../firebase";

export const pages: Page[] = [
  { path: "/", exact: true, component: PageHome2 },
  { path: "/#", exact: true, component: PageHome2 },
  { path: "/home2", exact: true, component: PageHome },
  { path: "/home3", exact: true, component: PageHome3 },
  //
  { path: "/home-header-2", exact: true, component: PageHome },
  { path: "/nft-detailt/:id", component: NftDetailPage },
  { path: "/page-collection/:id", component: PageCollection },
  { path: "/page-search", component: PageSearch },
  { path: "/page-author", component: AuthorPage },
  { path: "/account", component: AccountPage },
  { path: "/page-upload-item", component: PageUploadItem },
  { path: "/page-upload-multiple-items", component: PageUploadMultipleItems },
  { path: "/page-upload-bulk-items", component: PageUploadBulkItems },
  { path: "/connect-wallet", component: PageConnectWallet },
  //
  { path: "/blog", component: BlogPage },
  { path: "/blog-single", component: BlogSingle },
  //
  { path: "/contact", component: PageContact },
  { path: "/about", component: PageAbout },
  { path: "/signup", component: PageSignUp },
  { path: "/login", component: PageLogin },
  { path: "/subscription", component: PageSubcription },

  { path: "/createCollection", component: CreateCollection },
  { path: "/allcollections", component: AllCollection },
  { path: "/mynfts", component: MyNFTs },
  // { path: "/uploadImageToS3", component: UploadImageToS3WithNativeSdk },
];

const Routes = () => {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // User logged in
        setUser(userAuth);
      } else {
        // User logged out
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <BrowserRouter basename="/">
      <ScrollToTop />
      <SiteHeader />
      <Switch>
        {pages.map(({ component, path, exact }) => {
          return (
            <Route
              key={path}
              component={component}
              exact={!!exact}
              path={path}
            />
          );
        })}
        <Route component={Page404} />
      </Switch>{" "}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Footer />
    </BrowserRouter>
  );
};

export default Routes;
