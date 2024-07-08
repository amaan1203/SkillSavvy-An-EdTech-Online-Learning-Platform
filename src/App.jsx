import "./App.css";
import {Routes , Route } from 'react-router-dom';
import Home from "./pages /Home";
import Signup from "./pages /Signup";
import Navbar from "./components/common/Navbar";
import Login from "../src/pages /Login";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages /ForgotPassword";
import UpdatePassword from "./pages /UpdatePassword";
import VerifyEmail from "./pages /VerifyEmail";
import About from "./pages /About";
import Dashboard from "./pages /Dashboard";
import MyProfile from "./components/Dashboard/MyProfile";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import EnrolledCourses from "./components/Dashboard/EnrolledCourses";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import NotFound from "./components/common/NotFound";
import Cart from "./components/Dashboard/Cart";
import AddCourse from "./components/Dashboard/AddCourse";
import MyCourses from "./components/Dashboard/MyCourses";
import EditCourse from "./components/Dashboard/EditCourse";
import Catalog from "./pages /Catalog";
import CourseDetails from "./pages /CourseDetails";
import ViewCourse from "./pages /ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails"
import Instructor from "./components/Dashboard/InstructorDashboard/Instructor";
import Settings from "./components/Dashboard/Settings/index"
import Contact from "./pages /Contact";


function App() {
  const {user}=useSelector((state)=>state.profile);
      //  bahut dikkt hui thi 2.5 hrs waste kia tha isme galti se state.auth se user ka dara nikaal rha tha 

  console.log(" user ka accountType" , user?.accountType );
  return (
     <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
       <Navbar />
       
       <Routes>
            <Route path="*" element={<NotFound />} > </Route>
           <Route path="/" element={<Home />} />
           <Route path="/signup" element={<Signup />} />
           <Route path="/login" element={<Login />} />
           <Route path="catalog/:catalogName" element={<Catalog />} />
           <Route path="courses/:courseId" element={<CourseDetails />} />
           <Route path="/contact" element={<Contact />} />
        <Route
        path="forgot-password"
        element={
          <OpenRoute>
            <ForgotPassword />
          </OpenRoute>
        }
      />  
        <Route
        path="update-password/:id" 
        //  :id islie likha because hamara token bhi hoga is url me 
        element={
          <OpenRoute>
            <UpdatePassword />
          </OpenRoute>
        }
      /> 
          <Route
        path="verify-email"
        element={
          <OpenRoute>
            <VerifyEmail />
          </OpenRoute>
        }
      /> 
        <Route
        path="about"
        element={
          <OpenRoute>
            <About />
          </OpenRoute>
        }
      /> 

      {/* Private Route - for Only Logged in User */}
      <Route
          element={
            //  yeh private route ka component hamne likha haiii 
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >

         {/* Route for all users */}
         <Route path="dashboard/my-profile" element={<MyProfile />} />
         <Route path="dashboard/Settings" element={<Settings />} />
         
       {/* routes for students */}
            {
              
               user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
               
               <Route path="dashboard/enrolled-courses" element={<EnrolledCourses />} />
               {/*  card naam ka koi component nahi hai but index.js karke ek file hi bana di hai jisme cart ke saare components likhe hai maine  */}
               <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )
        }
         
        
        {/* routes for the instructor */}
        {
              
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
           <>
                
             
              {/*  card naam ka koi component nahi hai but index.js karke ek file hi bana di hai jisme cart ke saare components likhe hai maine  */}
              <Route path="dashboard/add-course" element={<AddCourse />} />
              < Route path="dashboard/my-courses" element={<MyCourses />} />
              < Route path="dashboard/edit-course/:id" element={<EditCourse />} />
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/Settings" element={<Settings />} />
           </>
         )
       }

      </Route>

                 {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

      
  
       </Routes>

       
      </div>
  );
}

export default App;
