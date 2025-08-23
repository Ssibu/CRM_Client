import React from "react";
import MenuTable from "../../Components/Menu/MenuTable";
import MenuData from "../../Components/Data/MenuData/Menu"; // ✅ Import the mock data

const Menu = () => {
  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <MenuTable
        Ltext="Menu List"
        Rtext="Add Menu"
        data={MenuData} // ✅ Pass the data as props
      />
    </div>
  );
};

export default Menu;
