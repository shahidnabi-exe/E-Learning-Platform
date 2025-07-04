import { createContext, useContext, useState } from "react";
import axios from 'axios'
import { server } from "../main";
const UserContext = createContext();
import toast, {Toaster} from 'react-hot-toast';

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const[btnLoading, setBtnLoading] = useState(false);


    async function loginUser(email, password, navigate) {
        setBtnLoading(true);
        try{
            const {data} = await axios(`${server}/api/user/login`, {email, password});

            toast.success(data.message);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate('/')
        } catch(error) {
            console.log(error);
            setBtnLoading(false)
            setIsAuth(false)
            toast.error(error.response.data.message);
        }
        
    }
    return <UserContext.Provider value = {{ user, setUser, setIsAuth, isAuth, loginUser, btnLoading, }}>
            {children} 
            <Toaster/>
        </UserContext.Provider>
}

export const UserData= () => useContext(UserContext);

