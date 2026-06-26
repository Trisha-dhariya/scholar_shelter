import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; //imp for signup link addition
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userName: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://scholar-shelter.onrender.com/api/Login", user);
      alert("Login Success");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (user.userName.toLowerCase() === "trisha") {
        navigate("/admin-dashboard");
      } else {
      navigate("/home");}
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="userName" placeholder="userName.." onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <p className="switch-text">
    Not registered? <Link to="/Signup">Signup</Link>
  </p>
    </div>
  );
}
export default Login;