import React, { useState } from "react";
import Client from "./Client";
import logo from "../assets/code-sync.png";
import { FaBars } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const Sidebar = ({ userList, copyRoomIdHandler, leaveRoomHandler }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Desktop View Sidebar  */}
      <div className=" bg-primary_color py-4 px-3 w-[15rem] hidden flex-col lg:flex  ">
        <div className=" flex flex-col flex-1">
          <div className=" border-b-[1px] border-slate-700 flex items-center justify-between">
            <img className="h-[65px] pb-2" src={logo} alt="logo" />
          </div>

          <h1 className=" text-lg text-white font-bold py-2">Connected</h1>

          {/* User List  */}
          <div className=" flex flex-col gap-2">
            {userList.map((client) => (
              <Client key={client.socketId} userName={client.userName} />
            ))}
          </div>
        </div>

        {/* Buttons  */}
        <button
          onClick={copyRoomIdHandler}
          className="text-sm font-bold  bg-white border-2 border-white rounded-md px-3 py-2 transition-all duration-300 hover:bg-transparent hover:text-white "
        >
          Copy ROOM ID
        </button>
        <button
          onClick={leaveRoomHandler}
          className="text-sm font-bold  bg-secondary_color border-2 border-secondary_color rounded-md px-3 py-2 transition-all duration-300 hover:bg-transparent hover:text-white mt-3"
        >
          Leave
        </button>
      </div>

      {/* OverLay  */}
      {sidebarOpen ? (
        ""
      ) : (
        <div
          onClick={() => setSidebarOpen(true)}
          className="  bg-primary_color bg-opacity-20 absolute h-full w-full z-10 lg:hidden"
        ></div>
      )}

      {/* Menu Bar  */}
      <span
        className={`text-black absolute z-10 top-5 transition-all duration-500 ${
          sidebarOpen ? "left-5" : "left-[14rem]"
        } text-2xl lg:hidden bg-white p-3 rounded-full `}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaBars /> : <MdClose />}
      </span>

      {/* Phone View Sidebar  */}
      <div
        className={` bg-primary_color py-4 px-3 w-[13rem] lg:hidden flex flex-col h-[100vh] absolute z-10  transition-all duration-500  ${
          sidebarOpen ? "translate-x-[-100%]" : ""
        }`}
      >
        <div className=" flex flex-col flex-1">
          <div className=" border-b-[1px] border-slate-700 flex items-center justify-between">
            <img className="h-[65px] pb-2" src={logo} alt="logo" />
          </div>

          <h1 className=" text-lg text-white font-bold py-2">Connected</h1>

          {/* User List  */}
          <div className=" flex flex-col gap-2">
            {userList.map((client) => (
              <Client key={client.socketId} userName={client.userName} />
            ))}
          </div>
        </div>

        {/* Buttons  */}
        <button
          onClick={copyRoomIdHandler}
          className="text-sm font-bold  bg-white border-2 border-white rounded-md px-3 py-2 transition-all duration-300 hover:bg-transparent hover:text-white "
        >
          Copy ROOM ID
        </button>
        <button
          onClick={leaveRoomHandler}
          className="text-sm font-bold  bg-secondary_color border-2 border-secondary_color rounded-md px-3 py-2 transition-all duration-300 hover:bg-transparent hover:text-white mt-3"
        >
          Leave
        </button>
      </div>
    </>
  );
};

export default Sidebar;
