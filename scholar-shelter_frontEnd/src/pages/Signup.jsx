import { useState } from "react";
import axios from "axios";

function Signup() {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://scholar-shelter.onrender.com/api/Signup", user);
      alert(res.data.message);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="userName" placeholder="userName" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;