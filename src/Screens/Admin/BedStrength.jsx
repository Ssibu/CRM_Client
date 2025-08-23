import React from "react";
import MenuTable from "../../Components/Menu/MenuTable";
import SubMenuData from "../../Components/Data/MenuData/SubMenu";

const BedStrength = () => {
  return (
    <div className="min-h-[80vh]  py-4 font-sans">
      <MenuTable Ltext="Bed Strength" Rtext="Add Bed Strength" data={SubMenuData} />
    </div>
  );
};

export default BedStrength;
