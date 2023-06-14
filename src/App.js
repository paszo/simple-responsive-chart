import React, { useState } from "react";
import BarChart from "./BarChart";

function App() {

  const data = [25, 30, 45, 60, 10, 65, 75];

  return (
      <div className="app">
        <BarChart data={data} />
      </div>
  );
}

export default App;