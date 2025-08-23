import React from 'react'
import MenuTable from "../../Components/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const SubSubMenu = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Sub-submenu List" Rtext="Add Sub-submenu" data={SubMenuData}/>
    </div>
  )
}

export default SubSubMenu