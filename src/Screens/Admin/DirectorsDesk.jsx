import React from 'react'
import MenuTable from "../../Components/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const DirectorsDesk = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Manage Directors Desk"  data={SubMenuData}/>
    </div>
  )
}

export default DirectorsDesk