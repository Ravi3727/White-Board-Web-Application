import React, { useContext, useEffect, useState } from "react";
import boardContext from "../../store/board-context";
import Board from "../Board/index";

const CanvasPage = () => {
  const { elements, setElements } = useContext(boardContext);

  const setEle = async () =>{
    await setElements(JSON.parse(localStorage.getItem("element")));
    // window.location.reload();
  }
  useEffect(() => {
    setEle();
    console.log("Canvas loaded with elements display :", elements);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-100">
      <div className="border w-full h-full bg-white shadow-md">
        <Board />
      </div>
    </div>
  );
};

export default CanvasPage;
