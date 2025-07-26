import { useEffect, useState } from 'react';
import './App.css';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from './store/authSlice';
import { getUserDetails } from './axios/index.js';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  const protectedPaths = [
    "/dashboard",
    "/faculty/dashboard",
    "/student/dashboard",
    "/admin/dashboard"
  ];

  const isProtectedRoute = protectedPaths.some(path =>
    location.pathname.startsWith(path)
  );

  const redirectToDashboard = (role) => {
    if (role === "admin") navigate("/admin/dashboard", { replace: true });
    else if (role === "faculty") navigate("/faculty/dashboard", { replace: true });
    else if (role === "student") navigate("/student/dashboard", { replace: true });
    else navigate("/dashboard", { replace: true }); // fallback
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserDetails();
        const { user, token } = res.data;

        dispatch(loginSuccess({ user, token }));

        if (!isProtectedRoute) {
          redirectToDashboard(user.role);
        }
      } catch (error) {
        if (isProtectedRoute) {
          navigate("/", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      if (!isProtectedRoute) {
        redirectToDashboard(user.role);
      }
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center py-1 text-red-700">Loading...</div>;

  return (
    <>
      {/* Uncomment these if you want Navbar/Footer globally */}
      {/* <Navbar /> */}
      <div className="w-[100vw] h-[calc(100vh-16vh)]">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;
