import React, { useEffect, useState } from "react";
import axios from "axios";

function SharedCanvasList({ canvases }) {
  const [canvasDetails, setCanvasDetails] = useState([]);

  useEffect(() => {
    const fetchSharedUsers = async () => {
      const Token = localStorage.getItem("accessToken");
      const updatedCanvasDetails = await Promise.all(
        canvases
          .filter((canvas) => canvas.shared.length > 0) 
          .map(async (canvas) => {
            const sharedUsers = await Promise.all(
              canvas.shared.map(async (userId) => {
                try {
                  const response = await axios.post(
                    `${import.meta.env.VITE_BACKENDURL}/users/`,
                    { userId },
                    {
                      headers: { Authorization: `Bearer ${Token}` },
                      withCredentials: true,
                    }
                  );
                  return response.data.data; 
                } catch (error) {
                  console.error("Error fetching user:", error);
                  return null; 
                }
              })
            );

            return {
              ...canvas,
              sharedUsers: sharedUsers.filter((user) => user !== null), 
            };
          })
      );

      setCanvasDetails(updatedCanvasDetails);
    };

    fetchSharedUsers();
  }, [canvases]);

  return (
    <div className="w-10/12 mx-auto p-2 min-h-screen ">
      <h2 className="text-3xl lg:text-5xl overflow-y-hidden text-center font-semibold m-8 text-white">Shared Canvas</h2>
      <div className=" w-full flex flex-col md:flex-row md:justify-evenly items-center md:flex-wrap gap-4">
        {canvasDetails.length > 0 ? (
          canvasDetails.map((canvas) => (
            <div
              key={canvas._id}
              className="p-4 bg-white w-full lg:w-10/12 shadow-md rounded-lg border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800">
                {canvas.name}
              </h3>
              <p className="text-sm text-gray-500">
                Created At: {new Date(canvas.createdAt).toLocaleString()}
              </p>
              <h4 className="mt-2 text-lg font-semibold text-gray-700">
                Shared With
              </h4>
              {canvas.sharedUsers.length > 0 ? (
                <ul className="list-disc ml-4 text-gray-600 text-sm">
                  {canvas.sharedUsers.map((user) => (
                    <li key={user._id} className="">
                      <div className="flex justify-between font-semibold text-md leading-6">
                        <div>
                          {user.username}
                        </div>
                        <div>
                          {user.email}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No users found</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No shared canvases available</p>
        )}
      </div>
    </div>
  );
}

export default SharedCanvasList;
