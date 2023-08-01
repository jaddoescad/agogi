// import { Select } from "@chakra-ui/react";
// import { useState } from "react";

// const Dropdown = ({
//   label,
//   options,
//   defaultOption,
//   onChange
// }: {
//     label: string;
//     options: string[]
//     defaultOption: string;
//     onChange: (value: string) => void;
// }) => {
//   const [selected, setSelected] = useState<string>(defaultOption);

//   return (
//     <div className="text-black w-1/2">
//       <label className="block px-2 mb-2 text-white text-sm">{label}:</label>
//       <Select
//         placeholder={selected}
//         size="lg"
//         className="mb-3"
//         onChange={(e) => {
//           setSelected(e.target.value);
//           onChange(e.target.value);
//         }}
//       >
//         {options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </Select>
//     </div>
//   );
// };

// export default Dropdown;
