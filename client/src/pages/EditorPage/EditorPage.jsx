import React, { useEffect, useRef, useState } from "react";
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
import Sidebar from "../../components/Sidebar";

const EditorPage = () => {
  const [userList, setUserList] = useState([]);
  // const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const copyRoomIdHandler = async (setSidebarOpen) => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id has been copied to your Clipboard");
      setSidebarOpen(false);
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
    <div className=" lg:flex relative h-full w-full  ">
      {/* Left Side  */}
      <Sidebar
        userList={userList}
        copyRoomIdHandler={copyRoomIdHandler}
        leaveRoomHandler={leaveRoomHandler}
      />

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
