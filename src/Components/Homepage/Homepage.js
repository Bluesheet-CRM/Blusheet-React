import React, { useEffect, useState } from "react";

function Homepage() {
  const [time, setTime] = useState(0);
  const [mins, setMins] = useState(0);

  useEffect(() => {
    let date = new Date();
    let time = date.getHours();
    let mins = date.getMinutes();
    setMins(mins);
    setTime(time);
  },[]);
  return (
    <div
      style={{
        position: "absolute",
        top: "35vh",
        left: "40vw",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "4rem", fontWeight: "800" }}>
        {time}: {mins} {time < 12 ? "AM" : "PM"}{" "}
      </h1>
      <h3 style={{ fontSize: "4rem" }}>Hello There!</h3>
    </div>
  );
}

export default Homepage;
