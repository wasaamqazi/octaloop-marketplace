import React from "react";
import MyRouter from "routers/index";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <MyRouter />
    </div>
  );
}

export default App;
