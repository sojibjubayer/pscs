import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";



const Main = () => {
    return (
        <div className="">
            <div className="md:w-[90%] mx-auto ">
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
            </div>
        </div>
    );
};

export default Main;