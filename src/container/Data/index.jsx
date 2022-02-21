import { Icon, Progress } from "zarm";
import React, { useEffect, useRef, useState } from "react";
import s from "./style.module.less";
import dayjs from "dayjs";
import PopupMonth from "@/components/PopupMonth";
import { get, typeMap } from "@/utils";
import cx from "classnames";
import CustomIcon from "../../components/CustomIcon";

function Data() {
  const monthRef = useRef();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [totalType, setTotalType] = useState("expense"); //收入或支出类型
  const [totalExpense, setTotalExpense] = useState(0); //总收入
  const [totalIncome, setTotalIncome] = useState(0); //总支出
  const [expenseData, setExpenseData] = useState([]); //支出数据
  const [incomeData, setIncomeData] = useState([]); //收入数据

  useEffect(() => {
    getData();
  }, [currentMonth]);

  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  };

  const selectMonth = (item) => {
    setCurrentMonth(item);
  };

  const getData = async () => {
    const { data } = await get(`/api/bill/data?date=${currentMonth}`);
    setTotalExpense(data.totalExpense);
    setTotalIncome(data.totalIncome);

    const expense_data = data.totalData
      .filter((item) => item.pay_type == 1)
      .sort((a, b) => b.number - a.number);
    const income_data = data.totalData
      .filter((item) => item.pay_type == 2)
      .sort((a, b) => b.number - a.number);
    setExpenseData(expense_data);
    setIncomeData(income_data);
  };

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon type="date" className={s.date} />
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>{totalExpense}</div>
        <div className={s.income}>共收入{totalIncome}</div>
      </div>
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span
              onClick={() => setTotalType("expense")}
              className={cx({
                [s.expense]: true,
                [s.active]: totalType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => setTotalType("income")}
              className={cx({
                [s.income]: true,
                [s.active]: totalType == "income",
              })}
            >
              收入
            </span>
          </div>
        </div>
        <div className={s.content}>
          {(totalType == "expense" ? expenseData : incomeData).map((item) => (
            <div className={s.item} key={item.type_id}>
              <div className={s.left}>
                <div className={s.type}>
                  <span
                    className={cx({
                      [s.expense]: totalType == "expense",
                      [s.income]: totalType == "income",
                    })}
                  >
                    <CustomIcon
                      type={item.type_id ? typeMap[item.type_id].icon : 1}
                    />
                  </span>
                  <span className={s.name}>{item.type_name}</span>
                </div>
                <div className={s.progress}>
                  ￥{Number(item.number).toFixed(2) || 0}
                </div>
              </div>
              <div className={s.right}>
                <div className={s.percent}>
                  <Progress
                    shape="line"
                    percent={Number(
                      (item.number /
                        Number(
                          totalType == "expense" ? totalExpense : totalIncome
                        )) *
                        100
                    ).toFixed(2)}
                    theme="primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <PopupMonth ref={monthRef} mode="month" onSelect={selectMonth} />
    </div>
  );
}

export default Data;
