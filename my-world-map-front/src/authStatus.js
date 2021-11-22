function myAuth() {
  const auth = {};

  auth.verifyAuth = async () => {
    // if (localStorage.getItem("token") == null) return {};
    console.log(
      "[authStatus]auth.verifyAuth ready to fetch:",
      localStorage.getItem("token")
    );
    const resRaw = await fetch("./auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    });
    console.log("[auth.verifyAuth] Got resRaw", resRaw);
    const res = await resRaw.json();
    if (resRaw.ok) {
      console.log("[authStatus]auth.verifyAuth: user exists");
      // localStorage.setItem("user", JSON.stringify(res.user));
    } else {
      console.log("[authStatus]auth.verifyAuth: token not valid");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    console.log("[auth.verifyAuth] Got res", res);
    return res;
  };

  auth.logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("cleared token and user");
  };

  return auth;
}

export default myAuth();
