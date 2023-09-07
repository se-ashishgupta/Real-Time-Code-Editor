import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/code-sync.png";
import Client from "../../components/Client";
import Editor from "../../components/Editor";
import { initSocket } from "../../socket";
import { ACTIONS } from "../../Actions";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

const EditorPage = () => {
  const [userList, setUserList] = useState([]);

  const codeRef = useRef(null);

  const location = useLocation();

  const { roomId } = useParams();

  const socketRef = useRef(null);

  const reactnavigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (error) => handleError(error));
      socketRef.current.on("connect_failed", (error) => handleError(error));

      function handleError(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again latter");
        reactnavigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: roomId,
        userName: location.state?.userName,
      });

      //Listeninig for Join event

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, userName, socketId }) => {
          if (userName !== location.state.userName) {
            toast.success(`${userName} Joined`);
            console.log(`${userName} Joined`);
          }

          setUserList(clients);

          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      //Listeninig for disconnected

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ userName, socketId }) => {
        toast.success(`${userName} Left`);

        setUserList((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });

        console.log(`${userName} Left`);
      });
    };

    init();

    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  const copyRoomIdHandler = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id has been copied to your Clipboard");
    } catch (error) {
      toast.error("Could not copy the Room Id");
      console.log(error);
    }
  };
  const leaveRoomHandler = async () => {
    reactnavigate("/");
  };

  if (!location.state) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className=" flex">
      {/* Left Side  */}
      <div className=" bg-primary_color py-4 px-3 w-[15vmax] flex flex-col">
        <div className=" flex flex-col flex-1">
          <div className=" border-b-[1px] border-slate-700">
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

      {/* Right Side */}
      <div className=" flex-1 ">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
