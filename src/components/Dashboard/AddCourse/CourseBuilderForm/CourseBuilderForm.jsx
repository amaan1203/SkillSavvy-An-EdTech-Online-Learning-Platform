import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react';
import { IoAddCircleOutline } from 'react-icons/io5';
import IconBtn from '../../../common/IconBtn';
import { MdNavigateNext } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { setEditCourse, setStep } from '../../../../slices/courseSlice';
import { createSection } from '../../../../services/operations/courseDetailsAPI';
import { updateSection } from '../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';
import toast from 'react-hot-toast';
import { setCourse } from '../../../../slices/courseSlice';





const CourseBuilderForm = () => 
  {

  const {register , handleSubmit ,setValue , formState:{errors} }= useForm();
  const [loading, setLoading] = useState(false)
  const [editSectionName , setEditSectionName]=useState(false);
  const {course}=useSelector(state=>state.course);
  const dispatch=useDispatch();
  const {token}=useSelector(state=>state.auth);

    console.log("printing the course in coursebuilder form to debug length ki dikkt"  , course);
  //  yeh function   ham nested view me send karenge 
  const handleChangeEditSectionName = (sectionId, sectionName) => {

    if(editSectionName === sectionId) {
        cancelEdit()
        return 
    }
    setEditSectionName(sectionId)
    //  taaki edit par click karne se section name UI par aa jaae in section box

    setValue("sectionName", sectionName)
}
   

useEffect(()=>{
  if(course?.status === "Published") 
    {
      setCourse(null);
    } 
} , [])





  // const onSubmit= async (data)=>
  //   {
  //    console.log("data in the create section" , data);
  //    console.log("editSectionName ki value ->" , editSectionName );
  //   setLoading(true);
  //    let result=""
  //   if(editSectionName)
  //     {
  //       //  matlab hame updatesection waali api call karni hai
  //        result = await updateSection( 
  //         {
  //           sectionName : data.sectionName,
  //           //  sectionId bhi use hoti hai jaake edit section waali api me check kar 
  //           //  so we are sending the flag of  edit course 
  //           sectionId:editSectionName,
  //           courseId:course._id
  //         } , token);
         
  //     }
  //     else 
  //     {
  //        result = await createSection(
  //           {
  //               sectionName: data.sectionName,
  //               courseId: course._id,
  //           },
  //           token
  //       )
  //   }
  //   //  update the value
  //   console.log("result " , result);
  //   if(result)
  //      {
  //       console.log("section result", result)
  //       //  section change karne se course ki value bhi change ho gyi hogi to use set karna padega
  //       dispatch(setCourse(result))
  //       console.log("course ", course);
  //       setEditSectionName(null)
  //       setValue("sectionName", "")
  //    }

  //   setLoading(false)

  // }

      //handle form submission
      const onSubmit = async (data) => {
        // console.log(data)
        setLoading(true)

        let result
        if(editSectionName) {
            result = await updateSection(
                {
                    sectionName: data.sectionName,
                    sectionId: editSectionName,
                    courseId: course._id,
                },
                token
            )
            // console.log("edit", result)
        } else {
            result = await createSection(
                {
                    sectionName: data.sectionName,
                    courseId: course._id,
                },
                token
            )
        }
        if(result) {
            // console.log("section result", result)
            dispatch(setCourse(result))
            setEditSectionName(null)
            setValue("sectionName", "")
        }
        setLoading(false)
    }




  const cancelEdit=()=>{ 
    setEditSectionName(false);
    setValue("sectionName", "");

  }

  const goBack=()=>{

    //  ab ham agr waapis step 1 yaani course information form par jaaenge tab hame create course waali api nahi
    //  edit course waali api call karni hia uske lie jo edit course waala flag ko true karna padega
       dispatch(setStep(1));
      //   also course ke slice me dekho editcourse karke ek state hai use bhi true mark karna padega api call karne ke lie
      dispatch(setEditCourse(true));
      
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }
  return (
    <div >
            <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="sectionName">
                    Section Name <sup className="text-pink-200"> * </sup>
                </label>   
                <input
                    id="sectionName"
                    disabled={loading}
                    placeholder="Add a section to build your course"
                    {...register("sectionName", { required: true})}
                    className="form-style w-full"
                    
                />
                {errors.sectionName && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Section Name Is Required
                    </span>
                )}
            </div>
            
            {/*  next a button will be shown jo ki create karega section  */}
            {/*  ab yeh button par agr edit course naam ka flag true hai to is button par edit course show karna instead of create section  */}

            <div className="flex items-end  gap-x-4">
                <IconBtn 
                    type="submit"
                    disabled={loading}
                    onSubmit={handleSubmit(onSubmit)}
                    text={editSectionName ? "Edit Section Name" : "Create Section"}
                    outline={true}
                    className="cursor-pointer   "
                >
                 <IoAddCircleOutline size={20} className="text-yellow-50" />
                </IconBtn>
                {editSectionName && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-sm text-richblack-300 underline"
                    >
                        Cancel Edit
                    </button>
                )}
              </div>
            </form>

            {/*  ab hame jab bhi create section par click hoga tab hame coursecreate karne ka nested view dikhaana hia uske lie yeh component banaaenge */}
            
            {  course.courseContent.length > 0  && (
                 <NestedView handlechangeEditSectionName={handleChangeEditSectionName} />
            )}

          {/* Next Prev Button */}
          <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>

    </div>
  )
}

export default CourseBuilderForm
