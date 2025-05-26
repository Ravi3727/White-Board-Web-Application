"use client"

import { useContext, useEffect, useRef, useState } from "react"
import boardContext from "../../store/board-context"
import Board from "../Board/index"
import Toolbar from "../Toolbar"
import Toolbox from "../Toolbox"
import ToolboxProvider from "../../store/ToolboxProvider"
import axios from "axios"
import { useParams } from "react-router-dom"
import { io } from "socket.io-client"


const CanvasEditPage = () => {
  const { elements, setElements, updateElement } = useContext(boardContext)
  const [isAuthorized, setIsAuthorized] = useState(true)
  const [socket, setSocket] = useState(null)
  const updateCanvasUrl = `${import.meta.env.VITE_BACKENDURL}/canvas/update`
  const { id } = useParams()

  // Initialize socket connection
  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken")
  //   console.log("Initializing socket connection with token:", token)
  //   const socketInstance = io("http://localhost:3000", {
  //     extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  //   });
  //   // setSocket(socketInstance)

  //   socketInstance.on("connect", () => {
  //     console.log("Connected to WebSocket server:", socketInstance.id)
  //   })

  //   console.log("Joining canvas with ID:", id, "Socket ID:", socketInstance ? socketInstance.id : "No socket connection")
  //   if (id) {
  //     socketInstance.emit("joinCanvas", { canvasId: id })
  //     socketInstance.on("loadCanvas", (canvasElements) => {
  //       console.log("Received canvas data:", canvasElements)
  //       setElements(canvasElements)
  //       // Save to localStorage as backup
  //       // localStorage.setItem("element", JSON.stringify(canvasElements))
  //     })

  //     const handleCanvasUpdate = (updatedElements) => {
  //       console.log("Received canvas update from other user:", updatedElements);
  //       setElements(updatedElements);
  //     };

  //     socketInstance.on("receiveDrawingUpdate", handleCanvasUpdate);

  //     socketInstance.emit("updateCanvas", { canvasId: id, elements });


  //     return () => {
  //       socketInstance.disconnect();
  //       socketInstance.off("loadCanvas")
  //       socketInstance.off("receiveDrawingUpdate", handleCanvasUpdate);
  //     }
  //   }
  // }, []||[id, elements])

  // Join canvas room and handle initial data
  // useEffect(() => {
  //   console.log("Joining canvas with ID:", id, "Socket ID:", socket ? socket.id : "No socket connection")
  //   if (socket && id) {
  //     socket.emit("joinCanvas", { canvasId: id })

  //     socket.on("loadCanvas", (canvasElements) => {
  //       console.log("Received canvas data:", canvasElements)
  //       setElements(canvasElements)
  //       // Save to localStorage as backup
  //       // localStorage.setItem("element", JSON.stringify(canvasElements))
  //     })

  //     // socket.on("unauthorized", (data) => {
  //     //   alert("Access Denied: You cannot edit this canvas.")
  //     //   setIsAuthorized(false)
  //     // })

  //     // Clean up event listeners
  //     return () => {
  //       socket.off("loadCanvas")
  //       // socket.off("unauthorized")
  //     }
  //   }
  // }, [id])

  // useEffect(() => {
  //   if (!socket || !id) return;

  //   const handleCanvasUpdate = (updatedElements) => {
  //     console.log("Received canvas update from other user:", updatedElements);
  //     setElements(updatedElements);
  //   };

  //   socket.on("receiveDrawingUpdate", handleCanvasUpdate);

  //   return () => {
  //     socket.off("receiveDrawingUpdate", handleCanvasUpdate);
  //   };
  // }, [socket, id]);


  // useEffect(() => {
  //   if (socket && elements && id) {
  //     socket.emit("updateCanvas", { canvasId: id, elements });
  //   }
  // }, [elements, socket, id]);



  // Emit changes to other users when elements change
  // useEffect(() => {
  //   if (socket && elements && id) {
  //     console.log("Emitting canvas update to other users")
  //     socket.emit("updateCanvas", { canvasId: id, elements })
  //     socket.on("loadCanvas", (canvasElements) => {
  //       console.log("Received canvas data:", canvasElements)
  //       setElements(canvasElements)
  //       // Save to localStorage as backup
  //       localStorage.setItem("element", JSON.stringify(canvasElements))
  //     })
  //     // Save to localStorage as backup
  //     localStorage.setItem("element", JSON.stringify(elements))
  //     console.log("element update se ", elements);
  //   }
  // }, [elements, socket, id])

  // Save canvas to database


  // const [socket, setSocket] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const socketInstance = io("http://localhost:3000", {
      extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server:", socketInstance.id);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("Joining canvas with ID:", id, "Socket ID:", socket ? socket.id : "No socket connection");
    if (!socket || !id) return;

    console.log("Joining canvas:", id);
    socket.emit("joinCanvas", { canvasId: id });

    const handleCanvasLoad = (canvasElements) => {
      console.log("Received canvas data:", canvasElements);
      setElements(canvasElements);
    };

    const handleCanvasUpdate = (updatedElements) => {
      console.log("Received canvas update from another user:", updatedElements);
      setElements(updatedElements);
    };

    socket.on("loadCanvas", handleCanvasLoad);
    socket.on("receiveDrawingUpdate", handleCanvasUpdate);

    return () => {
      socket.off("loadCanvas", handleCanvasLoad);
      socket.off("receiveDrawingUpdate", handleCanvasUpdate);
    };
  }, [socket, id]);


  const lastSent = useRef(null);
  useEffect(() => {
    if (!socket || !id || !elements) return;

    if (JSON.stringify(lastSent.current) === JSON.stringify(elements)) return;

    lastSent.current = elements;

    const timeout = setTimeout(() => {
      console.log("Sending canvas update (after checking diff)");
      socket.emit("updateCanvas", { canvasId: id, elements });
    }, 300);

    return () => clearTimeout(timeout);
  }, [elements, socket, id]);


  const updateCanvas = async () => {
    const Token = localStorage.getItem("accessToken")

    if (!elements || elements.length === 0) {
      console.log("No elements to save.")
      return
    }

    try {
      const response = await axios.put(
        updateCanvasUrl,
        {
          elements: elements,
          canvasId: id,
        },
        {
          headers: { Authorization: `Bearer ${Token}` },
          withCredentials: true,
        },
      )

      console.log("Canvas updated successfully:", response.data)
      alert("Canvas saved successfully!")
    } catch (error) {
      console.error("Error updating canvas:", error)
      alert("Failed to save canvas. " + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-100">
      <div className="border w-full h-full bg-white shadow-md">
        <ToolboxProvider>
          <Toolbar />
          <Board />
          <Toolbox />
        </ToolboxProvider>
      </div>
      <div className="fixed right-5 bottom-5">
        <button
          onClick={updateCanvas}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default CanvasEditPage

