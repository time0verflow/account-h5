import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar, Icon } from "zarm";
import s from "./style.module.less";
import PropTypes from "prop-types";

const Header = ({ title = "" }) => {
  const navigate = useNavigate();
  return (
    <div className={s.headerWrap}>
      <div className={s.block}>
        <NavBar
          className={s.header}
          left={
            <Icon
              type="arrow-left"
              theme="primary"
              onClick={() => navigate(-1)}
            />
          }
          title={title}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;
