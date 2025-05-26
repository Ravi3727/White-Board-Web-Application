import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
function Navbar() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState();


    useEffect(() => {
        const userId = localStorage.getItem('ID');
        setUserId(userId);
    }, []);

    const logoutUser = async () => {
        try {
            const Token = localStorage.getItem("accessToken");
            localStorage.clear();
            setUserId(null);
            const url = `${import.meta.env.VITE_BACKENDURL}/users/logout`;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                console.log("Logged out successfully!");
                navigate("/signin");
                // window.location.reload(); 

            } else {
                // setErrorMessage(response.data.message);
                // setLoading(false);
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error(`Error during logout: ${error.message}`);
        }
    };

    return (
        <>
            <div className='flex rounded-xl justify-evenly'>
                <Link to="/allCanvas">

                    <div className='bg-blueNew text-md font-semibold w-20 text-center items-center text-white p-4 rounded-xl hover:cursor-pointer hover:shadow-lg'>
                        List
                    </div>
                </Link>

                {
                    userId ?
                        <div className='bg-blueNew text-md font-semibold w-24 text-white text-center items-center p-4 rounded-xl hover:cursor-pointer hover:shadow-lg' onClick={logoutUser}>
                            LogOut
                        </div> :


                        <Link to="/signin">
                            <div className='bg-blueNew text-md font-semibold w-20 text-white text-center items-center p-4 rounded-xl hover:cursor-pointer hover:shadow-lg'>
                                {userId ? "LogOut" : "Login"}
                            </div>
                        </Link>}

            </div>
        </>
    )
}

export default Navbar