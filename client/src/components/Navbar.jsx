import React, { useState, useEffect, useRef } from "react";
import {  IoNotifications } from "react-icons/io5"; // Close icon
import DarkModeBtn from "./DarkModeBtn";
import gali_logo_dark from "../assets/loc_round_dark.svg";
import gali_logo_light from "../assets/loc_round_light.svg";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import api from "../utils/api";
import { MdLocationOn } from "react-icons/md";
import NotificationDialog from "./NotificationDialog";
import Spinner from "./Spinner";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
    useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading, logout, sidebarToggle } = useAuth();
  const theme = localStorage.getItem("theme");

  // console.log(user);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    if (user && user.role === "individual")
      setIsMobileMenuOpen((prev) => !prev);
    if (user && user.role === "business") sidebarToggle();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.post("/users/logout");
      if (res.status === 200) {
        logout();
      }
    } catch (error) {
      console.log("Error while logging out,", error.response.data.message);
    }
  };

  return (
    <nav className="z-50 fixed w-full flex justify-center py-1 px-2 bg-light dark:bg-dark">
      <div className="w-full max-w-7xl flex">
        {/* Mobile Menu Toggle (Left on small screens) */}
        {/* {user && (
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden text-2xl rounded-md bg-gray-200 dark:bg-primary-dark shadow"
        >
          {isMobileMenuOpen ? (
            <IoCloseCircle size={32} />
          ) : (
            <IoSearchCircle size={32} />
          )}
        </button>
      )} */}

        {/* Website Name & Logo */}
        <Link
          to={user?.role === 'business' ? "/business/dashboard" : "/"}
          className="flex-1 flex items-center justify-center lg:justify-start gap-2"
        >
          <img
            src={theme === "dark" ? gali_logo_dark : gali_logo_light}
            alt="Logo"
            className="w-12 h-12 hidden sm:flex"
          />
          <h1 className="text-dark dark:text-light text-xl lg:text-2xl xl:text-3xl font-bold sm:flex items-center tracking-wider hidden">
            <div className="text-secondary flex">
              <div className="-rotate-12 ">G</div>
              <span>ali</span>
            </div>
            <div className="text-primary flex">
              <div className="rotate-12 ">G</div>

              <span>ali</span>
            </div>
            <MdLocationOn className="text-red-600 -mx-1" />
            <span>nfo</span>
          </h1>
          <h1 className="text-dark dark:text-light font-bold sm:hidden absolute left-1/2 transform -translate-x-1/2">
            GaliGaliInfo
          </h1>
        </Link>

        {/* <div className="max-w-2xl xl:max-w-4xl justify-center bg-light dark:bg-dark gap-4 hidden lg:flex">
        <input type="text" placeholder="Select Area" className="input" />
        <input
          type="text"
          placeholder="Search"
          className="input w-80 xl:w-96"
        />
      </div> */}

        {/* Right Side: Profile & Mobile Menu */}
        <div className="flex items-center gap-1 ml-4">
          {/* Profile Section */}
          <IoNotifications
            className="cursor-pointer p-2 rounded-full hover:bg-slate-300 dark:hover:bg-slate-800/75 transition-all duration-300"
            size={32}
            onClick={() => setIsNotificationDialogOpen((prev) => !prev)}
          />
          <div ref={dropdownRef} className="relative">
            <div
              onClick={toggleDropdown}
              className="flex items-center gap-1 px-1.5 py-1 cursor-pointer transition-all duration-300"
            >
              {user ? (
                <img
                  src={user.role === 'business' ? user.logo : user.profileImage}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover shadow-md"
                />
              ) : (
                <DarkModeBtn />
              )}
              {user ? (
                <span className="text-lg hidden sm:block">{user.role === 'business' ? user.organization_name : user.fullName}</span>
              ) : (
                <button onClick={() => navigate("/login")} className="btn">
                  {loading ? <Spinner /> : "Login"}
                </button>
              )}
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && user && (
              <div className="absolute top-14 right-0 bg-light dark:bg-dark border border-primary/15 rounded-lg p-2 shadow-lg z-10">
                <ul className="flex flex-col px-4 py-2">
                  <li className="hover-border cursor-pointer py-1 w-full text-center">
                    Profile
                  </li>
                  <div className="w-full h-px bg-dark/15 dark:bg-light/15 my-2"></div>
                  <li>
                    <DarkModeBtn />
                  </li>
                  <div className="w-full h-px bg-dark/15 dark:bg-light/15 my-2"></div>
                  <li
                    onClick={handleLogout}
                    className="hover-border cursor-pointer py-1 w-full text-center"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {/* {isMobileMenuOpen && (
        <div className="absolute top-14 left-0 w-full bg-light dark:bg-dark shadow-lg p-2 flex flex-col xs:flex-row gap-4 lg:hidden">
          <input type="text" placeholder="Select Area" className="input" />
          <input type="text" placeholder="Search" className="input w-full" />
        </div>
      )} */}

        {isNotificationDialogOpen && (
          <NotificationDialog
            setIsNotificationDialogOpen={setIsNotificationDialogOpen}
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
