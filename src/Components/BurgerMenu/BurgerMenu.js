import { push as Menu } from "react-burger-menu";
import React, { useState } from "react";
import "./BMStyle.css";
import Scrollbar from "react-scrollbars-custom";
const BurgerMenu = (props) => {
  // NOTE: You also need to provide styles, see https://github.com/negomi/react-burger-menu#styling
  const [isOpen, setIsOpen] = useState(false);
  const click = () => {
    setIsOpen(false);
  };
  return (
    <Menu
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      {props.items.map((i, index) => (
        <p
          className="bm-item"
          onClick={() => {
            click();
            props.menuClicked(index);
          }}
        >
          {i.split("T")[0]}
          <br />
          {i.split("T")[1].split(".")[0]}
        </p>
      ))}
    </Menu>
  );
};

export default BurgerMenu;
