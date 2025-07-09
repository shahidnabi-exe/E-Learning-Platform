import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";

const CourseContext = createContext()

export const CourseContextProvider = ( { children }) => {
    const [courses, setCourses] = useState([])
    const [myCourse, setMyCourse] = useState([])
    async function fetchCourses() {
        try{
            const { data } = await axios.get(`${server}/api/course/all`)

            setCourses(data.courses)

        }catch(error) {
            console.log(error);
        }
    }

    async function fetchCourse(id) {
        try{
            const { data } = await axios.get(`${server}/api/course/${id}`)
            setCourses(data.courses)

        } catch(error) {
            console.log(error);
        }
    }

    async function fetchMyCourse() { 
        try{
            const { data } = await axios.get(`${server}/api/mycourse`, {
                header: {
                    token: localStorage.getItem('token'),
                }
            })
            setMyCourse(data.myCourse)
        }catch(error) {
            console.log(error);
        }
    }

    useEffect( () => {
        fetchCourses()
        fetchMyCourse()
    }, [])
    
    return <CourseContext.Provider value={{courses, fetchCourses, fetchCourse, myCourse, fetchMyCourse}} > {children} </CourseContext.Provider>
}

export const CourseData = () => useContext(CourseContext);