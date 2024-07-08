import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';

const Dashboard = () => {
    //  ab ham do loading ke states ko lekar aaenge from auth and profile 
    //  aur agr dono me se koi bhi agr true hai to spinner hi dikha denge 

    const {loading: authLoading} = useSelector( (state) => state.auth );

    const {loading: profileLoading} = useSelector( (state) => state.profile );

    if(profileLoading || authLoading) {
        return (
            <div className="mt-10 spinner">
                   Loading...
            </div>
        )
    }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
       <Sidebar />
    <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10 ">
        {/*  outlet yaani ki hame nahi pata ki konsa pade show karna hai wo depend karega ki sidebar se konsa option selected hai */}
           {/*  outlet bhi hamko react router dom se hi milta haiiii!! */}
            <Outlet />
        </div>
    </div>

</div>
  )
}

export default Dashboard
