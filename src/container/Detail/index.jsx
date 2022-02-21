import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import qs from "query-string";
import { get, typeMap, post } from "@/utils";
import s from "./style.module.less";
import { useLocation, useNavigate } from "react-router-dom";
import cx from "classnames";
import CustomIcon from "@/components/CustomIcon";
import PopupAddBill from "@/components/PopupAddBill";
import dayjs from "dayjs";
import { Modal, Toast } from "zarm";

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editRef = useRef();
  const { id } = qs.parse(location.search);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`);
    data.date=dayjs(data.date);
    setDetail(data);
  };

  const deleteDetail = () => {
    Modal.confirm({
      title: "删除",
      content: "确定删除账单",
      onOk: async () => {
        const data = await post("/api/bill/delete", { id });
        Toast.show("删除成功");
        navigate(-1);
      },
    });
  };

  return (
    <div>
      <Header title="账单详情" />
      <div className={s.card}>
        <div className={s.type}>
          <span
            className={cx({
              [s.expense]: detail.pay_type == 1,
              [s.income]: detail.pay_type == 2,
            })}
          >
            <CustomIcon
              className={s.iconfont}
              type={detail.type_id ? typeMap[detail.type_id].icon : 1}
            />
          </span>
          <span>{detail.type_name || ""}</span>
        </div>
        {detail.pay_type == 1 ? (
          <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
        ) : (
          <div className={cx(s.amount, s.income)}>+{detail.amount}</div>
        )}
        <div className={s.info}>
          <div className={s.time}>
            <span>记录时间</span>
            <span>{dayjs(detail.date).format("YYYY-MM-DD HH:MM")}</span>
          </div>
          <div className={s.remark}>
            <span>备注</span>
            <span>{detail.remark || "-"}</span>
          </div>
        </div>
        <div className={s.operation}>
          <span onClick={deleteDetail}>
            <CustomIcon type="shanchu" />
            删除
          </span>
          <span onClick={() => editRef.current && editRef.current.show()}>
            <CustomIcon type="tianjia" />
            编辑
          </span>
        </div>
      </div>
      <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
  );
};

export default Detail;
