import { useNavigate } from "react-router-dom";
import { useState, FormEvent, ChangeEvent } from "react";
import AuthService, { SignupRequest, SignupResponse } from "../services/auth.service";

// Interface for form data
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// Interface for form errors
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  [key: string]: string | undefined;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [apiSuccess, setApiSuccess] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError("");
    setApiSuccess("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response: SignupResponse = await AuthService.signup(formData as SignupRequest);
      setApiSuccess("Registration successful! Redirecting to login...");
      
      // Redirect to sign in after short delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setApiError(
        error instanceof Error ? error.message : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 flex justify-center min-h-screen items-center">
      <div className="signin-container flex flex-row justify-center items-center rounded-xl">
        <div className="signup-details flex items-center justify-center min-h-full bg-black">
          <div className="w-full  px-10 rounded-xl font-bold">
            {/* <h2 className="text-2xl font-bold text-center">Sign Up</h2> */}
            {apiSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                {apiSuccess}
              </div>
            )}
            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {apiError}
              </div>
            )}
            <form onSubmit={handleRegister}>
              <div className="flex gap-6">
                <label htmlFor="firstName" className="w-full">
                  First Name
                  <input 
                    type="text" 
                    id="firstName"
                    name="firstName"
                    placeholder="First Name" 
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 focus:outline focus:outline-sky-500 ${errors.firstName ? "border-red-500" : ""}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </label>
                <label htmlFor="lastName" className="w-full">
                  Last Name
                  <input 
                    type="text" 
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name" 
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 focus:outline focus:outline-sky-500 ${errors.lastName ? "border-red-500" : ""}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </label>
              </div>
              <div className="mt-8">
                <label htmlFor="email" className="w-full">
                  Email address
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-400 focus:outline focus:outline-sky-500 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </label>
              </div>
              <div className="mt-8">
                <label htmlFor="phoneNumber" className="w-full">
                  Phone Number
                  <input 
                    type="tel" 
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 focus:outline focus:outline-sky-500 ${errors.phoneNumber ? "border-red-500" : ""}`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                </label>
              </div>
              <div className="mt-8">
                <label htmlFor="password" className="w-full">
                  Password
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 mt-2 border rounded bg-gray-700 focus:outline focus:outline-sky-500 ${errors.password ? "border-red-500" : ""}`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </label>
              </div>
            <p className="text-gray-400 mt-8 font-normal">By creating an account, you agree to our <a href="" className="text-white">Terms</a> and <a href="" className="text-white">privacy policy</a></p>
            <button 
              type="submit" 
              className="w-full p-2 mt-4 text-white bg-green-500 rounded hover:bg-green-400 transition duration-300 border-0 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            </form>

            <div className="flex items-center my-6 mb-10 mt-14">
              <div className="flex-grow border-t border-gray-700"></div>
              <button className=" google-login bg-gray-700 p-2 rounded flex justify-around ml-4 mr-4 gap-4 hover:bg-gray-600 transition duration-300  border-0">
                <img className="google-logo" src="/assets/Google__G__logo.svg.webp" alt="Google" />
                <span>Sign in with Google</span>
              </button>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <p className="mt-4 text-center text-gray-400 font-bold">
              Already have an account? <a href="/signin" className="text-green-500 hover:text-green-400 transition duration-300">Sign In</a>
            </p>
          </div>
        </div>
        <div className="signup-image flex-1" style={{backgroundImage: "url('/assets/signinimage.png')", backgroundSize: "cover"}}>
          <div className=" flex flex-col justify-center signup-image-overlay text-center p-14">
            <p className="font-bold welcome-p">Welcome Back To Chama System</p>
            <p className="font-bold text-4xl p-7 text-left">We provide easy-to-use tools for managing  group finances and working together efficiently!</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default SignUp;