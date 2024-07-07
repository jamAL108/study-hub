import signinWithEmailPassword from './signin'
import signupWithEmailPassword from './signup'
import SignOutServer from './signout'
import googleAuth from './googleAuth'
/// export


export const SigninWithSupabase = signinWithEmailPassword
export const SignupWithSupabase = signupWithEmailPassword
export const SignOutWithSupabase = SignOutServer
export const googleAuthWithSupabase = googleAuth