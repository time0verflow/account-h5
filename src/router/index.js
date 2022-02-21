import Data from "@/container/Data";
import Home from "@/container/Home";
import User from "@/container/User";
import Detail from "@/container/Detail";
import Login from "@/container/Login";
import UserInfo from "@/container/UserInfo";
import About from "@/container/About";
import Account from "@/container/Account";

const routes=[
    {
        path:"/",
        component:Home
    },
    {
        path:"/data",
        component:Data
    },
    {
        path:"/user",
        component:User
    },
    {
        path:"/detail",
        component:Detail
    },
    {
        path:"/login",
        component:Login
    },
    {
        path:"/userInfo",
        component:UserInfo
    },
    {
        path:"/account",
        component:Account
    },
    {
        path:"/about",
        component:About
    }
]

export default routes;