import React, { useContext } from "react";
import classes from "./index.module.css";

import cx from "classnames";
import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
} from "react-icons/fa";
import { IoCloudDone } from "react-icons/io5";
import { LuRectangleHorizontal } from "react-icons/lu";
import { TOOL_ITEMS } from "../../constants";
import boardContext from "../../store/board-context";
import Navbar from "../Navbar/Navbar";
import { useState } from "react";
import axios from "axios";

const Toolbar = () => {
  const { activeToolItem, changeToolHandler, undo, redo, elements } =
    useContext(boardContext);

  const [name, setName] = useState("");
  const [openInput, setOpenInput] = useState(false);


  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.png";
    anchor.click();
  };

  const handleInputEvent = () => {
    setOpenInput(!openInput);
  }
  // Function to save elements
  const saveCanvasHandler = async () => {
    try {
      handleInputEvent();
      const Token = localStorage.getItem("accessToken");

      if (name !== undefined && name !== "") {
        const response = await axios.post(`${import.meta.env.VITE_BACKENDURL}/canvas/create`, {
          name, element: elements
        }, {
          headers: { Authorization: `Bearer ${Token}` },
          withCredentials: true,
        });
        console.log("Canvas saved successfully:", elements);
        console.log("Canvas saved successfully:", response);
      } else {
        console.log("Please enter a name for the canvas");
      }

    } catch (error) {
      console.error("Error saving canvas:", error);
    }
  };

  const url = window.location.href;

  return (

    <>
      {openInput && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-xl z-50 flex flex-col gap-4 justify-center items-center">
          <h2 className="text-xl font-semibold">Save your canvas</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter name"
              className="border-2 border-gray-300 p-2 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={saveCanvasHandler} className="bg-orange-500 text-white p-2 rounded-md">
              Save
            </button>
          </div>
        </div>
      )}


      <div className="flex w-full justify-evenly top-2 py-2 z-50 fixed ">

        <div className="flex w-10/12 justify-center items-center">


          <div className="flex p-1 shadow-xl justify-center items-center border-solid border-black border-2 rounded-md ">


            <div
              className={cx(classes.toolItem, {
                [classes.active]: activeToolItem === TOOL_ITEMS.BRUSH,
              })}
              onClick={() => changeToolHandler(TOOL_ITEMS.BRUSH)}
            >
              <FaPaintBrush />
            </div>
            <div
              className={cx(classes.toolItem, {
                [classes.active]: activeToolItem === TOOL_ITEMS.LINE,
              })}
              onClick={() => changeToolHandler(TOOL_ITEMS.LINE)}
            >
              <FaSlash />
            </div>
            <div
              className={cx(classes.toolItem, {
                [classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE,
              })}
              onClick={() => changeToolHandler(TOOL_ITEMS.RECTANGLE)}
            >
              <LuRectangleHorizontal />
            </div>
            <div
              className={cx(classes.toolItem, {
                [classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE,
              })}
              onClick={() => changeToolHandler(TOOL_ITEMS.CIRCLE)}
            >
              <FaRegCircle />
            </div>
            <div
              className={cx(classes.toolItem, {
                [classes.active]: activeToolItem === TOOL_ITEMS.ARROW,
              })}
              onClick={() => changeToolHandler(TOOL_ITEMS.ARROW)}
            >
              <FaArrowRight />
            </div>
            <div
              className={cx(classes.toolItem, {
                [classes.active]: activeToolItem === TOOL_ITEMS.ERASER,
              })}
              onClick={() => changeToolHandler(TOOL_ITEMS.ERASER)}
            >
              <FaEraser />
            </div>
            <div
              className={cx(classes.toolItem, {
                [classes.active]: activeToolItem === TOOL_ITEMS.TEXT,
              })}
              onClick={() => changeToolHandler(TOOL_ITEMS.TEXT)}
            >
              <FaFont />
            </div>
            <div className={classes.toolItem} onClick={undo}>
              <FaUndoAlt />
            </div>
            <div className={classes.toolItem} onClick={redo}>
              <FaRedoAlt />
            </div>
            <div className={classes.toolItem} onClick={handleDownloadClick}>
              <FaDownload />
            </div>
            {
              url.includes("/edit/") ? <div className="display-none">
                
              </div> :
              
              <button className={classes.saveButton} onClick={handleInputEvent}>
              <IoCloudDone />
            </button>}


          </div>
        </div>

        <div className="w-2/12">
          <Navbar />
        </div>

      </div>

    </>
  );
};

export default Toolbar;