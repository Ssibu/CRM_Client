import React from 'react'
import MenuTable from "../../Components/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const Policy = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Policy" Rtext="Add Policy" data={SubMenuData}/>
    </div>
  )
}

export default Policy