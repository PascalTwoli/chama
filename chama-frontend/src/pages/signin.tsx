import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { UserType } from "../data/user-type";

interface LoginCredentials {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      // Redirect based on user type and onboarding status
      redirectBasedOnUserType();
    }
  }, []);

  // Redirect based on user type and onboarding status
  const redirectBasedOnUserType = () => {
    const userType = localStorage.getItem("userType");
    const isFirstLogin = localStorage.getItem("isFirstLogin") !== "false";

    // If user hasn't completed onboarding, redirect to user type selection
    if (!userType || isFirstLogin) {
      navigate("/chose-user");
      return;
    }

    // Redirect based on user type and chama status
    if (userType === UserType.ADMIN.toString() || userType === UserType.ADMIN) {
      const hasCreatedChama = localStorage.getItem("hasCreatedChama") === "true";
      if (!hasCreatedChama) {
        navigate("/create-chama");
      } else {
        const activeChamaId = localStorage.getItem("activeChamaId") || "1";
        navigate(`/admin/chamas/${activeChamaId}`);
      }
    } else if (userType === UserType.MEMBER.toString() || userType === UserType.MEMBER) {
      const hasJoinedChama = localStorage.getItem("hasJoinedChama") === "true";
      if (!hasJoinedChama) {
        navigate("/chama-list-view");
      } else {
        const activeChamaId = localStorage.getItem("activeChamaId") || "1";
        navigate(`/member/chamas/${activeChamaId}`);
      }
    } else {
      // If user type is invalid, redirect to user type selection
      navigate("/chose-user");
    }
  };

  // Display error messages with toast
  useEffect(() => {
    if (error && toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error,
        life: 5000,
      });
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Make API request to sign in
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Invalid credentials. Please try again."
        );
      }

      const data = await response.json();

      // Store auth token and user info
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.userId);

      // If user has a userType already, store it
      if (data.userType) {
        localStorage.setItem("userType", data.userType);
      }

      // Check if this is first login by looking at isFirstLogin in response
      if (data.isFirstLogin !== undefined) {
        localStorage.setItem(
          "isFirstLogin",
          data.isFirstLogin ? "true" : "false"
        );
      } else {
        // If not provided, default to true to ensure user completes onboarding
        localStorage.setItem("isFirstLogin", "true");
      }

      // Redirect based on user type and onboarding status
      redirectBasedOnUserType();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please try again."
      );
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Toast ref={toast} position="top-right" />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={credentials.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={credentials.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 ${
                isLoading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
              } text-white rounded-md font-semibold transition-colors flex justify-center items-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-green-400 hover:text-green-300">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

// import { FormEvent, useState } from "react";
// import { FormErrors, SignInCredentials} from "../models/user"; //SignInResponse
// import { AuthService as SigninService } from "../services/auth/signin-service";
// import AuthService from "../services/auth/signup-service";
// import { UserType } from "../data/user-type";

// import { useNavigate } from "react-router-dom";


// const SignIn = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState<SignInCredentials>({
//     email: "",
//     password: ""
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isCheckingUserType, setIsCheckingUserType] = useState<boolean>(false);
//   const [apiError, setApiError] = useState<string>("");
//   const [apiSuccess, setApiSuccess] = useState<string>("");

//   const handleChange = (e: FormEvent<HTMLInputElement>) => {
//     const { name, value } = e.currentTarget;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     // Clear field-specific error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: "",
//       });
//     }
//   };


//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     } 

//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setApiError("");
//     setApiSuccess("");

//     // Validate form data
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Sign in with credentials
//       await SigninService.signIn(
//         formData as SignInCredentials
//       );
      
//       setApiSuccess("Login successful! Checking account status...");
      
//       // After successful login, check if user has a type
//       setIsCheckingUserType(true);
      
//       try {
//         // Get user type from the backend API
//         const userType = await AuthService.getUserType();
        
//         // Determine redirect path based on user type
//         let redirectPath: string;
//         let redirectMessage: string;
        
//         if (!userType) {
//           // User has no type yet, redirect to select user type
//           redirectPath = '/user-type';
//           redirectMessage = 'Login successful! Redirecting to select your role...';
//         } else if (userType === UserType.ADMIN) {
//           // Admin user, redirect to admin dashboard
//           redirectPath = '/admin/chamas/1';
//           redirectMessage = 'Login successful! Redirecting to admin dashboard...';
//         } else if (userType === UserType.MEMBER) {
//           // Member user, redirect to chama list view
//           redirectPath = '/chama-list-view';
//           redirectMessage = 'Login successful! Redirecting to member dashboard...';
//         } else {
//           // Fallback for unexpected user type
//           redirectPath = '/user-type';
//           redirectMessage = 'Login successful! Redirecting to verify your account...';
//         }
        
//         // Update success message
//         setApiSuccess(redirectMessage);
        
//         // Navigate to the appropriate page
//         setTimeout(() => {
//           navigate(redirectPath);
//         }, 1000);
//       } catch (userTypeError) {
//         console.error("Error checking user type:", userTypeError);
//         // If there's an error getting the user type, redirect to user type selection
//         setApiSuccess("Login successful! Redirecting to account setup...");
//         setTimeout(() => {
//           navigate('/user-type');
//         }, 1000);
//       } finally {
//         setIsCheckingUserType(false);
//       }
      
//     } catch (error) {
//       console.error("Login error:", error);
      
//       // Clear the apiError first to avoid duplicate messages
//       setApiError("");
      
//       // Check if the error is related to unregistered email 
//       if (error instanceof Error && error.message.includes("unregistered email")) {
//         setErrors({
//           ...errors,
//           email: "This email is not registered. Please sign up first or try again."
//         });
//         // Show clean error without the prefix in the api error display
//         setApiError("This email is not registered. Please sign up first or try again.");
//       }
//       // Check if the error is related to incorrect password
//       else if (error instanceof Error && error.message.includes("incorrect password")) {
//         setErrors({
//           ...errors,
//           password: "Incorrect password. Please try again."
//         });
//         // Show clean error without the prefix in the api error display
//         setApiError("The password you entered is incorrect. Please try again.");
//       }
//       // Check for network errors
//       else if (error instanceof Error && error.message.includes("network")) {
//         setApiError("Could not connect to the server. Please check your internet connection and try again.");
//       }
//       // Check for server errors
//       else if (error instanceof Error && error.message.includes("server")) {
//         // setApiError("An internal server error occurred. Please try again later.");
//         setApiError("This email is not registered. Please sign up first or try again.");
//       }
//       // Check for rate limiting
//       else if (error instanceof Error && error.message.includes("rate-limit")) {
//         setApiError("Too many login attempts. Please try again later.");
//       }
//       // For any other errors, display the clean message
//       else {
//         // Extract clean error message by removing any prefixes
//         const errorMessage = error instanceof Error 
//           ? (error.message.includes(":") ? error.message.split(":")[1].trim() : error.message) 
//           : "Failed to sign in. Please check your credentials and try again.";
          
//         setApiError(errorMessage);
//       }
//     }
//     finally {
//       setIsLoading(false);
//     }
  

//   };

//   return (
//     <div className="bg-gray-900 flex justify-center min-h-screen items-center">
//       <div className="signin-container flex flex-row justify-center items-center rounded-xl">
// <div className="signin-image flex-1" style={{backgroundImage: "url('/assets/signinimage.png')", backgroundSize: "cover"}}>
//           <div className=" flex flex-col justify-center signin-image-overlay text-center p-14">
//             <p className="font-bold welcome-p">Welcome Back To Chama System</p>
//             <p className="font-bold text-4xl p-7 text-left">We provide easy-to-use tools for managing  group finances and working together efficiently!</p>
//           </div>
//         </div>
//         <div className="signin-details flex items-center bg-black min-h-full flex-2 font-bold">
//           <div className="w-full p-10 min-h-full">
//             {/* <h2 className="text-2xl font-bold text-center text-white">Sign In</h2> */}
//             {apiSuccess && (
//               <p className="text-green-500 font-bold text-center mb-4">
//                 {apiSuccess}
//               </p>
//             )}
//             {apiError && (
//               <p className="text-red-500 font-bold text-center mb-4">
//                 {apiError}
//               </p>
//             )}
//             <form onSubmit={handleLogin}>
//               <div className="">
//                 <label className="email-input" htmlFor="email">
//                   E-mail Address
//                   <input 
//                     type="email" 
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     autoComplete="email"
//                     className={`w-full p-3 mt-4 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300 focus:outline focus:outline-sky-500 ${errors.email ? "border-red-500" : ""}`}
//                     placeholder="example@gmail.com" 
//                   />
//                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                 </label>
//               </div>

//               <div className="mt-20">
//                 <label className="pass-input" htmlFor="password">
//                   Password
//                   <input 
//                     type="password" 
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                     placeholder="min 8 characters" 
//                     className={`w-full p-3 mt-4 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300 focus:outline focus:outline-sky-500 ${errors.password ? "border-red-500" : ""}`} />
//                   {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
//                 </label>
//                 <div className="text-right">
//                   <a href="/forgot-password" className="font-bold text-green-500 hover:text-green-400 transition duration-300">Forgot your password?</a>
//                 </div>
//               </div>
              
//               <div className="">
//                 <button 
//                   className="w-full p-2 mt-20 mb-10 text-white bg-green-500 rounded hover:bg-green-400 transition duration-300 border-0 text-center" 
//                   type="submit"
//                   disabled={isLoading || isCheckingUserType}
//                 >
//                   {isLoading ? "Signing in..." : isCheckingUserType ? "Checking account..." : "Sign In"}
//                 </button>
//               </div>

//               <div className="flex items-center my-6 mb-10">
//                 <div className="flex-grow border-t border-gray-700"></div>
//                 <button 
//                   type="button" 
//                   className="google-login bg-gray-700 p-2 rounded flex justify-around ml-4 mr-4 gap-4 hover:bg-gray-600 transition duration-300 border-0"
//                   aria-label="Sign in with Google"
//                 >
//                   <img className="google-logo" src="/assets/Google__G__logo.svg.webp" alt="Google" />
//                   <span>Sign in with Google</span>
//                 </button>
//                 <div className="flex-grow border-t border-gray-700"></div>
//               </div>
//             </form>


//             <p className="mt-4 text-center text-gray-400 font-bold">
//               Don’t have an account? <a href="/signup" className="text-green-500 hover:text-green-400 transition duration-300">Sign Up</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default SignIn;