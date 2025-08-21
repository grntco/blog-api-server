import prisma from "../config/prisma-config.js";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

// Local
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          return done(null, false, {
            message: "No user found with that username.",
          });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, {
            message: "Incorrect password for that username.",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// JWT
const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(JwtOptions, async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
