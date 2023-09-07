import React from "react";
import avatar from "../assets/coding.png";

const Client = ({ userName }) => {
  return (
    <div className=" flex items-center gap-2 ">
      <img src={avatar} className=" h-[50px] bg-white rounded-full p-2" />
      <span className=" text-sm text-white ">{userName}</span>
    </div>
  );
};

export default Client;
