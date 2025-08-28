// // components/MenuTable/FilterControls.jsx
// import React from "react";

// const FilterControls = ({
//   entriesPerPage,
//   setEntriesPerPage,
//   searchTerm,
//   setSearchTerm,
//   setCurrentPage,
// }) => (
//   <div className="flex items-center justify-between mb-3">
//     <select
//       value={entriesPerPage}
//       onChange={(e) => {
//         setEntriesPerPage(Number(e.target.value));
//         setCurrentPage(1);
//       }}
//       className="border rounded px-2 py-1 text-sm"
//     >
//       <option value={5}>5</option>
//       <option value={10}>10</option>
//       <option value={20}>20</option>
//          <option value={30}>30</option>

//    <option value={50}>50</option>
//    <option value={100}>100</option>

//     </select>
//     <input
//       type="text"
//       placeholder="Search..."
//       className="border px-2 py-1 text-sm rounded"
//       value={searchTerm}
//       onChange={(e) => {
//         setSearchTerm(e.target.value);
//         setCurrentPage(1);
//       }}
//     />
//   </div>
// );

// export default FilterControls;


import React from "react";

const FilterControls = ({
  entriesPerPage,
  setEntriesPerPage, // This is the only function it needs for the dropdown
  searchTerm,
  setSearchTerm,
  // REMOVE setCurrentPage from here, it's not being passed for this component's use
}) => (
  <div className="flex items-center justify-between mb-3">
    <select
      value={entriesPerPage}
      onChange={(e) => {
        // ONLY call the function you were given. 
        // The parent component will handle resetting the page.
        setEntriesPerPage(Number(e.target.value)); 
        
        // REMOVE THIS LINE: setCurrentPage(1);
      }}
      className="border rounded px-2 py-1 text-sm"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={30}>30</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
    
    <input
      type="text"
      placeholder="Search..."
      className="border px-2 py-1 text-sm rounded"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
      }}
    />
  </div>
);

export default FilterControls;