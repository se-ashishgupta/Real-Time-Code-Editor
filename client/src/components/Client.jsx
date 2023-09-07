import React from "react";
import Avatar from "react-avatar";

const Client = ({ userName }) => {
  return (
    <div className=" flex items-center gap-2 ">
      <Avatar name={userName} size="50px" round="40px" />
      <span className=" text-sm text-white ">{userName}</span>
    </div>
  );
};

export default Client;
