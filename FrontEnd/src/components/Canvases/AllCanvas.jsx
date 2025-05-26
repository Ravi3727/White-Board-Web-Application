import React, { useEffect } from 'react'
import { useState } from 'react'
import CanvasList from './CanvasList';
import axios from 'axios';
import SharedCanvasList from './SharedCanvasList';
import { Link } from 'react-router-dom';
function AllCanvas() {
    const [tab, setTab] = useState("All");
    const [canvas, setCanvas] = useState("");

    const getAllCanvases = async () => {
        const Token = localStorage.getItem("accessToken");
        // console.log("token fe ", Token);
        await axios.get(`${import.meta.env.VITE_BACKENDURL}/canvas/list`, {
            headers: { Authorization: `Bearer ${Token}` },
            withCredentials: true,
        })
            .then((response) => {
                // console.log("front end", response.data.data);
                setCanvas(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        getAllCanvases();
    }, []);

    return (
        <>
            <div className='flex flex-col w-full lg:h-screen h-full bg-blueNew md:space-y-6 '>
                <Link to="/" >
                <div className='text-3xl shadow-xl hover:cursor-pointer hover:bg-orange-600 rounded-lg font-bold text-white flex justify-center items-center text-center h-16 bg-orange-500'>
                    Back To Canvas
                </div>
                </Link>
                <div className='w-full items-center justify-center flex h-28'>
                    <h1 className='md:text-5xl text-3xl font-extrabold overflow-y-hidden text-white'> DashBoard </h1>
                </div>

                <div className='flex w-full h-full md:h-12 flex flex-row justify-evenly items-center overflow-y-hidden'>
                    <div className='lg:text-3xl text-lg leading-6 font-bold overflow-y-hidden hover:cursor-pointer hover:shadow-xl text-white lg:border-2 rounded-xl p-1 lg:p-3' onClick={() => setTab("All")}>
                        All Canvases
                    </div>


                    <div className='lg:text-3xl text-xl leading-6 font-bold overflow-y-hidden hover:cursor-pointer hover:shadow-xl text-white lg:border-2 rounded-xl p-1 lg:p-3' onClick={() => setTab("Shared")}>
                        Shared Canvases
                    </div>
                </div>


                {
                    tab === "All" ?
                        <div className='w-full h-full flex justify-center items-center overflow-y-hidden'>
                            < CanvasList canvases={canvas} />
                        </div>
                        :
                        <div className='w-full h-full '>
                            <SharedCanvasList canvases={canvas} />
                        </div>
                }
            </div>
        </>
    )
}

export default AllCanvas