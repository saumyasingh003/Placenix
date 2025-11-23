import { Outlet } from "react-router-dom";
import Navbar from "../Student/Navbar";
import Sidebar from "../Student/Sidebar";
import Chatbot from "../Student/Chatbot";

const Home = () => {
  return (
    
      <div className="min-h-screen w-full flex flex-col">
        <Navbar />
        <div className="flex flex-1 w-full">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <Outlet />
          </main>
        </div>
        <Chatbot />
      </div>
   
  );
};

export default Home;
