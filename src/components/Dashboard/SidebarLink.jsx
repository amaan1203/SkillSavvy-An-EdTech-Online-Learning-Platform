import React from 'react'
//  vsc agr likha hota hai to icons ko ham fetch kar skte hai as a state variable 
//   read more about it 
import * as Icons from "react-icons/vsc"
import { matchPath, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


const SidebarLink = ({link , iconName}) => {
    //  iconname ko as a prop pass kia hai 
    const Icon = Icons[iconName];
    const location= useLocation();
    //  ab hame color change karna hai jis tab par ham hai to iske lie ham match route use karte hai
    //  yeh match route hamne navbar me  bhi create kia tha jisse navbar me current tab ka color yellow dikha sake
    // console.log(" location.pathname ko print kia inside sidebar links in dashboard"); 
    console.log(location.pathname);
    const matchRoute = (route) => {
        return matchPath({path: route}, location.pathname);
    }
  return (
    <NavLink 
    to={link.path}
    className={`relative px-8 py-2 text-sm font-medium  
                ${matchRoute(link.path) ? "bg-yellow-800 text-yellow-50" : "bg-opacity-0 text-richblack-300"} transition-all duration-200 active`}
>
    <span className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 
                    ${matchRoute(link.path) ? "opacity-100": "opacity-0"}`}>
    </span>

    <div className="flex items-center gap-x-2">
        <Icon className="text-lg"/>
        <span>{link.name}</span>
    </div>
</NavLink>
  )
}

export default SidebarLink
