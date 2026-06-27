import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import { config } from "./index";

const prisma = new PrismaClient();

passport.serializeUser((user: Express.User, done) => done(null, user));
passport.deserializeUser((obj: Express.User, done) => done(null, obj));

const googleId = config.googleClientId;
const googleSecret = config.googleClientSecret;
const googleCallback = config.googleCallbackUrl;

if (!googleId || !googleSecret) {
  console.warn("Google OAuth configuration is missing. Skipping GoogleStrategy registration.");
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleId,
        clientSecret: googleSecret,
        callbackURL: googleCallback,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("Google account email is required"));
        }

        const firstName = profile.name?.givenName || profile.displayName || "Google";
        const lastName = profile.name?.familyName || "";
        const providerAccountId = profile.id;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              firstName,
              lastName,
              email,
              registrationType: "GOOGLE",
              password: null,
            },
          });
        }

        const existingAuthAccount = await prisma.authAccount.findFirst({
          where: {
            provider: "GOOGLE",
            providerAccountId,
          },
        });

        if (existingAuthAccount) {
          await prisma.authAccount.update({
            where: { id: existingAuthAccount.id },
            data: {
              accessToken,
              refreshToken,
              tokenType: "Bearer",
              profile: profile._json as any,
            },
          });
        } else {
          await prisma.authAccount.create({
            data: {
              userId: user.id,
              provider: "GOOGLE",
              providerAccountId,
              accessToken,
              refreshToken,
              tokenType: "Bearer",
              profile: profile._json as any,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);
}

export default passport;
