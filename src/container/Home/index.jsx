import React, { useEffect, useRef, useState } from "react";
import { Icon, Pull } from "zarm";
import BillItem from "@/components/BillItem";
import PopupType from "@/components/PopupType";
import s from "./style.module.less";
import dayjs from "dayjs";
import { get, REFRESH_STATE, LOAD_STATE } from "@/utils";
import PopupDate from "@/components/PopupMonth";
import PopupAddBill from "@/components/PopupAddBill";
import CustomIcon from "@/components/CustomIcon";

function Home() {
  const [currentTime, setCurrentTime] = useState(dayjs().format("YYYY-MM")); //当前筛选时间
  const [page, setPage] = useState(1); //分页;
  const [list, setList] = useState([]); //账单列表
  const [totalPage, setTotalPage] = useState(0); //分页总数
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [currentSelect, setCurrentSelect] = useState({}); //当前选择
  //下拉刷新状态
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  //上拉加载状态
  const [loading, setLoading] = useState(LOAD_STATE.normal);

  //改类型
  const typeRef = useRef();

  //改日期
  const monthRef = useRef();

  //添加账单ref
  const addRef = useRef();

  

  useEffect(() => {
    getBillList();
  }, [page, currentSelect, currentTime]);

  //获取账单列表
  const getBillList = async () => {
    const { data } = await get(
      `/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${
        currentSelect.id || "all"
      }`
    );
    //下拉刷新，重制数据
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage);
    //上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  };

  //下拉获取列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };

  //屏幕向下滚动
  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  };

  //添加类型筛选弹窗
  const toggle = () => {
    console.log(typeRef);
    typeRef.current && typeRef.current.show();
  };

  const monthToggle = () => {
    monthRef.current && monthRef.current.show();
  };

  const addToggle = () => {
    addRef.current&&addRef.current.show()
  };

  //筛选类型
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    //触发刷新列表,将分页重制为1
    setPage(1);
    setCurrentSelect(item);
  };

  const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item);
  };

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>
            总支出<b>￥ {totalExpense}</b>
          </span>
          <span className={s.income}>
            总收入<b>￥ {totalIncome}</b>
          </span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left} onClick={toggle}>
            <span className={s.title}>
              {currentSelect.name || "全部类型"}
              <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
          <div className={s.right} onClick={monthToggle}>
            <span className={s.title}>
              {currentTime} <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={index} />
            ))}
          </Pull>
        ) : null}
      </div>
      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
      <div className={s.add} onClick={addToggle}>
        <CustomIcon type="tianjia" />
      </div>
      <PopupAddBill ref={addRef} onReload={refreshData}/>
    </div>
  );
}

export default Home;
