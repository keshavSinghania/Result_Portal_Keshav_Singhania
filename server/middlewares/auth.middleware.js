import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: Please login.",
      success: false,
      error: true,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attaching user info (e.g., userId, role) to the request
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
        success: false,
        error: true,
      });
    }

    // For all other token errors
    return res.status(401).json({
      message: "Invalid token",
      success: false,
      error: true,
    });
  }
};
