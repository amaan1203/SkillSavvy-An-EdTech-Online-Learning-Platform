import React from 'react'
//  sidebar me jo links show karna hai usko import kara lia 
import { sidebarLinks } from '../../data/dashboard-links'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../common/ConfirmationModal'
import { useState } from 'react'
import { logout } from '../../services/operations/authAPI'

import { VscSignOut } from "react-icons/vsc";
//  sidebar me logout ko bhi show karna hai to use import karwa lia 



const Sidebar = () => {
     {/*  see the file of dashboard links from the data  */}
    //   wo array hai sidebarlinks naam se hai 
    const dispatch= useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);
     const {user ,  loading : profileLoading} = useSelector((state)=>state.profile); 
    //   user kyu nikaala hai profileslice me se??
    //  because ham user ke account type ko compare karaaenge aur instructor ko aur students ko alag alag sidebars dikhaaenge  
     const { loading : authLoading}= useSelector((state)=>state.auth);

     if(profileLoading || authLoading) {
        return (
            <div className="mt-10 spinner">
                   Loading...
            </div>
        )
    }



  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
        
        <div className="flex flex-col">
            {
                sidebarLinks.map((link) => {
                    //  agr link me jo type of student hai usko compare karaao user ke accountype se 
                    if(link.type && user?.accountType !== link.type) return null;
                    return (
                        <SidebarLink key={link.id} link={link} iconName={link.icon} />
                    )
                })
            }
             {/*  sidebar me ek horizontal line ka code  */}
              <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>

              <div className="flex flex-col">
            <SidebarLink 
                link={{name: "Settings", path: "dashboard/settings"}}
                iconName="VscSettingsGear"
            />
            
            {/*  signout waala section in the sidebar ! */}
            <button
                onClick={ () => setConfirmationModal({
                    text1: "Are You Sure ?",
                    text2: "You will be logged out of your account",
                    btn1Text: "Logout",
                    btn2Text: "Cancel",
                    btn1Handler: () => dispatch(logout(navigate)),
                    btn2Handler: () => setConfirmationModal(null),
                })}
                className="px-8 py-2 text-sm font-medium text-richblack-300"
            >
                <div className="flex items-center gap-x-2">
                    <VscSignOut className="text-lg" />
                    <span>Logout</span>
                </div>
            </button>
        </div>
        </div>
         
        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default Sidebar
