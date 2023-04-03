import React, { FC } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import { Link } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth, app } from "../../firebase";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDatabase, ref, set, push, get } from "firebase/database";

const loginSocials = [
  {
    name: "Continue with Facebook",
    href: "#",
    icon: facebookSvg,
  },
  // {
  //   name: "Continue with Twitter",
  //   href: "#",
  //   icon: twitterSvg,
  // },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

const PageLogin = () => {
  const [loginemail, setLoginEmail] = useState("");
  const [loginpassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});
  const history = useHistory();

  // onAuthStateChanged(auth, (currentUser) => {
  //   console.log("setting user");
  //   setUser(currentUser);
  //   console.log(" user is set");
  // });

  const registerFb = () => {
    const provider = new FacebookAuthProvider();
    const db = getDatabase(app);
    const postListRef = ref(db, "facebooksignin");
    const newPostRef = push(postListRef);

    signInWithPopup(auth, provider)
      .then((re) => {
     
        set(newPostRef, {
          Name: re.user.displayName,
          Email: re.user.email,
        });
        history.push("/");
      })

      .catch((err) => {
        console.log(err.message);
      });
  };

  const registerGoogle = () => {
    const providerS = new GoogleAuthProvider();
    const db = getDatabase(app);
    const postListRef = ref(db, "googlesignin");
    const newPostRef = push(postListRef);

    signInWithPopup(auth, providerS)
      .then((re) => {
        console.log(re);
        set(newPostRef, {
          Name: re.user.displayName,
          Email: re.user.email,
        });
        history.push("/");
      })

      .catch((err) => {
        console.log(err.message);
      });
  };

  const login = async (e) => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginemail,
        loginpassword
      );
      toast("User Logged in Succesfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      history.push("/account");
    } catch (error) {
      console.log(error);
      toast("Please Enter Correct Email/Passowrd", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={`nc-PageLogin `} data-nc-id="PageLogin">
      <Helmet>
        <title>Login || Booking React Template</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Login
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* <div className="grid gap-3">
            <a
              className="social-login-main flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              onClick={registerFb}
            >
              <img className="flex-shrink-0" src={facebookSvg} alt="Facebook" />
              <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                Continue with Facebook
              </h3>
            </a>
            <a
              className="social-login-main flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              onClick={registerGoogle}
            >
              <img className="flex-shrink-0" src={googleSvg} alt="Google" />
              <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                Continue with Google
              </h3>
            </a>
          </div> */}
          {/* OR */}
          {/* <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div> */}
          {/* FORM */}

          <label className="block">
            <span className="text-neutral-800 dark:text-neutral-200">
              Email address
            </span>
            <Input
              type="email"
              placeholder="example@example.com"
              className="mt-1"
              onChange={(event) => setLoginEmail(event.target.value)}
            />
          </label>
          <label className="block">
            {/* <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
              Password
              <Link to="/forgot-pass" className="text-sm text-green-600">
                Forgot password?
              </Link>
            </span> */}
            <Input
              type="password"
              className="mt-1"
              onChange={(event) => setLoginPassword(event.target.value)}
            />
          </label>
          <ButtonPrimary type="submit" onClick={login}>
            Continue
          </ButtonPrimary>
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
          {/* Same as */}
          <ToastContainer />
          <h3>{user?.email}</h3>
          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            New user? {` `}
            <Link className="text-green-600" to="/signup">
              Create an account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
