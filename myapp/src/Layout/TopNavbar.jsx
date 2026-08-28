 
import   {useState} from "react";
import { useNavigate } from "react-router-dom";
 import {logout} from '../Api/auth.api'
import {  Bell, Moon,} from "lucide-react";
import { useSelector } from "react-redux";
import notificationService from "../Common/notificationService";

export default function TopNavbar({collapsed,}) 
{
    const user = useSelector((state) => state.user);
   const navigate = useNavigate();
 const [sidedropdown, setSideDropdown] = useState(false)
 function onfocusfunction()
 {
   setSideDropdown(prev => !prev);
 }


 
const logoutf = async ( ) =>
{
  const refreshToken = sessionStorage.getItem('refreshToken');
  try {
    console.log("token",refreshToken);
     const res = await logout(refreshToken);
        sessionStorage.clear();
        navigate("/");
    
  } catch (error) {
    notificationService.error(error.message);
  }

 }

  return (
    <>
     <header className=" h-auto  bg-white  border-b  flex items-center justify-between m-5">

  {/* LEFT */}
  <div>
    <h1 className="text-2xl font-bold text-slate-800">  {user?.name } </h1>
  </div>

  {/* RIGHT */}
  <div className="flex items-center gap-4">

    <button
      className="  w-12 h-12 rounded-2xl  bg-slate-100   flex items-center justify-center "  > <Moon />
    </button>

    <button
      className="  relative w-12 h-12 rounded-2xl  bg-slate-100 flex items-center justify-center "  >
      <Bell />  <span className=" absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white   text-xs flex items-center justify-center "
      >
        2
      </span>
    </button>
      <div>
<img onClick={onfocusfunction}  src="https://i.pravatar.cc/150?img=12" alt="" className=" w-12 h-12 rounded-full  object-cover border-2 border-teal-400
      "
    />
    <p>
    </p>      </div>
    

  </div>
</header>
{ sidedropdown && ( 
<>
 <div
  className="  absolute top-[55px] right-5    w-44 h-40    bg-[#14d8c4]    rounded-xl    shadow-2xl
    border border-gray-200    overflow-hidden    z-50    animate-in fade-in zoom-in-95 duration-300  ">
  <ul className="py-2">
    <li className="  flex items-center px-4 py-3 cursor-pointer  border-l-4 border-transparent hover:border-l-4 hover:border-teal-500  hover:bg-[#94f3e9] hover:rounded-xl  transition-all duration-300">
      👤
      <span className=" font-medium text-gray-700">
        Profile
      </span>
    </li>

    <li
      className="  flex items-center px-4 py-3 cursor-pointer border-l-4 border-transparent hover:border-l-4 hover:border-teal-500
       hover:bg-[#94f3e9] hover:rounded-xl transition-all duration-300  " >
      ⚙️
      <span className="ml-3 font-medium text-gray-700">
        Settings
      </span>
    </li>

    <li className=" flex items-center px-4 py-3 cursor-pointer border-l-4 border-transparent
        hover:border-l-4 hover:border-red-500 hover:bg-[#94f3e9] hover:rounded-xl  transition-all duration-300" >
      🚪
      <span className="ml-3 font-medium text-gray-700" onClick={logoutf}>
        Logout
      </span>
    </li>

  </ul>
</div>
 
</>

)}
</>
  );
}