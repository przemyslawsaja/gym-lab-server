import GoogleStrategy from 'passport-google-oauth20';
import User from '../aai/models/User.js'

const setupPassport = (passport) => {
  passport.use(new GoogleStrategy.Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        username: profile.displayName,
        image: profile.photos[0].value,
      }

      try {
        let user = await User.findOne({ googleId: profile.googleId })
        if(user) {
          done(null, user);

          return;
        }

        user = await User.create(newUser)
        done(null, user)
      } catch (err) {
        console.error()
      }
    }))

  passport.serializeUser((user, done) => done(null, user.id))

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}

export default setupPassport;