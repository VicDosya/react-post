import { React, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";

function Login() {
  //useState Variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  //useEffect
  useEffect(() => {
    loadProfile();
  }, []);

  //Load Profile function
  const loadProfile = async () => {
    const res = await axios.get("/api/auth/profile");
    if (res.data.error) {
      navigate("/auth/login");
    } else {
      navigate("/");
    }
  };

  //Submit log in data to the server
  const handleSubmit = async () => {
    const res = await axios.post("/api/auth/login", {
      email: email,
      password: password,
    });
    setStatus(res.data.status);
    if (!res.data.error) {
      setEmail("");
      setPassword("");
      setTimeout(goHomePage, 2000);
    }
  };

  //Route to different pages
  let navigate = useNavigate();
  const goRegister = () => {
    navigate("/auth/register");
  };
  const goHomePage = () => {
    navigate("/");
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
          <button onClick={handleSubmit} className={styles.submitBtn}>
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
