import React from 'react'
import MenuTable from "../../Components/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const HomeConfiguration = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Home Configuration" Rtext="Add Home Configuration" data={SubMenuData}/>
    </div>
  )
}

export default HomeConfiguration