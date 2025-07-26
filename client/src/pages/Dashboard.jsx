import React from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (userDetails?.role === "faculty") {
      navigate("/faculty/dashboard", { replace: true });
    } else if (userDetails?.role === "student") {
      navigate("/student/dashboard", { replace: true });
    } else if (userDetails?.role === "admin") {
      navigate("/student/admin", { replace: true });
    } else {
      navigate("/", { replace: true })
    }
  }, [userDetails]);
  return null;
}

export default Dashboard