import React, { useEffect, useState } from "react";
import "./App.css";

// import firebase from "firebase/app";
// import "firebase/auth";

import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

// react router
import { BrowserRouter, Route, Routes } from "react-router-dom";

//components
import SignIn from "./components/SignIn";
import Home from "./components/Home";

const App = () => {
  const [viewOtpForm, setViewOtpForm] = useState(false);
  // const [user, setUser] = useState(false);
  const [user, setUser] = useState([]);

  // const auth = firebase.auth();

  const firebaseConfig = {
    apiKey: "AIzaSyCQj9gTigKyUlHZyz5RPoINoXu8lLsdCTk",
    authDomain: "otp1-f6a77.firebaseapp.com",
    projectId: "otp1-f6a77",
    storageBucket: "otp1-f6a77.appspot.com",
    messagingSenderId: "804183130339",
    appId: "1:804183130339:web:826e552eb1f91ef163c5d6",
    measurementId: "G-HWX6VESR0F"
  };

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();


  useEffect(() => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container", {
      size: "invisible",
      callback: function (response) {
        console.log("Captcha Resolved");
      },
      defaultCountry: "IN",
    }
    );
  }, []);

  const loginSubmit = (e) => {
    e.preventDefault();

    let phone_number = e.target.phone.value;
    const appVerifier = window.recaptchaVerifier;

    auth
      .signInWithPhoneNumber(phone_number, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        console.log("otp sent");
        setViewOtpForm(true);
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        alert(error.message);
      });
  };

  const otpSubmit = (e) => {
    e.preventDefault();

    let opt_number = e.target.otp_value.value;

    window.confirmationResult
      .confirm(opt_number)
      .then((confirmationResult) => {
        console.log(confirmationResult);
        console.log("success");
        window.open("/", "_self");
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        alert(error.message);
      });
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    }
  });

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        window.open("/signin", "_self");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' signOut={signOut} user={user} element={<Home />} />
        {/* <Home signOut={signOut} user={user} />
        </Route> */}
        <Route path='/signin' loginSubmit={loginSubmit} otpSubmit={otpSubmit} viewOtpForm={viewOtpForm} element={<SignIn />} />
        {/* <SignIn  />
        </Route> */}
      </Routes>
    </BrowserRouter>
    // <Router>
    //   <div id="recaptcha-container"></div>
    //   <Switch>
    //     <Route path="/" exact>
    //       <Home signOut={signOut} user={user} />
    //     </Route>
    //     <Route path="/signin" exact>
    //       <SignIn
    // loginSubmit={loginSubmit}
    // otpSubmit={otpSubmit}
    // viewOtpForm={viewOtpForm}
    //       />
    //     </Route>
    //   </Switch>
    // </Router>
  );
};

export default App;