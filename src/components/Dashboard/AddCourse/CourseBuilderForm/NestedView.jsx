import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { RiDeleteBin6Fill } from 'react-icons/ri'
import { RxDropdownMenu } from 'react-icons/rx'
import { MdEdit } from 'react-icons/md'
import {RiDeleteBin6Line}  from 'react-icons/ri'
import ConfirmationModal from '../../../common/ConfirmationModal'
import { FaPlus } from 'react-icons/fa'
import SubSectionModal from './SubSectionModal'
import { deleteSection } from '../../../../services/operations/courseDetailsAPI'
import { deleteSubSection } from '../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../slices/courseSlice'

const NestedView = ({handlechangeEditSectionName}) => {


    const { course } = useSelector((state) => state.course)
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    //  ab hame teen flags ka use padgega ki konsa UI show karna hai
    //   view subsection, add subsection , edit subsection
    // States to keep track of mode of modal [add, view, edit]
        const [addSubSection, setAddSubSection] = useState(null)
        const [viewSubSection, setViewSubSection] = useState(null)
        const [editSubSection, setEditSubSection] = useState(null) 
           // to keep track of confirmation modal
       const [confirmationModal, setConfirmationModal] = useState(null)

    const handleDeleteSection = async (sectionId) => {

        const result = await deleteSection({
            sectionId,
            courseId: course._id,
         }, token)
            
         console.log(" les gooo and result " , result);
        if(result)
        {
            dispatch(setCourse(result));
            
        }
        setConfirmationModal(null) 


    }

    const handleDeleteSubSection = async (subSectionId, sectionId) =>  {
        const result =  await deleteSubSection({ subSectionId, sectionId} , token)
        if(result) {
            const updatedCourseContent=course.courseContent.map((section)=>
            
                section._id===sectionId ? result : section
            )
            const updatedCourse= {...course , courseContent: updatedCourseContent};
            dispatch(setCourse(updatedCourse))
        }

        setConfirmationModal(null)
    }


  

    return (
    <div className=' rounded-md bg-richblack-700 gap-2 '>
        
       <div >
        {
            course?.courseContent?.filter((section)=> section._id !== null).map((section) => (
                <details key={section._id} open>

                <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                <div className="flex items-center gap-x-3">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                        {section.sectionName} 
                    </p>
                </div> 
                <div className="flex items-center gap-x-3">
                    <button
                        onClick={() => {
                            handlechangeEditSectionName(
                                section._id,
                                section.sectionName
                            )
                        }}
                    >
                        <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                        onClick={() => {
                            setConfirmationModal({

                                text1: "Delete this Section", 
                                text2: "All the lectures in this section will be deleted",
                                btn1Text: "Delete",
                                btn2Text: "Cancel",
                                btn1Handler: () => handleDeleteSection(section._id),
                                btn2Handler: () => setConfirmationModal(null),
                            })
                        }}
                    >
                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                    <span>
                        <AiFillCaretDown className={`text-xl text-richblack-300`} />
                    </span>
                </div>
            </summary>
            <div className="px-6 pb-4">
                        {/* Render All Sub Sections Within a Section */}
                        {section?.subSection?.map((data) => (
                            <div
                                key={data?._id}
                                onClick={() => setViewSubSection(data)}
                                className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                            >
                                <div className="flex items-center gap-x-3 py-2">
                                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                                    <p className="font-semibold text-richblack-50">
                                        {data.title}
                                    </p> 
                                </div>
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-x-3"
                                >
                                    <button
                                        onClick={() =>  
                                            setEditSubSection({ ...data, sectionId: section._id })
                                        }
                                    >
                                        <MdEdit className="text-xl text-richblack-300" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setConfirmationModal({
                                                text1: "Delete this Sub-Section?",
                                                text2: "This Lecture will be deleted",
                                                btn1Text: "Delete",
                                                btn2Text: "Cancel",
                                                btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                                btn2Handler: () => setConfirmationModal(null),
                                            })
                                        }}
                                    >
                                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* Add New Lectures to Section */}
                        <button
                            onClick={() => setAddSubSection(section._id)}
                            className="mt-3 flex items-center gap-x-1 text-yellow-50"
                        >
                            <FaPlus className="text-lg" />
                            <p>Add Lecture</p>
                        </button>
                    </div>
            
            </details>
              ))
        }
       </div>
       
               {/* Modal Display */}
               {addSubSection ? (
            <SubSectionModal 
                modalData={addSubSection}
                setModalData={setAddSubSection}
                //  yeh flag bhi pass karna padega
                add={true}
            />
        ) : viewSubSection ? (
            <SubSectionModal 
                modalData = {viewSubSection}
                setModalData = {setViewSubSection}
                view = {true}
            />
        ) : editSubSection ? (
            <SubSectionModal
                modalData = {editSubSection}
                setModalData = {setEditSubSection}
                edit={true}
            />
        ) : (
            <></>
        )}
                {/* Confirmation Modal */}
                {confirmationModal ? (
               <ConfirmationModal  modalData={confirmationModal} />
        ) : (
            <></>
        )}
    </div>
  )
}

export default NestedView
