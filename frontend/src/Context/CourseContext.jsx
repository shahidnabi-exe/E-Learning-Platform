import { createContext, useContext } from "react";

const CourseContext = createContext()

export const CourseContextProvider = ( { children }) => {
    return <CourseContext.Provider value={{}} > {children} </CourseContext.Provider>
}

export const CourseData = () => useContext(CourseContext);