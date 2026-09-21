import axios from "axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { server } from "../config/server.js";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [myCourse, setMyCourse] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/course/all`);
      setCourses(Array.isArray(data.courses) ? data.courses : []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourse = useCallback(async (id) => {
    try {
      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course);
      return data.course;
    } catch (error) {
      console.error("Error fetching course:", error);
      return null;
    }
  }, []);

  const fetchMyCourse = useCallback(async () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) {
      setMyCourse([]);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/mycourse`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setMyCourse(Array.isArray(data.courses) ? data.courses : []);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      setMyCourse([]);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
  }, [fetchCourses, fetchMyCourse]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        course,
        setCourse,
        fetchCourses,
        fetchCourse,
        myCourse,
        fetchMyCourse,
        loading,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);