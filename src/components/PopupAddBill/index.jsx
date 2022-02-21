import React, { forwardRef, useEffect, useState, useRef } from "react";
import { Popup, Icon, Keyboard, Toast } from "zarm";
import s from "./style.module.less";
import cx from "classnames";
import PopupMonth from "@/components/PopupMonth";
import dayjs from "dayjs";
import { get, typeMap, post } from "@/utils";
import CustomIcon from "../CustomIcon";
import { Input } from "zarm";

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const [show, setShow] = useState(false); //内部控制弹窗显示隐藏
  const [payType, changePayType] = useState("expense"); //收入或支出类型
  const [date, setDate] = useState(new Date()); //日期
  const dateRef = useRef(); //指向日期弹窗
  const [amount, setAmount] = useState(""); //账单输入金额
  const [currentType, setCurrentType] = useState({}); //当前选中账单类型
  const [expense, setExpense] = useState([]); //支出类型数组
  const [income, setIncome] = useState([]); //收入类型数组
  const [remark, setRemark] = useState(""); //备注
  const [showRemark, setShowRemark] = useState(false); //备注输入框展示控制

  const id = detail && detail.id;

  useEffect(async () => {
    const {
      data: { list },
    } = await get("/api/type/list");
    const _expense = list.filter((i) => i.type == 1); //支出类型
    const _income = list.filter((i) => i.type == 2); //收入类型
    setExpense(_expense);
    setIncome(_income);
    if (!id) {
      setCurrentType(_expense[0]); //新建账单,类型默认是支出类型数组的第一项
    }
  }, []);

  useEffect(() => {
    if (id) {
      changePayType(detail.pay_type == 1 ? "expense" : "income");
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name,
      });
      setRemark(detail.remark);
      setAmount(detail.amount);
      setDate(detail.date);
    }
  }, [detail]);

  const selectDate = (val) => {
    setDate(val);
  };

  const addBill = async () => {
    if (!amount) {
      Toast.show("请输入具体金额");
      return;
    }

    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      pay_type: payType == "expense" ? 1 : 2,
      remark: remark || "",
    };

    if (id) {
      params.id = id;
      const result = await post("/api/bill/update", params);
      console.log("aa",params);
      Toast.show("修改成功");
    } else {
      //重制数据
      const result=await post("/api/bill/add",params);
      console.log(params);
      setAmount("");
      changePayType("expense");
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark("");
      Toast.show("添加成功");
    }
    setShow(false);
    if (onReload) onReload();
  };

  const handleMoney = (value) => {
    value = String(value);
    console.log(value);
    //点击删除按钮时
    if (value == "delete") {
      let _amount = amount.slice(0, amount.length - 1);
      setAmount(_amount);
      return;
    } else if (value == "ok") {
      addBill();
      return;
    } else if (value == "." && amount.includes(".")) {
      return;
    } //小数点位数不能超过两位
    else if (
      value != "." &&
      amount.includes(".") &&
      amount &&
      amount.split(".")[1].length >= 2
    )
      return;
    setAmount(amount + value);
  };

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Icon type="wrong" />
          </span>
        </header>
        <div className={s.filter}>
          <div className={s.type}>
            <span
              onClick={() => changePayType("expense")}
              className={cx({
                [s.expense]: true,
                [s.active]: payType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changePayType("income")}
              className={cx({
                [s.income]: true,
                [s.active]: payType == "income",
              })}
            >
              收入
            </span>
          </div>
          <div
            className={s.time}
            onClick={() => dateRef.current && dateRef.current.show()}
          >
            {dayjs(date).format("MM-DD")}{" "}
            <Icon className={s.arrow} type="arrow-bottom" />
          </div>
        </div>
        <div className={s.money}>
          <span className={s.sufix}>￥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.typeBody}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {(payType == "expense" ? expense : income).map((item) => (
              <div
                onClick={() => setCurrentType(item)}
                key={item.id}
                className={s.typeItem}
              >
                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                <span
                  className={cx({
                    [s.iconfontWrap]: true,
                    [s.expense]: payType == "expense",
                    [s.income]: payType == "income",
                    [s.active]: currentType.id == item.id,
                  })}
                >
                  <CustomIcon
                    className={s.iconfont}
                    type={typeMap[item.id].icon}
                  />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.remark}>
          {showRemark ? (
            <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(val) => setRemark(val)}
              onBlur={() => setShowRemark(false)}
            />
          ) : (
            <span onClick={() => setShowRemark(true)}>
              {remark || "添加备注"}
            </span>
          )}
        </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
      </div>
      <PopupMonth ref={dateRef} onSelect={selectDate} />
    </Popup>
  );
});

export default PopupAddBill;
