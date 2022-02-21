import React, { useCallback, useState } from "react";
import s from "./style.module.less";
import CustomIcon from "@/components/CustomIcon";
import { Cell, Input, Button, Checkbox, Toast } from "zarm";
import Captcha from "react-captcha-code";
import { post } from "@/utils";
import cx from "classnames";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState(""); //账号
  const [password, setPassword] = useState(""); //密码
  const [vetify, setVetify] = useState(""); //验证码
  const [captcha, setCaptcha] = useState(""); //验证码变化后存储值
  const [type, setType] = useState("login"); //判断是登陆还是注册

  const navigate=useNavigate()

  const captchaChangeHandler = useCallback((captcha) => {
    setCaptcha(captcha);
  }, []);

  const onSubmit = async () => {
    if (!username) {
      Toast.show("请输入账号");
      return;
    }

    if (!password) {
      Toast.show("请输入密码");
      return;
    }

    try {
      if (type === "register") {
        if (!vetify) {
          Toast.show("请输入验证码");
          return;
        }

        if (vetify != captcha) {
          Toast.show("验证码错误");
          return;
        }
        const { data } = await post("/api/user/register", {
          username,
          password,
        });
        Toast.show("注册成功");
        setType('login');
      }else{
          const {data}=await post("/api/user/login",{
              username,
              password
          })
          localStorage.setItem('token',data.token);
          Toast.show('登录成功');
          navigate('/');
      }
    } catch (error) {
      Toast.show("系统错误");
    }
  };
  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span
          className={cx({ [s.active]: type == "login" })}
          onClick={() => setType("login")}
        >
          登录
        </span>
        <span
          className={cx({ [s.active]: type == "register" })}
          onClick={() => setType("register")}
        >
          注册
        </span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value) => setPassword(value)}
          />
        </Cell>
        {type === "register" ? (
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(value) => setVetify(value)}
            />
            <Captcha charNum={4} onChange={captchaChangeHandler} />
          </Cell>
        ) : null}
      </div>
      <div className={s.operation}>
        <div className={s.agree}>
          <Checkbox />
          <label>
            阅读并同意<a>《用户使用条款》</a>
          </label>
        </div>
        <Button onClick={onSubmit} block theme="primary">
          {type == "login" ? "登录" : "注册"}
        </Button>
      </div>
    </div>
  );
};

export default Login;
