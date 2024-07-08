import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { fetchCourseCategories } from '../../../../services/operations/courseDetailsAPI'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import ChipInput from './ChipInput'
import Upload from '../Upload'
import RequirementsField from './RequirementsField'
import IconBtn from '../../../common/IconBtn'
import { MdNavigateNext } from 'react-icons/md'
import { COURSE_STATUS } from '../../../../utils/constants'
import toast from 'react-hot-toast'
import { addCourseDetails } from '../../../../services/operations/courseDetailsAPI'
import { editCourseDetails } from '../../../../services/operations/courseDetailsAPI'
import { setStep } from '../../../../slices/courseSlice'
import { setCourse } from '../../../../slices/courseSlice'

//  form create karne ke lie we will use useForm ka hook 
const CourseInformationForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm()
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth)
    //   editCourse ek flag hai jo yeh bata rha hai ki ham course ko edit kar paaenge ya nahi
    const { course, editCourse  } = useSelector((state) => state.course)
    const [loading, setLoading] = useState(false)
    const [courseCategories, setCourseCategories] = useState([])
    
     

    const isFormUpdated = () => {
        const currentValues = getValues()
        // console.log("changes after editing form values:", currentValues)
        if(
            currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentValues.courseTags.toString() !== course.tag.toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !== course.instructions.toString() ||
            currentValues.courseImage !== course.thumbnail
        ) {
            return true
        }
        return false
    }

    //  pehle hame course categories ko fetch karna hia
    useEffect(() => {
        const getCategories = async () => {
            setLoading(true)
            const categories = await fetchCourseCategories()
            if(categories.length > 0) {
                // console.log("categories", categories)
                setCourseCategories(categories)
            }
            setLoading(false)
        }

        getCategories()

        // if form is in edit mode
        if(editCourse) {
            // console.log("data populated", editCourse)
            setValue("courseTitle", course.courseName)
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }
        
    }, [])

    //  handle next button click
    const onSubmit = async (data) => {
        // console.log(data)

        if(editCourse) {
            // const currentValues = getValues()
            // console.log("changes afer editing form values:", currentValues)
            // console.log("now course:", course)
            // console.log("Has Form Changed:", isFormUpdated())
            if(isFormUpdated()) {
                const currentValues = getValues()
                const formData = new FormData()
                // console.log(data)
                formData.append("courseId", course._id)
                if(currentValues.courseTitle !== course.courseName) {
                    formData.append("courseName", data.courseTitle)
                }
                if(currentValues.courseShortDesc !== course.courseDescription) {
                    formData.append("courseDescription", data.courseShortDescription)
                }
                if(currentValues.coursePrice !== course.price) {
                    formData.append("price", data.coursePrice)
                }
                if(currentValues.courseTag.toString() !== course.tag.toString()) {
                    formData.append("tag", JSON.stringify(data.courseTags))
                }
                if(currentValues.courseCategory._id !== course.category._id) {
                    formData.append("category", data.courseCategory)
                }
                if(currentValues.courseRequirements.toString() !== course.instructions.toString()) {
                    formData.append("instructions", JSON.stringify(data.courseRequirements))
                }
                if(currentValues.courseImage !== course.thumbnail) {
                    formData.append("thumbnailImage", data.courseImage)
                }
                // console.log("Edit Form data: ", formData)
                setLoading(false)
                const result = await editCourseDetails(formData, token)
                if(result) {
                    dispatch(setStep(2))
                    dispatch(setCourse(result))
                }
            } else {
                toast.error("No change made to the form")
            }
            return 
        }

        const formData = new FormData()
        formData.append("courseName", data.courseTitle)
        formData.append("courseDescription", data.courseShortDesc)
        formData.append("price", data.coursePrice)
        formData.append("tag", JSON.stringify(data.courseTags))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)
        setLoading(true)
        // console.log(" form data being created " , formData);
        const result = await addCourseDetails(formData, token)
        if(result) {
            dispatch(setStep(2))
            dispatch(setCourse(result))
        }
        setLoading(false)
    }




  return (
   <form onSubmit={handleSubmit(onSubmit)} 
   className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
    

            {/* Course Title */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseTitle">
                    Course Title <sup className="text-pink-200"> * </sup>
                </label>
                <input
                    id="courseTitle"
                    placeholder="Enter Course Title"
                    {...register("courseTitle", { required: true })}
                    className="form-style w-full"
                />
                 {/*  error handling yeh useform me by default hota hia!! */}
                {errors.courseTitle && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Title Is Required
                    </span>
                )}
            </div>

                        {/* Course Short Description */}
                <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
                    Course Short Description <sup className="text-pink-200"> * </sup>
                </label>
                <textarea 
                    id="courseShortDesc"
                    placeholder="Enter Description"
                    {...register("courseShortDesc", { required: true })}
                    className="form-style resize-x-none min-h-[130px] w-full"
                />
                {errors.courseShortDesc && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Description Is Required
                    </span>
                )}
                    </div>

            {/* Course Price */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="coursePrice">
                    Course Price <sup className="text-pink-200"> * </sup>
                </label>
                <div className="relative">
                    <input
                        id="coursePrice"
                        placeholder="Enter Course Price"
                        {...register("coursePrice", {
                            required: true,
                            valueAsNumber: true,
                  
                        })}
                        className="form-style w-full !pl-12"
                    />
                    <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
                </div>
                {errors.coursePrice && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Price Is Required
                    </span>
                )}
            </div>
            {/* Course Category */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseCategory">
                    Course Category <sup className="text-pink-200"> * </sup>
                </label>
                <select
                    {...register("courseCategory", { required: true })}
                    defaultValue=""
                    id="courseCategory"
                    className="form-style w-full"
                >
                    <option value="" disabled>
                        Choose A Category
                    </option>
                    {!loading && 
                        courseCategories?.map((category, index) => (
                            <option key={index} value={category?._id} >
                                {category?.name}
                            </option>
                        ))}
                </select>
                {errors.courseCategory && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Course Category Is Required
                    </span>
                )}
            </div>



            {/*  ab tags banane ke lie ek custom component banaana padega*/}
            {/*  bahut bahut bahut alag and important hai yeh  */}
                        {/* Course Tags */}
                <ChipInput 
                label="Tags"
                name="courseTags"
                placeholder="Enter Tags And Press Enter"
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
            />


            {/*  image upload karne ka component in the formmmmmm */}
            {/* Course Thumbnail Image */}
            <Upload 
                name="courseImage"
                label="Course Thumbnail"
                register={register}
                setValue={setValue}
                errors={errors}
                editData={editCourse ? course?.thumbnail : null}
            />

                {/* Benefits of the course */}
                <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
                    Benefits Of The Course <sup className="text-pink-200"> * </sup>
                </label>
                <textarea 
                    id="courseBenefits" 
                    placeholder="Enter Benefits Of The Course"
                    {...register("courseBenefits", { required: true })}
                    className="form-style resize-x-none min-h-[130px] w-full"
                />
                {errors.courseBenefits && (
                    <span className="ml-2 text-xs tracking-wide text-pink-200">
                        Benefits Of The Course IS Required 
                    </span>
                )}
            </div>
               


            {/* Requirements/Instructions */}
            {/*  ab yeh field bhi kaafi differnet hai like the field of tags i.e. chipinput */}
            <RequirementsField 
                name="courseRequirements"
                label="Requirements/Instructions"
                register={register}
                setValue={setValue}
                errors={errors}
                getValues={getValues}
            />
                        {/* Next Button */}
                <div className="flex justify-end gap-x-2">
                {editCourse && (
                    <button
                        onClick={() => dispatch(setStep(2))}
                        disabled={loading}
                        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Continue Without Saving
                    </button>
                )}

                <IconBtn 
                    disabled={loading}
                    text={!editCourse ? "Next": "Save Changes"}
                >
                  Next <MdNavigateNext />
                </IconBtn>
            </div>
   </form>
  )
}

export default CourseInformationForm
