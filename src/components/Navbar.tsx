import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const Logout = async () => {
    await signOut(auth);
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/">Home</Link>
        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <Link to="/createpost">Create Post</Link>
        )}
      </div>
      <div>
        {user && (
          <div className="user">
            <p>{user?.displayName}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <img
                src={user?.photoURL || ""}
                alt="image"
                height="40"
                width="40"
              />
              <button onClick={Logout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
