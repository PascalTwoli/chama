import {
  signInWithPopup,
  UserCredential,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import SecureTokenStorage from '../../utils/secure-token-storage';
import { toast } from 'react-toastify';

export interface GoogleSignInResult {
  userCredential: UserCredential;
  isNewUser: boolean;
}

export class GoogleAuthService {
  /**
   * Initiates the Google Sign-In flow using a popup.
   * Handles account linking if an account with the same email already exists.
   * On success, retrieves the ID token and stores it in secure cookies.
   * @returns The Result object containing UserCredential and isNewUser flag, or null if failed.
   */
  static async signInWithGoogle(): Promise<GoogleSignInResult | null> {
    if (!auth || !googleProvider) {
      toast.error(
        'Google Sign-In is not configured. Please contact the administrator.'
      );
      console.error('Firebase Auth not initialized. Missing config?');
      return null;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        // Get the ID token from the Firebase user
        const idToken = await user.getIdToken();

        // Store the token in secure cookies
        SecureTokenStorage.setAuthToken(idToken);

        // Determine if this is a new user
        // Firebase detection of new users via additionalUserInfo
        const isNewUser =
          (result as unknown as { _tokenResponse?: { isNewUser?: boolean } })
            ._tokenResponse?.isNewUser || false;

        return {
          userCredential: result,
          isNewUser,
        };
      }
      return null;
    } catch (error) {
      const firebaseError = error as {
        code?: string;
        customData?: { email?: string };
        message?: string;
      };
      console.error('Google Sign-In Error:', firebaseError);

      let errorMessage = 'Failed to sign in with Google.';

      // Handle Account Linking (Credential already in use)
      if (
        firebaseError.code === 'auth/account-exists-with-different-credential'
      ) {
        // The email of the user's account used.
        const email = firebaseError.customData?.email;
        // The pending Google credential.
        const pendingCredential = GoogleAuthProvider.credentialFromError(
          error as Parameters<typeof GoogleAuthProvider.credentialFromError>[0]
        );

        if (auth && email && pendingCredential) {
          try {
            // Get sign-in methods for this email.
            const methods = await fetchSignInMethodsForEmail(auth, email);

            if (methods.includes('password')) {
              // Prompt user to provide their password to link accounts
              const password = prompt(
                `You already have an account with ${email}. Please enter your password to link your Google account:`
              );

              if (password) {
                const userCredential = await signInWithEmailAndPassword(
                  auth,
                  email,
                  password
                );
                // Link the pending Google credential.
                const linkResult = await linkWithCredential(
                  userCredential.user,
                  pendingCredential
                );

                // Success! Return the linked result
                const idToken = await linkResult.user.getIdToken();
                SecureTokenStorage.setAuthToken(idToken);

                return {
                  userCredential: linkResult,
                  isNewUser: false, // It's an existing user being linked
                };
              }
            }
          } catch (linkError) {
            console.error('Account linking failed:', linkError);
            errorMessage =
              'Failed to link accounts. Please try logging in with email/password first.';
          }
        } else {
          errorMessage =
            'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.';
        }
      } else if (firebaseError.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in cancelled by user.';
      } else if (firebaseError.code === 'auth/popup-blocked') {
        errorMessage = 'Sign-in popup was blocked by the browser.';
      } else if (firebaseError.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please checks your connection.';
      } else if (
        firebaseError.code ===
        'auth/api-key-not-valid.-please-pass-a-valid-api-key.'
      ) {
        errorMessage = 'Invalid API Configuration.';
      }

      toast.error(errorMessage);
      throw error;
    }
  }

  /**
   * Signs out from Firebase.
   */
  static async signOut(): Promise<void> {
    if (!auth) return;
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out from Google:', error);
    }
  }
}

export default GoogleAuthService;
