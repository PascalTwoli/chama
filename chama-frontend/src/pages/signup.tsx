import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Simulate registration (replace with actual logic)
    navigate("/");
  };

  return (
    <div className="bg-gray-900 flex justify-center min-h-screen items-center">
      <div className="signin-container flex flex-row justify-center items-center rounded-xl">
        <div className="signup-details flex items-center justify-center min-h-full bg-black">
          <div className="w-full  p-10 rounded-xl font-bold">
            {/* <h2 className="text-2xl font-bold text-center">Sign Up</h2> */}
            <div className="flex gap-6">
              <label htmlFor="">
                First Name
                <input type="text" placeholder="First Name" className="w-full p-3 mt-2 border rounded bg-gray-700" />
              </label>
              <label htmlFor="">
                Last Name
                <input type="text" placeholder="Last Name" className="w-full p-3 mt-2 border rounded bg-gray-700" />
              </label>
            </div>
            <div className="mt-14">
              <label htmlFor="email">
                Email address
                <input type="email" placeholder="Email" className="w-full p-3 mt-2 border rounded bg-gray-700" />
              </label>
            </div>
            <div className="mt-14">
              <label htmlFor="">
                Password
                <input type="password" placeholder="Password" className="w-full p-3 mt-2 border rounded bg-gray-700" />
              </label>
            </div>
            <p className="text-gray-400 mt-14 font-normal">By creating an account, you agree to our <a href="" className="text-white">Terms</a> and <a href="" className="text-white">privacy policy</a></p>
            <button className="w-full p-2 mt-4 text-white bg-green-500 rounded hover:bg-green-400 transition duration-300" onClick={handleRegister}>
              Sign Up
            </button>

            <div className="flex items-center my-6 mb-10 mt-14">
              <div className="flex-grow border-t border-gray-700"></div>
              <button className=" google-login bg-gray-700 p-2 rounded flex justify-around ml-4 mr-4 gap-4 hover:bg-gray-600 transition duration-300">
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