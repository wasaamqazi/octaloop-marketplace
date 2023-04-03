import ButtonPrimary from "shared/Button/ButtonPrimary";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import NcImage from "shared/NcImage/NcImage";
// import I404Png from "images/404.png";
import  imageTest from "images/BecomeAnAuthorImg.png";
import { auth } from "../../firebase";

const Page404 = () => {
  const [user, setUser] = useState(null);
  console.log(user);
  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // User logged in
        setUser(userAuth);
      } else {
        // User logged out
        setUser(null);
      }
    });
  }, []);
  return (
    <div className="nc-Page404">
      <Helmet>
        <title> Smash NFT</title>
      </Helmet>
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto space-y-2">
          <NcImage src={imageTest} />
          {/* <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
            THE PAGE YOU WERE LOOKING FOR DOESN'T EXIST.{" "}
          </span> */}
          <div className="pt-8">
            {!user ? (
              <>
                <ButtonPrimary href="/login">Login</ButtonPrimary>{" "}
                <ButtonPrimary href="/signup">SignUp</ButtonPrimary>
              </>
            ) : (
              <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
            )}
          </div>
        </header>
      </div>
    </div>
  );
};

export default Page404;
