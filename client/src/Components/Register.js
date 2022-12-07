import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Auth.module.css";

function Register() {
  //useState Variables
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  //Route to login page
  let navigate = useNavigate();
  const goLogin = () => {
    navigate("/auth/login");
  };

  //Submit user data to the server
  const handleSubmit = async () => {
    const res = await axios.post("/api/auth/register", {
      fname: firstName,
      lname: lastName,
      email: email,
      password: password,
    });
    setStatus(res.data.status);
    if (!res.data.error) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setTimeout(goLogin, 1500);
    }
  };

  return (
    // Register Container
    <div className={styles.Ctn}>
      {/* Title */}
      <div className={styles.titleCtn}>
        <h1 className={styles.mainTitle}>Register</h1>
      </div>
      {/* Status Message */}
      <div className={styles.statusCtn}>
        <h1 className={styles.status}>{status}</h1>
      </div>
      <div className={styles.restCtn}>
        {/* First Name */}
        <div className={styles.inputTitleCtn}>
          <p className={styles.title}>First name:</p>
        </div>
        <div className={styles.inputCtn}>
          <input
            className={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          ></input>
        </div>
        {/* Last Name */}
        <div className={styles.inputTitleCtn}>
          <p className={styles.title}>Last Name:</p>
        </div>
        <div className={styles.inputCtn}>
          <input
            className={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          ></input>
        </div>
        {/* Email */}
        <div className={styles.inputTitleCtn}>
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
        <div className={styles.inputTitleCtn}>
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
        {/* Submit Button */}
        <div className={styles.btnCtn}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Register
          </button>
        </div>
        {/* Footer */}
        <div className={styles.footerCtn}>
          <div>
            <p onClick={goLogin} className={styles.fTitleLeft}>
              Log in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
