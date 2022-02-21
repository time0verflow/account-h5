import React, { useEffect, useState } from "react";
import { FilePicker, Button, Toast, Input } from "zarm";
import s from "./style.module.less";
import axios from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import { get, post } from "@/utils";
import { baseURL } from "../../config";
import { imgUrlTrans } from "../../utils";

const UserInfo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState(""); //头像
  const [signature, setSignature] = useState(""); //个签

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const { data } = await get("/api/user/get_userinfo");
    setUser(data);
    setAvatar(imgUrlTrans(data.avatar));
    setSignature(data.signature);
  };

  const handleSelect = (file) => {
    console.log(file.file);
    if (file && file.file.size > 200 * 1024) {
      Toast.show("上传头像不得超过200kb");
      return;
    }
    let formData = new FormData();
    formData.append("file", file.file);
    axios({
      method: "post",
      url: "/api/upload",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      //返回图片地址
      setAvatar(imgUrlTrans(res.data));
    });
  };

  const save = async () => {
    const { data } = await post("/api/user/edit_userinfo", {
      signature,
      avatar,
    });

    Toast.show("修改成功");
    navigate(-1);
  };

  return (
    <div className={s.userinfo}>
      <h1>个人资料</h1>
      <div className={s.item}>
        <div className={s.title}>头像</div>
        <div className={s.avatar}>
          <img className={s.avatarUrl} src={avatar} alt="" />
          <div className={s.desc}>
            <span>支持jpg、png、jpeg格式大小200kb以内的图片</span>
            <FilePicker onChange={handleSelect} accept="image/*">
              <Button theme="primary" size="xs">
                点击上传
              </Button>
            </FilePicker>
          </div>
        </div>
      </div>
      <div className={s.item}>
        <div className={s.title}>个性签名</div>
        <div className={s.signature}>
          <Input
            clearable
            type="text"
            value={signature}
            placeholder="请输入个性签名"
            onChange={(value) => setSignature(value)}
          />
        </div>
      </div>
      <Button block theme="primary" style={{ marginTop: 50 }} onClick={save}>
        保存
      </Button>
    </div>
  );
};

export default UserInfo;
