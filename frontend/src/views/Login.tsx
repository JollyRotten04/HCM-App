// Imported components
import { useState } from "react";
import EyeIcon from "../assets/eye.svg";
import UnhiddenEyeIcon from "../assets/crossed-eye.svg";
import BackArrow from "../assets/arrow.svg";

export default function Login(){

    const [hidden, setHidden] = useState(true);
    const [hiddenRetype, setHiddenRetype] = useState(true);
    const [icon, setIcon] = useState(EyeIcon);
    const [retypeIcon, setRetypeIcon] = useState(EyeIcon);
    const [login, setLogin] = useState(true);
    const [forgotPassword, setForgotPassword] = useState(false);

    // State tracking to throw errors if necessary...
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [forgotPassEmail, setForgotPassEmail] = useState("");

    // errors stored per field to highlight borders red and display error messages...
    const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    retypePassword: "",
    forgotPassEmail: "",
    });

    // Functions
    const changeIcon = (value: string) => {
        if(value == 'password'){
            if(hidden){
                setIcon(UnhiddenEyeIcon);
                setHidden(false);
            }

            else{
                setIcon(EyeIcon);
                setHidden(true);
            }
        }

        else if (value == 'retypePassword'){
            if(hiddenRetype){
                setRetypeIcon(UnhiddenEyeIcon);
                setHiddenRetype(false);
            }
                
            else{
                setRetypeIcon(EyeIcon);
                setHiddenRetype(true);
            }
        }
    };

    const switchLogin = () => {
        setLogin(!login);
    };

    const invokeForgotPassword = () => {
        setForgotPassword(!forgotPassword);
    };

    // Handles form submission...
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: any = {};

        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";

        if (!login) {
            if (!firstName) newErrors.firstName = "First name is required";
            if (!lastName) newErrors.lastName = "Last name is required";
            if (!retypePassword) newErrors.retypePassword = "Please retype your password";
        }

        setErrors(newErrors);

        // Stop submission if there are errors...
        if (Object.keys(newErrors).length > 0) return;

        console.log("Form submitted", { email, password, firstName, lastName, retypePassword });
    };


    return(
        <>
            <div className="bg-[#B5CBB7] h-full w-full p-8 flex flex-col justify-center items-center">

                {/* Modal */}
                <div className="bg-[#F0F8FF] transition-all duration-300 ease-in-out overflow-hidden p-4 py-8 md:p-6 lg:p-8 lg:py-12 h-fit w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 rounded-2xl flex flex-col gap-8 shadow-xl">

                    <div draggable='false'>
                        <p className="text-black select-none text-3xl inter-semilight text-center">Welcome</p>
                        <p className="text-black select-none text-2xl inter-light text-center">Please sign-in to continue</p>
                    </div>

                    {/* Input Fields */}
                    <div draggable='false' className="transition-all duration-300 ease-in-out">
                        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-8">
                            <div
                                className={`
                                transition-all duration-300 ease-in-out overflow-hidden
                                ${login ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}
                                `}
                            >
                                {/* Render the first and last name input fields only when in registration mode */}
                                {!login ? 
                                <>

                                    <div draggable='false' className="flex gap-4">

                                        <div className="flex flex-col gap-2 w-full">

                                            <p className="text-black select-none text-xl inter-light">First Name:</p>

                                            <input onChange={(e) => setFirstName(e.target.value)} value={firstName} className={`p-2 px-2.5 text-xl rounded-lg border-2 w-full ${errors.firstName ? "border-red-500" : "border-black"}`} type="text" placeholder="John"/>
                                            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                                        </div>

                                        <div className="flex flex-col gap-2 w-full">

                                            <p className="text-black text-xl select-none inter-light">Last Name:</p>

                                            <input onChange={(e) => setLastName(e.target.value)} value={lastName} className={`p-2 px-2.5 text-xl rounded-lg border-2 w-full ${errors.lastName ? "border-red-500" : "border-black"}`} type="text" placeholder="Doe"/>
                                            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                                        </div>
                                    </div>
                                </>
                                
                                :
                            
                                <>  
                                    {/* Display Nothing if Login */}
                                </>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-black select-none text-xl inter-light">Email:</p>

                                <input onChange={(e) => setEmail(e.target.value)} value={email} className={`p-2 px-2.5 text-xl rounded-lg border-2 w-full ${errors.email ? "border-red-500" : "border-black"}`} type="text" placeholder="exampleemail@gmail.com"/>
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div className="flex flex-col">
                                <div className="flex flex-col gap-2">
                                    <p className="text-black select-none text-xl inter-light">Password:</p>

                                    <div className="relative">
                                        <input onChange={(e) => setPassword(e.target.value)} value={password} className={`p-2 px-2.5 text-xl rounded-lg border-2 w-full ${errors.password ? "border-red-500" : "border-black"}`} type={hidden ? 'password' : 'text'} placeholder="Your password here..."/>

                                        <button type="button" draggable='false' onClick={() => {changeIcon('password')}}><img src={icon} className="absolute top-1/2 transform -translate-y-1/2 right-4 h-4 select-none cursor-pointer" alt="" /></button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                </div>

                                <div
                                    className={`
                                    transition-all duration-300 ease-in-out overflow-hidden
                                    ${!login ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}
                                    `}
                                >
                                    {!login ? <></> : <><button onClick={() => {invokeForgotPassword()}} draggable='false' type="button"><p className="text-black select-none cursor-pointer text-base inter-light font-extralight">Forgot password</p></button></>}
                                </div>
                            </div>

                            <div
                                className={`
                                transition-all duration-300 ease-in-out overflow-hidden
                                ${login ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}
                                `}
                            >
                                {/* Render the confirm password input field only when in registration mode */}
                                {!login ? 
                                <>

                                    <div className="flex flex-col gap-2 w-full">

                                        <p className="text-black text-xl select-none inter-light">Retype Password:</p>

                                        <div className="relative">

                                            <input onChange={(e) => setRetypePassword(e.target.value)} value={retypePassword} className={`p-2 px-2.5 text-xl rounded-lg border-2 w-full ${errors.retypePassword ? "border-red-500" : "border-black"}`} type={hiddenRetype ? 'password' : 'text'} placeholder="Retype password here..."/>

                                            <button type="button" draggable='false' onClick={() => {changeIcon('retypePassword')}}><img src={retypeIcon} className="absolute top-1/2 transform -translate-y-1/2 right-4 h-4 select-none cursor-pointer" alt="" /></button>
                                        </div>
                                        {errors.retypePassword && <p className="text-red-500 text-sm">{errors.retypePassword}</p>}
                                
                                    </div>
                                </>
                                
                                :
                            
                                <>  
                                    {/* Display Nothing if Login */}
                                </>}
                            </div>

                            <button type="button" onClick={() => {switchLogin()}}><p draggable='false' className="cursor-pointer text-black text-lg select-none underline inter-normal text-center mt-8">{login ? "Don't have an account yet? Create one!" : "Already have an account? Sign-in!"}</p></button>

                            <button type="submit" draggable='false' className="bg-[#B5CBB7] py-2 cursor-pointer select-none px-4 font-semibold text-white h-16 w-32 shadow-lg text-xl rounded-lg mx-auto">{login ? "Sign-in" : "Sign-up"}</button>
                        </form>
                    </div>
                </div>


                {/* Container for when invoking forgot password */}
                {forgotPassword ?

                <>
                    <div className="absolute h-full w-full">

                        {/* Overlay */}
                        <div className="h-full w-full bg-stone-600 opacity-60"></div>

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 py-8 md:p-6 lg:p-8 lg:py-12 h-fit w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 rounded-xl shadow-xl z-5 bg-[#F0F8FF] p-8">

                            <div className="relative">

                                <button onClick={() => {invokeForgotPassword()}} draggable='false' type="button"><img draggable='false' src={BackArrow} className="absolute select-none cursor-pointer top-1 left-1 h-8" alt="Back" /></button>

                                <p draggable='false' className="text-black select-none text-3xl inter-semilight text-center">Forgot Password</p>
                            </div>

                            <hr draggable='false' className="mt-4 select-none"/>

                            <div draggable='false' className="py-6 pt-12">
                                <form action="" className="flex flex-col">

                                    <p className="text-black select-none text-2xl inter-semilight text-left">Please enter your email</p>

                                    <p className="text-black select-none text-lg inter-light text-left">An email containing the instructions to renew your password will be sent to the email address you provide. Please check your email account.</p>

                                    <div className="flex flex-col gap-2 mt-8">

                                        <p className="text-black select-none text-xl inter-light">Email:</p>

                                        <input onChange={(e) => setForgotPassEmail(e.target.value)} value={forgotPassEmail} className={`p-2 px-2.5 text-xl rounded-lg border-2 w-full ${errors.forgotPassEmail ? "border-red-500" : "border-black"}`} type="text" placeholder="exampleemail@gmail.com" />
                                        {errors.forgotPassEmail && <p className="text-red-500 text-sm">{errors.forgotPassEmail}</p>}
                                    </div>

                                    <button type="submit" draggable='false' className="bg-[#B5CBB7] py-2 cursor-pointer select-none px-4 font-semibold text-white h-16 w-32 shadow-lg text-xl rounded-lg mx-auto mt-8">Submit</button>
                                </form>
                            </div>            
                        </div>
                    </div>
                </>
                
                :
                
                <>
                    {/* Render nothing if forgot password is not invoked */}
                </>}
            </div>
        </>
    );
}