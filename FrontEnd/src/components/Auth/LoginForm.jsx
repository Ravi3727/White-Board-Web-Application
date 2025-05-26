import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spin from "../../Spin";

const url = `${import.meta.env.VITE_BACKENDURL}/users/login`;

function LoginForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        login(formData.email, formData.password);
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(url, { email, password });

            if (response.data.success === true) {
                const userData = response.data.data.loggedInUser;
                localStorage.setItem("ID", userData._id);
                localStorage.setItem("email", userData.email);
                localStorage.setItem("accessToken", response.data.data.accessToken);
                navigate(`/`);
            } else {
                setErrorMessage(response.data.message);
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            if (axios.isAxiosError(error) && error.response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(error.response.data, "text/html");
                const preElement = doc.querySelector("pre");

                if (preElement) {
                    const preText = preElement.textContent || "";
                    const match = preText.match(/Error: (Invalid password|User does not exist)/);
                    if (match) {
                        setErrorMessage(match[1]);
                    } else {
                        setErrorMessage("An unknown error occurred.");
                    }
                } else {
                    setErrorMessage("An unknown error occurred.");
                }
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        }
        setLoading(false);
    };

    const handleGuestLogin = () => {
        login("yash123@gmail.com", "yash123");
    };

    return (
        <div className="border-2 max-w-md w-full space-y-8 shadow-xl bg-customBlue border-1 rounded-md p-2 backdrop-filter backdrop-blur-lg select-none">
            <div>
                <h2 className="mt-6 overflow-y-hidden text-center text-3xl font-extrabold text-orange-500">
                    Login to WhiteBoard
                </h2>
            </div>
            {errorMessage && (
                <div className="text-red-500 text-center">{errorMessage}</div>
            )}
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-2 p-2">
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    {loading ? (
                        <button className='bg-orange-500 w-full items-center flex justify-center mx-auto text-white font-semibold p-1 rounded-lg mt-2 hover:bg-orange-600'>
                            <Spin />
                        </button>
                    ) : (
                        <>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mb-1"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={handleGuestLogin}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Guest Login
                            </button>
                        </>
                    )}
                </div>
            </form>

            <div>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Create an account{" "}
                    <a
                        href="/signup"
                        className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                    >
                        SignUp
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
