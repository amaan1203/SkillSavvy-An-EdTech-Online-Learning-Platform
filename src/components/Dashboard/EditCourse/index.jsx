import React from 'react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getFullDetailsOfCourse } from '../../../services/operations/courseDetailsAPI'
import { setEditCourse } from '../../../slices/courseSlice'
import RenderSteps from "../AddCourse/RenderSteps"
import { setCourse } from '../../../slices/courseSlice'

//  yeh edit courses hame tab dikhgea jab ham instructor dashboard me edit course par click karenge
export default function EditCourse(){
    const dispatch = useDispatch()
    //  note bhaiiiiiii hamne course id kaha se lii hai??
    //  course id hamne url me pass kari hai as a parameter see Course table  me hamne course id pass ki haiii
    const { courseId } = useParams()
//     use params url me se course id nikaalne ke lie use kia haiiiiii

 
const { course } = useSelector((state) => state.course)
const [loading, setLoading] = useState(false)
const { token } = useSelector((state) => state.auth)
 
useEffect(() => {
    (async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token)
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    })()

  }, [])

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }



  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <RenderSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  )
}


