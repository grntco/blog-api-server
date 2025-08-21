import passport from "../config/passport-config.js";

export const auth = passport.authenticate("jwt", { session: false });

export const admin = [
  auth,
  (req, res, next) => {
    if (!req.user.admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  },
];
