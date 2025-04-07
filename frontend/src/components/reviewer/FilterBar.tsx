import React from 'react';

type Props = {
  onSearch?: (query: string) => void;
  onSortChange?: (sortType: string) => void;
  onRoleFilter?: (filterBy: string) => void;
  selectedRole: string;
};

const FilterBar: React.FC<Props> = ({
  onSearch = () => {},
  onSortChange = () => {},
  onRoleFilter = () => {},
  selectedRole = "",
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <input
        type="text"
        placeholder="Search"
        className="w-[250px] h-[44px] px-4 rounded-full border border-[#B4BBC3] font-karla text-base text-black shadow-sm"
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="flex gap-4">
        <select
          value={selectedRole}
          onChange={(e) => onRoleFilter(e.target.value)}
          className="bg-[#CBF9F3] px-4 py-2 rounded-full font-karla text-[#333] text-base h-11 border-none shadow-sm"
        >
          <option value="">Filter</option>
          <option value="TL">Tech Lead (TL)</option>
          <option value="Er">Engineer (Er)</option>
          <option value="Sg">Sourcing (Sg)</option>
          <option value="Ds">Designer (Ds)</option>
          <option value="PM">Project Manager (PM)</option>
          <option value="Bp">Bootcamp Program (BP)</option>
        </select>

        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-[#CBF9F3] px-4 py-2 rounded-full font-karla text-[#333] text-base h-11 border-none shadow-sm"
        >
          <option value="">Sort</option>
          <option value="date">Date</option>
          <option value="name">Alphabetical</option>
          <option value="score_high">Highest Overall Score</option>
          <option value="score_low">Lowest Overall Score</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;