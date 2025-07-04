import { createContext, useContext } from "react";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    return <UserContext.Provider value = {{user: "abc"}}> {children} </UserContext.Provider>
}

export const UserData= () => useContext(UserContext);

