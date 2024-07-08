import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import CountryCode from "../../data/countrycode.json"
import { apiConnector } from "../../services/apiconnector"
import { contactusEndpoint } from "../../services/apis"

//  hamne useForm hook use kia hai to create a form 
//  isme useform hook hi apne aap saara state management handle kar leta hai 
//  ab hame kuch methods use karne hai useform se jo ki line-14 par mentioned hai
//  register->
// handleSubmit-> kis function ko calll karna hai jab form submit hoga
// reset-> reset yaani saari forms ki field ko empty kar dena 
//  register-> koi bhi nayi field ki state ko create karna aur use maintain karna

const ContactUsForm = () => {
    const [loading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitSuccessful },
    } = useForm()

    const submitContactForm = async (data) => {
        console.log("Form Data - ", data)
        try {
            setLoading(true)
            const res = await apiConnector(
                "POST",
                contactusEndpoint.CONTACT_US_API,
                data,
            )
            console.log("Email Res - ", res)
            setLoading(false)
            
        }catch(error) {
            console.log("ERROR MESSAGE - ", error.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        if(isSubmitSuccessful) {
            reset({
                email: "",
                firstname: "",
                lastname: "",
                message: "",
                phoneNo: "",
            })
        }
        //  ab yaha reset function bhi aana chahie aur yeh ham miss kar denge 
        //  very very imp. 
        //  reset function ki definition change hone par bhi hame form ka data reset karna hai
        //  yeh reset function hame useform hook se hi mila hai
    }, [reset, isSubmitSuccessful])
    
  return (
    <form
        className="flex flex-col gap-7"
        onSubmit={handleSubmit(submitContactForm)}
    >
        <div className="flex flex-col gap-5 lg:flex-row">
            {/* firstName */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="firstname" className="lable-style">
                    First Name
                </label>
                <input 
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="Enter First Name"
                    className="form-style"
                    //  ab  yeh main cheez hai 
                    //  hamne firstname ke name ki state ko register karwa dia hai yaani create kar lia hai
                    //  aur {iske andar condition likh di }
                    {...register("firstname", { required: true })}
                /> 
                {/* ab dekho yeh apne aap error handling bhi kar leta hai , so agr firstname naam ki state me agr koi error aae to yeh messaage show kar lenan */}
                {errors.firstname && (
                    <span className="-mt-1 text-[12px] text-yellow-100">
                        Please Enter Your Name
                    </span>
                )}
            </div>

            {/* lastName */}
            <div className="flex flex-col gap-2 lg:w-[48%]">
                <label htmlFor="lastname" className="lable-style">
                    Last Name
                </label>
                <input 
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Enter Last Name"
                    className="form-style"
                    {...register("lastname")}
                />
            </div>
        </div>
        
        {/* email */}
        <div className="flex flex-col gap-2">
            <label htmlFor="email" className="lable-style">
                Email Address
            </label>
            <input 
                type="email"
                name="email"
                id="email"
                placeholder="Enter Email Address"
                className="form-style"
                {...register("email", { required: true })}
            />
            {errors.email && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                    Please Enter Your Email Address
                </span>
            )}
        </div>
        
        {/* phoneNo */}
        <div className="flex flex-col gap-2">
            <label htmlFor="phonenumber" className="lable-style">
                Phone Number
            </label>
                   {/*  ab dropdown ka code jo ki country ke  number codes show ho rhe hai  */}
                   {/*  ab jaake data folder me dekho countrycode kakre ek array hai jisme saare country codes stored hai */}
            <div className="flex gap-5">
                <div className="flex w-[81px] flex-col gap-2">
                    <select
                        type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="Enter First Name"
                        className="form-style"
                        {...register("countrycode", { required: true })}
                    >
                        {CountryCode.map((ele, i) => {
                            return (
                                <option key={i} value={ele.code}>
                                    {/*  country code  fir dash fir country ka naam show karna hai */}
                                    {ele.code} -{ele.country}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div className="flex w-[calc(100%-90px)] flex-col gap-2">
                    <input 
                        type="number"
                        name="phonenumber"
                        id="phonenumber"
                        placeholder="12345 67890"
                        className="form-style"
                        {...register("phoneNo", {
                            required: {
                                value: true,
                                message: "Please Enter Your Phone Number.",
                            },
                            //  message matlab ki agr condition true nahi hao to kya message show karna hai
                            maxLength: { value: 12, message: "Invalid Phone Number"},
                            minLength: { value: 10, message: "Invalid Phone Number"},
                        })}
                    />
                </div>
            </div>
            {errors.phoneNo && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                    {errors.phoneNo.message}
                </span>
            )}
        </div>

        {/* message */}
        <div className="flex flex-col gap-2" >
            <label htmlFor="message" className="lable-style">
                Message
            </label>
            <textarea 
                name="message"
                id="message"
                cols="30"
                rows="9"
                placeholder="Enter Your Message Here"
                className="form-style"
                {...register("message", { required: true })}
            />
            {errors.message && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                    Please Enter Your Message.
                </span>
            )}
        </div>

        <button 
            disabled={loading}
            type="submit"
            className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]
                ${
                    !loading && 
                    "transition-all duration-200 hover:scale-95 hover:shadow-none"
                } disabled:bg-richblack-500 sm:text-[16px] `}
        >
            Send Message
        </button>
    </form>
  )
}

export default ContactUsForm