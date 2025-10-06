// Imported components
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserTypeOption } from "../contexts/UserTypeContext";
import EyeIcon from "../assets/eye.svg";
import UnhiddenEyeIcon from "../assets/crossed-eye.svg";

export default function Login(){

    const [hidden, setHidden] = useState(true);
    const [hiddenRetype, setHiddenRetype] = useState(true);
    const [icon, setIcon] = useState(EyeIcon);
    const [retypeIcon, setRetypeIcon] = useState(EyeIcon);
    const [login, setLogin] = useState(true);

    // State tracking to throw errors if necessary...
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");

    // To navigte back to login when pressing back...
    const navigate = useNavigate();
    const { setIsAdmin } = useUserTypeOption(); // Uses value of isAdmin in useContext...

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newErrors: any = {};
        // Basic validation
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        if (!login) {
            if (!firstName) newErrors.firstName = "First name is required";
            if (!lastName) newErrors.lastName = "Last name is required";
            if (!retypePassword) newErrors.retypePassword = "Please retype your password";
            if (password && retypePassword && password !== retypePassword)
            newErrors.retypePassword = "Passwords do not match";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            console.warn("Validation failed:", newErrors);
            return;
        }

            try {
                if (login) {
        // LOGIN flow
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        // Save auth info to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("isAdmin", data.isAdmin ? "true" : "false");

        // Save first & last name of current user to display

        //   console.log(data);
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);

        // Update context
        setIsAdmin(data.isAdmin);

        navigate("/authenticated");
        }

            else {
            // SIGNUP flow
            //   console.log("Attempting registration with:", { firstName, lastName, email });

            await registerUser({ firstName, lastName, email, password, retypePassword });
            alert("Registration successful! You can now log in.");
            setLogin(true); // Switch back to login
            }
        } catch (err) {
            console.error("Error during handleSubmit:", err);
            alert("Something went wrong. Please try again later.");
        }
    };

        // To register the user
        async function registerUser({
        firstName,
        lastName,
        email,
        password,
        retypePassword,
        }: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        retypePassword: string;
        }) {
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                retypePassword,
                role: "employee", // default role
                schedule: { start: "09:00", end: "18:00" } // default schedule
            }),
            });

            console.log("Register response status:", response.status);
            const data = await response.json();
            // console.log("Register response body:", data);

            if (!response.ok) {
            console.error("Registration failed:", data.message);
            return;
            }

            localStorage.setItem("token", data.token);
            // console.log("User registered successfully. Is admin?", data.isAdmin);
        } catch (err) {
            console.error("Error registering user:", err);
        }
    }


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
            </div>
        </>
    );
}