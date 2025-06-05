import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CanvasList = ({ canvases }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [openInput, setOpenInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const getCanvasUrl = `${import.meta.env.VITE_BACKENDURL}/canvas/load/`;

  const openCanvas = async (canvasId) => {
    try {
      setLoading(true);
      const Token = localStorage.getItem("accessToken");
      // console.log("Token:", Token);
      // console.log("Canvas ID:", canvasId);
      const response = await axios.get(getCanvasUrl + canvasId, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
        withCredentials: true,
      });

      // console.log("Fetched canvas elements:", response.data.data.elements);

      // Store the elements in local storage
      localStorage.setItem("element", JSON.stringify(response.data.data.elements));
      setLoading(false);
      // Navigate to the canvas page
      navigate(`/canvas/${canvasId}`);
    } catch (error) {
      // console.error("Error fetching canvas:", error);
      alert("Failed to load canvas. Please try again.");
      setLoading(false);
    }
  };

  const openCanvasToEdit = async (canvasId) => {
    try {
      setLoading(true);
      await openCanvas(canvasId);
      // Navigate to the edit page
      navigate(`/edit/${canvasId}`);
    } catch (error) {
      console.error("Error opening canvas for editing:", error);
      alert("Failed to open canvas for editing.");
      setLoading(false);
    }
  };

  const deleteCanvasUrl = `${import.meta.env.VITE_BACKENDURL}/canvas/`;

  const deleteCanvas = async (canvasId) => {
    try {
      setLoading(true);
      const Token = localStorage.getItem("accessToken");
      const response = await axios.delete(deleteCanvasUrl + canvasId, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
        withCredentials: true,
      });

      console.log("Canvas deleted successfully:", response.data);
      alert("Canvas deleted successfully!");
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting canvas:", error);
      alert("Failed to delete canvas. Please try again.");
      setLoading(false);
    }
  };

  const handleInputEvent = () => {
    setOpenInput(!openInput);
  }

  const setCanvasIdToLocalStorage = (canvasId) => {
    localStorage.setItem("canvasId", canvasId);
    handleInputEvent();
  }

  const shareCanvas = async () => {
    try {

      handleInputEvent();
      setLoading(true);
      const canvasId = localStorage.getItem("canvasId");
      const Token = localStorage.getItem("accessToken");

      const response = await axios.put(
        `${import.meta.env.VITE_BACKENDURL}/canvas/share/${canvasId}`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Canvas shared successfully:", response.data);
      setLoading(false);
      alert("Canvas shared successfully!");
    } catch (error) {
      console.error("Error sharing canvas:", error);
      alert("Failed to share canvas. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-10/12 p-2">
      {openInput && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-xl z-50 flex flex-col gap-4 justify-center items-center">
          <h2 className="text-xl font-semibold">Save your canvas</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter name"
              className="border-2 border-gray-300 p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={shareCanvas} className="bg-orange-500 text-white p-2 rounded-md">
              Send
            </button>
            <button onClick={()=>{setOpenInput(!openInput)}} className="bg-orange-500 text-white p-2 rounded-md">
              Cancel
            </button>
          </div>
        </div>
      )}
      <h2 className="md:text-5xl text-2xl w-full overflow-y-hidden text-center font-semibold lg:mb-4 text-white">Your Canvas</h2>
      {
        (loading === true) ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-white">Loading...</p>
          </div>
        ) :
          (<div className="mt-16 w-full flex flex-col md:flex-row justify-evenly items-center md:flex-wrap gap-4">
            {canvases.length > 0 ? (
              canvases?.map((canvas) => (
                <div
                  key={canvas._id}
                  className="md:p-4 bg-white shadow-3xl w-full md:w-3/12 min-h-64 rounded-lg border flex flex-col justify-evenly border-gray-200"
                >
                  <div className="mx-auto flex flex-col items-center">
                    <h3 className="font-bold text-2xl leading-10 text-gray-800">{canvas.name}</h3>
                    <p className="text-lg text-gray-700 leading-10">
                      Created At: {new Date(canvas.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center items-center flex-wrap">
                    <button onClick={() => openCanvas(canvas._id)} className="bg-blueNew text-white p-2 rounded-md mt-2">
                      Open
                    </button>
                    <button onClick={() => openCanvasToEdit(canvas._id)} className="bg-blueNew text-white p-2 rounded-md mt-2">
                      Edit
                    </button>
                    <button onClick={() => deleteCanvas(canvas._id)} className="bg-blueNew text-white p-2 rounded-md mt-2">
                      Delete
                    </button>
                    <button onClick={() => setCanvasIdToLocalStorage(canvas._id)} className="bg-blueNew text-white p-2 rounded-md mt-2">
                      Share
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-white">No canvases available</p>
            )}
          </div>)
      }
    </div>
  );
};

export default CanvasList;