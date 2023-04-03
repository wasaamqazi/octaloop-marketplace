import { auth, app } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  updateProfile,
  isSignInWithEmailLink,
  signInWithEmailLink,
  applyActionCode,
} from "firebase/auth";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getDatabase, ref, set, push, get } from "firebase/database";
import { db, firestoredb } from "../../firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../firebase";
import dAvatar from "../../images/avatars/defualt-avatar.png";
import { ToastContainer, toast } from "react-toastify";

const PageSignUp = () => {
  const [error, setError] = useState("");
  const [registeremail, setRegisterEmail] = useState("");
  const [registerpassword, setRegisterPassword] = useState("");
  const history = useHistory();
  const currentUser = useAuth();
  // const [user, setUser] = useState({});

  // onAuthStateChanged(auth, (currentUser) => {
  //   setUser(currentUser);
  // });
  // const database = getDatabase(app);

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var api = "AIzaSyC54DYZ5MMPm3a3Z43igwoxvR6IEen0cyA";
    var results = regex.exec(
      "https://example.com/usermgmt?mode=resetPassword&oobCode=ABC123&apiKey=" +
        api +
        "&lang=fr"
    );
 
    if (results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
  }

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

  const register = async () => {
    const actionCode = getParameterByName("oobCode");
    createUserWithEmailAndPassword(auth, registeremail, registerpassword)
      .then((userCredential) => {
        applyActionCode(auth, actionCode)
          .then((resp) => {
            // Email address has been verified.
            // TODO: Display a confirmation message to the user.
            // You could also provide the user with a link back to the app.
            // TODO: If a continue URL is available, display a button which on
            // click redirects the user back to the app via continueUrl with
            // additional state determined from that URL's parameters.
            console.log(resp);
          })
          .catch((error) => {
            // Code is invalid or expired. Ask the user to verify their email address
            // again.
          })
          .catch((error) => {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
          });

        setDoc(doc(firestoredb, "profileinfo", userCredential.user.uid), {
          Bio: "",
          Email: userCredential.user.email,
          Facebook: "",
          Name: "",
          Twitter: "",
          Website: "",
          telegram: "",
        });

        // history.push("/account");
      })
      .catch(alert);

    //
    // console.log();
    // updateProfile(currentUser, dAvatar);
    // console.log(currentUser.photoURL);
    // const db = getDatabase(app);

    // const postListRef = ref(db, "users");
    // const newPostRef = push(postListRef);
    // set(newPostRef, {
    //   email: registeremail,
    //   password: registerpassword,
    // });
    // console.log(user);
  };

  // useEffect(() => {
  //   const actionCode = getParameterByName("oobCode");
  //   console.log(actionCode);
  // });

  // const register = (e) => {
  //   e.preventDefault();

  //   const db = getDatabase(app);

  //   const postListRef = ref(db, "users");
  //   const newPostRef = push(postListRef);
  //   set(newPostRef, {
  //     email: email,
  //     password: password,
  //   });
  // };

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

  return (
    <div className={`nc-PageSignUp`} data-nc-id="PageSignUp">
      {/* <ToastContainer /> */}
      <Helmet>
        <title>Sign up || Smash NFT</title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Signup
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
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
              onChange={(event) => setRegisterEmail(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
              Password
            </span>
            <Input
              type="password"
              className="mt-1"
              onChange={(event) => setRegisterPassword(event.target.value)}
            />
          </label>

          {/* <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
              </span>
              <Input
                type="password"
                className="mt-1"
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label> */}
          <ButtonPrimary onClick={register}>Continue</ButtonPrimary>
          {/* <h3>Current User: {auth.currentUser.email}</h3> */}
          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already have an account? {` `}
            <Link className="text-green-600" to="/login">
              Sign in
            </Link>
          </span>

          {/* <h3>{user?.email}</h3> */}
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
