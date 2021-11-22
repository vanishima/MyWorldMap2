import { useState } from "react";
import { Link } from "react-router-dom";
import "../stylesheets/registerLogin.css";

async function registerUser(user) {
  return fetch("./auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

const Register = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const user = {
      email: email,
      name: username,
      password: password,
    };
    console.log("Attemp to register", user);
    const resRaw = await registerUser(user);
    const res = await resRaw.json();

    if (!resRaw.ok) {
      setMessage(
        <p className="justify-content-right" style={{ color: "red" }}>
          *{res.msg}
        </p>
      );
    } else {
      console.log("Got token:", res.token);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      document.location.href = "/";
    }
  };

  return (
    <div className="registration">
      <form className="registerLoginDiv center" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <div className="form-group form-control">
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {message}
        </div>

        <div className="form-group form-control">
          <label>
            Username:
            <input
              className="form-control"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group form-control">
          <label>
            Password:
            <input
              className="form-control"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <button className="btn btn-primary center">Create account</button>
          <Link to="/login" className="right">
            Already have an account, sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
