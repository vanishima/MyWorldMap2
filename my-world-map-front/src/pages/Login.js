import { useState } from "react";
import { Link } from "react-router-dom";
import myAuth from "../authStatus";

async function loginUser(credentials) {
  return fetch("./auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const user = {
      email: email,
      password: password,
    };
    console.log("Attemp to login", user);
    // Attemp to login
    const resRaw = await loginUser(user);
    console.log("Got resRaw", resRaw);
    const res = await resRaw.json();

    if (!resRaw.ok) {
      setMessage(
        <p className="justify-content-right" style={{ color: "red" }}>
          *{res.msg}
        </p>
      );
    } else if (res) {
      console.log("[Login] handleSubmit: Got res", res);
      console.log("[Login] handleSubmit: Got user name:", res.user.name);
      console.log("[Login] handleSubmit: Got token:", res.token);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      document.location.href = "/";
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-auto">
          <button onClick={myAuth.verifyAuth}>check authentication</button>

          <h4>Test user</h4>
          <p>
            email: aaa@gmail.com <br />
            password: 123
          </p>
        </div>
        <form className="registerLoginDiv center col-4" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          {message}
          <div className="form-group form-control">
            <label>
              Email:
              <input
                className="form-control"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <button className="btn btn-primary">Login</button>
            <Link to="/register" className="right">
              Don't have an account? Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired,
// };

export default Login;
