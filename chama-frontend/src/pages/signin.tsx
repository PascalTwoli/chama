import { FormEvent, useState } from "react";
import { FormErrors, SignInCredentials, SignInResponse} from "../models/user";
import { AuthService,  } from "../services/auth/signin-service";

import { useNavigate } from "react-router-dom";


const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignInCredentials>({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [apiSuccess, setApiSuccess] = useState<string>("");

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    } 

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");

    // Validate form data
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.signIn(
        formData as SignInCredentials
      );
      
      // Check user status after successful login
      const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
      const userRole = localStorage.getItem('userRole');
      
      let redirectPath = '/chose-user';
      
      // If user has a role and it's not their first login, redirect to appropriate dashboard
      if (!isFirstLogin && userRole) {
        if (userRole === 'admin') {
          redirectPath = '/admin/chamas/1';
        } else if (userRole === 'member') {
          redirectPath = '/chama-list-view';
        }
      }
      
      setApiSuccess(`Login successful! Redirecting${isFirstLogin ? ' to role selection' : ' to dashboard'}...`);
      
      setTimeout(() => {
        setIsLoading(false);
        // Navigate based on user status
        navigate(redirectPath);
      }, 1000);
      
    } catch (error) {
      console.error("Login error:", error);
      
      // Clear the apiError first to avoid duplicate messages
      setApiError("");
      
      // Check if the error is related to unregistered email 
      if (error instanceof Error && error.message.includes("unregistered email")) {
        setErrors({
          ...errors,
          email: "This email is not registered. Please sign up first or try again."
        });
        // Show clean error without the prefix in the api error display
        setApiError("This email is not registered. Please sign up first or try again.");
      }
      // Check if the error is related to incorrect password
      else if (error instanceof Error && error.message.includes("incorrect password")) {
        setErrors({
          ...errors,
          password: "Incorrect password. Please try again."
        });
        // Show clean error without the prefix in the api error display
        setApiError("The password you entered is incorrect. Please try again.");
      }
      // Check for network errors
      else if (error instanceof Error && error.message.includes("network")) {
        setApiError("Could not connect to the server. Please check your internet connection and try again.");
      }
      // Check for server errors
      else if (error instanceof Error && error.message.includes("server")) {
        setApiError("An internal server error occurred. Please try again later.");
      }
      // Check for rate limiting
      else if (error instanceof Error && error.message.includes("rate-limit")) {
        setApiError("Too many login attempts. Please try again later.");
      }
      // For any other errors, display the clean message
      else {
        // Extract clean error message by removing any prefixes
        const errorMessage = error instanceof Error 
          ? (error.message.includes(":") ? error.message.split(":")[1].trim() : error.message) 
          : "Failed to sign in. Please check your credentials and try again.";
          
        setApiError(errorMessage);
      }
    }
    finally {
      setIsLoading(false);
    }
  

  };

  return (
    <div className="bg-gray-900 flex justify-center min-h-screen items-center">
      <div className="signin-container flex flex-row justify-center items-center rounded-xl">
<div className="signin-image flex-1" style={{backgroundImage: "url('/assets/signinimage.png')", backgroundSize: "cover"}}>
          <div className=" flex flex-col justify-center signin-image-overlay text-center p-14">
            <p className="font-bold welcome-p">Welcome Back To Chama System</p>
            <p className="font-bold text-4xl p-7 text-left">We provide easy-to-use tools for managing  group finances and working together efficiently!</p>
          </div>
        </div>
        <div className="signin-details flex items-center bg-black min-h-full flex-2 font-bold">
          <div className="w-full p-10 min-h-full">
            {/* <h2 className="text-2xl font-bold text-center text-white">Sign In</h2> */}
            {apiSuccess && (
              <p className="text-green-500 font-bold text-center mb-4">
                {apiSuccess}
              </p>
            )}
            {apiError && (
              <p className="text-red-500 font-bold text-center mb-4">
                {apiError}
              </p>
            )}
            <form onSubmit={handleLogin}>
              <div className="">
                <label className="email-input" htmlFor="email">
                  E-mail Address
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className={`w-full p-3 mt-4 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300 focus:outline focus:outline-sky-500 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="example@gmail.com" 
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </label>
              </div>

              <div className="mt-20">
                <label className="pass-input" htmlFor="password">
                  Password
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="min 8 characters" 
                    className={`w-full p-3 mt-4 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300 focus:outline focus:outline-sky-500 ${errors.password ? "border-red-500" : ""}`} />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </label>
                <div className="text-right">
                  <a href="/forgot-password" className="font-bold text-green-500 hover:text-green-400 transition duration-300">Forgot your password?</a>
                </div>
              </div>
              
              <div className="">
                <button 
                  className="w-full p-2 mt-20 mb-10 text-white bg-green-500 rounded hover:bg-green-400 transition duration-300 border-0 text-center" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>

              <div className="flex items-center my-6 mb-10">
                <div className="flex-grow border-t border-gray-700"></div>
                <button 
                  type="button" 
                  className="google-login bg-gray-700 p-2 rounded flex justify-around ml-4 mr-4 gap-4 hover:bg-gray-600 transition duration-300 border-0"
                  aria-label="Sign in with Google"
                >
                  <img className="google-logo" src="/assets/Google__G__logo.svg.webp" alt="Google" />
                  <span>Sign in with Google</span>
                </button>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>
            </form>


            <p className="mt-4 text-center text-gray-400 font-bold">
              Don’t have an account? <a href="/signup" className="text-green-500 hover:text-green-400 transition duration-300">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default SignIn;