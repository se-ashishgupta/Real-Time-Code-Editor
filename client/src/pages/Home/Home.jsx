import React, { useState } from "react";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const createRoomHandler = () => {
    const id = uuidV4();
    setRoomId(id);
    console.log(id);
    toast.success("Room ID Created Successfully");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();

    if (!roomId || !userName) {
      toast.error("Room Id and User Name is Required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        userName,
        roomId,
      },
    });
  };

  return (
    <div className="h-[100vh] flex items-center justify-center bg-primary_color">
      <div className=" bg-primary_color_1 rounded-lg p-5 w-[25rem] max-w-[90%]">
        <img src={logo} alt="logo" className="h-[65px] w-[60%] py-2" />

        <h1 className=" text-white font-semibold mt-5 text-sm">
          Paste Invitation ROOM ID
        </h1>

        <form className=" flex flex-col gap-4 py-2 " onSubmit={joinRoomHandler}>
          <input
            type="text"
            className="px-3 py-2 font-semibold bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-secondary_color focus:secondary_color rounded-md sm:text-sm focus:ring-1"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            className="px-3 py-2 font-semibold bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-secondary_color focus:secondary_color rounded-md sm:text-sm focus:ring-1"
            placeholder="USER NAME"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            className="text-sm font-bold  bg-secondary_color border-2 border-secondary_color rounded-md px-3 py-2 w-max transition-all duration-300 hover:bg-transparent hover:text-white ml-auto"
            type="submit"
          >
            JOIN
          </button>
        </form>

        <div>
          <p className="text-white ">
            If you don't have an inivite then create{" "}
            <Link
              onClick={createRoomHandler}
              className="text-secondary_color underline text-lg font-semibold "
            >
              new room
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
