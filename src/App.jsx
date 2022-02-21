import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import routes from "@/router";
import { ConfigProvider } from "zarm";
import zhCN from "zarm/lib/config-provider/locale/zh_CN";
import NavBar from "@/components/NavBar";

function App() {
  const location = useLocation(); //拿到location实例   
  const { pathname } = location; //获取当前路径
  const needNav = ["/", "/data", "/user"]; //需要底部导航栏路径
  const [showNav, setShowNav] = useState(false); //是否需要导航
  useEffect(() => {
    setShowNav(needNav.includes(pathname));
  }, [pathname]);
  return (
    <>
      <ConfigProvider primaryColor={"#007fff"} locale={zhCN}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            ></Route>
          ))}
        </Routes>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  );
}

export default App;
