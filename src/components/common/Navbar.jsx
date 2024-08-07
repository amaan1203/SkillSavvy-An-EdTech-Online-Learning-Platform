import React from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import {IoIosArrowDown} from "react-icons/io";
import { categories } from "../../services/apis";
import { useState, useEffect } from "react";
import { apiConnector } from "../../services/apiconnector";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { AiOutlineMenu } from "react-icons/ai"
import { ACCOUNT_TYPE } from "../../utils/constants";
import { BsChevronDown } from "react-icons/bs";

const Navbar = () => {
  //   ab ham use selector hook ka use karenge to fetch token , user and other states ka data stored
  //  in out redux store
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [loading , setLoading]=useState(null);


  // ab hamne sablinks karke ek state bana li jisme ham backend se jitni bhi 
  // catalogs waale dropdown ki links aa rhi hia wo store kar lenge
  const [subLinks, setSubLinks] = useState([]);

  //  ab function to get all the sublinks 
  // const fetchSubLinks = async() => {
  //   try {
  //     //   ab hame backend ke /show all categories waali api ko call karna hia 
  //     //  to hamne ek api connector karke ek services naam ke folder me file banai hai 
  //     //  yeh api connector axios ka use karke call karega api ko

  //     const result = await apiConnector("GET", categories.CATEGORIES_API);
  //     console.log("Printing Sublinks result: ", result);
  //     setSubLinks(result.data.data);

  //   } catch(error) {
  //     console.log("Could not fetch the categories list");
  //   }
  // }

  
  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("prinitng sublinks " , subLinks.length)


  // useEffect(() => {
  //   fetchSubLinks();
  // }, [])

  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
      location.pathname !== "/" ? "bg-richblack-800" : ""
    } transition-all duration-200`}>

      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img
            src={logo}
            alt="SkillSavvy.logo"
            width={160}
            height={42}
            loading="lazy"
          />
        </Link>

{/*  now we will add links */}

          {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {  NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center text-black">Loading...</p>
                        ) :  subLinks?.length !== 0 ? (
                          <>
                            {subLinks?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/*  now login buttton signup button and dashboard  */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>

        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>

      </div>
    </div>
  );
};

export default Navbar;



