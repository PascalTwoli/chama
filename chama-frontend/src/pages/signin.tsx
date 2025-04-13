import signinimage from "./assets/signinimage.png"

import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate authentication (replace with actual logic)
    navigate("/");
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
            <div className="">
              <label className="email-input" htmlFor="">
                E-mail Address
                <input type="email" placeholder="example@gmail.com" className="w-full p-3 mt-4 border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300"/>
              </label>
            </div>

            <div className="mt-20">
              <label className="pass-input" htmlFor="">
                Password
                <input type="password" placeholder="min 8 characters" className="w-full p-3 mt-4  border rounded bg-gray-700 placeholder:font-bold placeholder:text-gray-300" />
              </label>
              <p className="text-right font-bold text-green-500 cursor-pointer">Forgot your password?</p>
            </div>
            
            <div>
              <p></p>
              <button className="w-full p-2 mt-20 mb-10 text-white bg-green-500 rounded hover:bg-green-400 transition duration-300" onClick={handleLogin}>
                Sign In
              </button>
            </div>

            <div className="flex items-center my-6 mb-10">
              <div className="flex-grow border-t border-gray-700"></div>
              <button className=" google-login bg-gray-700 p-2 rounded flex justify-around ml-4 mr-4 gap-4 hover:bg-gray-600 transition duration-300">
                <img className="google-logo" src="/assets/Google__G__logo.svg.webp" alt="Google" />
                <span>Sign in with Google</span>
              </button>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>


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