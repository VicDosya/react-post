import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

function Login() {
  //Route to register page
  let navigate = useNavigate();
  const goRegister = () => {
    navigate("/auth/register");
  };

  return (
    //Login Container
    <div className={styles.Ctn}>
      {/* Title */}
      <div className={styles.titleCtn}>
        <h1 className={styles.mainTitle}>Log In</h1>
      </div>
      <div className={styles.restCtn}>
        {/* Email */}
        <div className={styles.emailCtn}>
          <p className={styles.title}>Email address:</p>
        </div>
        <div className={styles.inputCtn}>
          <input className={styles.input}></input>
        </div>
        {/* Password */}
        <div className={styles.passwordCtn}>
          <p className={styles.title}>Password:</p>
        </div>
        <div className={styles.inputCtn}>
          <input className={styles.input} type="password"></input>
        </div>
        {/* Remember me */}
        <div className={styles.rememberCtn}>
          <input type="checkbox"></input>
          <span className={styles.remember}>Remember me</span>
        </div>
        {/* Button */}
        <div className={styles.btnCtn}>
          <button className={styles.submitBtn}>Submit</button>
        </div>
        {/* Footer */}
        <div className={styles.footerCtn}>
          <div>
            <p onClick={goRegister} className={styles.fTitleLeft}>
              Register
            </p>
          </div>
          <div className={styles.fTitleRight}>Forgot Password?</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
