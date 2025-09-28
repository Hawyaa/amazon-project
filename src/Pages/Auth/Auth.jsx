import React, { useState, useContext } from "react";
import classes from "./SignUp.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../Utility/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import { ClipLoader } from "react-spinners";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState({
        signIn: false,
        signUP: false,
    });
    const [{ user }, dispatch] = useContext(DataContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect path from location state (from ProtectedRoute)
    const redirectPath = location.state?.redirect || "/";

    const authHandler = async (e) => {
        e.preventDefault();
        console.log(e.target.name);
        if (e.target.name == "signin") {
            // firebase auth - sign in
            setLoading({ ...loading, signIn: true });
            signInWithEmailAndPassword(auth, email, password)
                .then((userInfo) => {
                    dispatch({
                        type: Type.SET_USER,
                        user: userInfo.user,
                    });
                    setLoading({ ...loading, signIn: false });
                    // Redirect to the intended page (payment) or home
                    navigate(redirectPath, { replace: true });
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading({ ...loading, signIn: false });
                });
        } else {
            // firebase auth - create account
            setLoading({ ...loading, signUP: true });
            createUserWithEmailAndPassword(auth, email, password)
                .then((userInfo) => {
                    dispatch({
                        type: Type.SET_USER,
                        user: userInfo.user,
                    });
                    setLoading({ ...loading, signUP: false });
                    // Redirect to the intended page (payment) or home
                    navigate(redirectPath, { replace: true });
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading({ ...loading, signUP: false });
                });
        }
    };

    return (
        <section className={classes.login}>
            {/* logo */}
            <Link to="/" className={classes.login__logo}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
                    alt="Amazon Logo"
                />
            </Link>

            {/* form */}
            <div className={classes.login__container}>
                <h1>Sign In</h1>
                
                {/* Display message from ProtectedRoute if exists */}
                {location.state?.msg && (
                    <div style={{ 
                        color: "red", 
                        backgroundColor: "#ffe6e6", 
                        padding: "10px", 
                        marginBottom: "15px",
                        borderRadius: "4px",
                        border: "1px solid #ffcccc"
                    }}>
                        {location.state.msg}
                    </div>
                )}
                
                <form>
                    <div className={classes.login__field}>
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                        />
                    </div>
                    <div className={classes.login__field}>
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                        />
                    </div>
                    
                    {/* Sign In Button */}
                    <button 
                        type="submit"
                        name="signin"
                        onClick={authHandler}
                        className={classes.login__signInButton}
                        disabled={loading.signIn}
                    >
                        {loading.signIn ? (
                            <ClipLoader color="#000" size={15} />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                {/* agreement */}
                <p className={classes.login__agreement}>
                    By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
                </p>

                {/* create account btn */}
                <button 
                    type="submit"
                    name="signup"
                    onClick={authHandler}
                    className={classes.login__registerButton}
                    disabled={loading.signUP}
                >
                    {loading.signUP ? (
                        <ClipLoader color="#000" size={15} />
                    ) : (
                        "Create your Amazon Account"
                    )}
                </button>

                {error && (
                    <small style={{ paddingTop: "5px", color: "red" }}>
                        {error}
                    </small>
                )}
            </div>
        </section>
    );
}

export default Auth;