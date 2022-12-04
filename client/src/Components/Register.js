import React from "react";
import styles from "./Auth.module.css";

function Register() {
  return (
    // Register Container
    <div className={styles.Ctn}>
      {/* Title */}
      <div className={styles.titleCtn}>
        <h1 className={styles.mainTitle}>Register</h1>
      </div>
      <div className={styles.restCtn}>
        {/* First Name */}
        <div className={styles.inputTitleCtn}>
          <p className={styles.title}>First name:</p>
        </div>
        <div className={styles.inputCtn}>
          <input className={styles.input}></input>
        </div>
        {/* Last Name */}
        <div className={styles.inputTitleCtn}>
          <p className={styles.title}>Last Name:</p>
        </div>
        <div className={styles.inputCtn}>
          <input className={styles.input}></input>
        </div>
        {/* Email */}
        <div className={styles.inputTitleCtn}>
          <p className={styles.title}>Email address:</p>
        </div>
        <div className={styles.inputCtn}>
          <input className={styles.input}></input>
        </div>
        {/* Password */}
        <div className={styles.inputTitleCtn}>
          <p className={styles.title}>Password:</p>
        </div>
        <div className={styles.inputCtn}>
          <input className={styles.input} type="password"></input>
        </div>
        {/* Submit Button */}
        <div className={styles.btnCtn}>
          <button className={styles.submitBtn}>Register</button>
        </div>
        {/* Footer */}
        <div className={styles.footerCtn}>
          <div>
            <p className={styles.fTitleLeft}>Log in</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
