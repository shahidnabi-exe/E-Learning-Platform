import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import { server } from "../main";
const UserContext = createContext();
import toast, {Toaster} from 'react-hot-toast';

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const[btnLoading, setBtnLoading] = useState(false);
    const[loading, setLoading] = useState(true);

    async function loginUser(email, password, navigate) {
        setBtnLoading(true);
        try{
            const { data } = await axios.post(`${server}/api/user/login`, {
                email, 
                password,
            });
 
            toast.success(data.message);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate('/')
        } catch(error) {    
            setBtnLoading(false);
            setIsAuth(false);

            const message =
                error.response?.data?.message || "Something went wrong. Please try again.";

            console.error("Login error:", error.response || error);
            toast.error(message);
            }

        }
    
    async function registerUser(name, email, password, navigate) {
        setBtnLoading(true);
        try{
            const { data } = await axios.post(`${server}/api/user/register`, {
                name,
                email, 
                password,
            });
 
            toast.success(data.message);
            // localStorage.setItem('token', data.token);
            setBtnLoading(false);
            navigate('/login')
        } catch(error) {
            setBtnLoading(false);            
            const message =
                error.response?.data?.message || "Something went wrong. Please try again.";

            console.error("Login error:", error.response || error);
            toast.error(message);
            }
        }
    
   async function fetchUser() {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${server}/api/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setIsAuth(true);
        setUser(data.user);
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
}


    useEffect(() => {
        fetchUser()
    }, [])
        
    return <UserContext.Provider 
        value = {{ user, setUser, setIsAuth, isAuth, loginUser, btnLoading, loading, registerUser,
        }}>
            {children}  
            <Toaster/>
    </UserContext.Provider>
}

export const UserData= () => useContext(UserContext);

