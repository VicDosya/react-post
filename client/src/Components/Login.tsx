import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

function Login() {
  //useState Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [btnDisabled, setbtnDisabled] = useState(false);

  let navigate = useNavigate();

  //Submit log in data to the server
  const handleSubmit = async () => {
    if (email === "" || password === "") {
      return setStatus("Please fill in all the inputs.");
    }
    try {
      const res = await axios.post("/api/auth/login", {
        email: email,
        password: password,
      });
      setStatus(res.data.message);
      setbtnDisabled(true);
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err: any) {
      setStatus(err.response.data.message);
    }
  };

  //Route to different pages
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
        {/* Status Message */}
        <div className={styles.statusCtn}>
          <h1 className={styles.status}>{status}</h1>
        </div>
        {/* Email */}
        <div className={styles.emailCtn}>
          <p className={styles.title}>Email address:</p>
        </div>
        <div className={styles.inputCtn}>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        {/* Password */}
        <div className={styles.passwordCtn}>
          <p className={styles.title}>Password:</p>
        </div>
        <div className={styles.inputCtn}>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        {/* Remember me */}
        <div className={styles.rememberCtn}>
          <input type="checkbox"></input>
          <span className={styles.remember}>Remember me</span>
        </div>
        {/* Button */}
        <div className={styles.btnCtn}>
          <button
            onClick={handleSubmit}
            className={styles.submitBtn}
            disabled={btnDisabled}
          >
            Submit
          </button>
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
