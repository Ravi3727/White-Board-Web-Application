import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spin from "../../Spin";
import { Tooltip } from "react-tooltip";

function RegistrationForm() {
    const nevigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [Error, setError] = useState();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const url = `${import.meta.env.VITE_BACKENDURL}/users/register`;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Include isSuperAdmin in the payload
        const payload = {
            ...formData,
        };

        try {
            const response = await axios.post(url, payload);
            console.log("register", response);
            if (response.data.success === true) {
                nevigate("/signin");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 409) {
                    setError("User already exists");
                } else if (error.response.status === 500) {
                    // Extract validation errors from response
                    const validationErrors = error.response.data.errors;
                    console.log("User already exists inside ", error);
                    if (validationErrors.length > 0) {
                        setError(validationErrors.map(err => err.msg).join(", "));
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border-2 max-w-md w-full space-y-8 shadow-xl bg-customBlue border-1 rounded-md p-2 backdrop-filter backdrop-blur-lg select-none">
            <h2 className=" overflow-y-hidden  mt-6 text-center text-3xl font-extrabold text-orange-500">
                SignUp to WhiteBoard
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                {Error && <div>
                    <p className="text-red-500 text-center">{Error}</p>
                </div>}
                <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-2 p-2">


                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                    />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        data-tooltip-id="password-tooltip"
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500"
                    />

                    <Tooltip
                        id="password-tooltip"
                        place="top"
                        effect="solid"
                        className="z-100 max-w-[21rem] overflow-y-hidden bg-gray-900 text-white text-sm px-4 py-2 rounded-md shadow-lg"
                    >
                        Password must be at least 6 characters long and include an uppercase letter and a lowercase letter.
                    </Tooltip>
                </div>
                {/* <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2"
                >
                    {loading ? "Loading..." : "Sign Up"}
                </button> */}

                {loading ? (
                    <button className='bg-orange-500 w-full items-center flex justify-center mx-auto text-white font-semibold p-1 rounded-lg mt-2 hover:bg-orange-600'>
                        {loading ? <Spin /> : "please wait..."}
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mb-1 p-2"
                    >
                        Sign Up
                    </button>
                )}
            </form>

            <div>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Create an account{" "}
                    <a
                        href="/signin"
                        className="font-medium text-indigo-600 hover:text-indigo-500 underline"
                    >
                        SignIn
                    </a>
                </p>
            </div>
        </div>
    );
}

export default RegistrationForm;