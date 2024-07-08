import React from "react";
import { BsPencilSquare } from "react-icons/bs";

//  yeh hamne bahut generic sa icon banaaya hai 
const IconBtn = ({
    text, 
    onclick,
    children, 
    disabled, 
    outline=false,
    customClasses,
    type,
}) => {
    return (
        <button
            className={`flex items-center ${outline ? "border border-yellow-50 bg-transparent" : "bg-yellow-50" } cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 ${customClasses}`}
            disabled={disabled}
            onClick={onclick}
            type={type}
            
        >
            {
                children ? (
                    <>
                        <span className={`${ "text-black"}`}>
                            {text}
                        </span>
                        {children}
                    </>
                ) : (text)
            }
            <>
            {
                text === "Edit" && <BsPencilSquare />
            }
            </>
        </button>
    )
}

export default IconBtn