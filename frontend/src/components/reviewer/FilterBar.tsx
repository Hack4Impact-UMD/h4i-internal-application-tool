type Props = {
  onSearch?: (query: string) => void;
  onSortChange?: (sortType: string) => void;
  onRoleFilter?: (filterBy: string) => void;
  selectedRole: string;
};

const buttonClasses =
  "bg-[#CBF9F3] border-none p-2 rounded-2xl ml-[25px] mt-[20px] font-karla h-11 text-center appearance-none cursor-pointer text-[#333333] text-xl font-normal";

const FilterBar: React.FC<Props> = ({
  onSearch = () => {},
  onRoleFilter = () => {},
  onSortChange = () => {},
  selectedRole = "",
}: Props) => {
  return (
    <div className="flex flex-start mb-[16px]">
      <input
        type="text"
        placeholder="Search by name or email"
        className="bg-white border border-[#B4BBC3] p-[0.6rem] rounded-md w-[17%] ml-[-80px] mt-[20px] font-karla text-black text-base h-[2.75rem]"
        onChange={(e) => onSearch(e.target.value)}
      />

      <select
        value={selectedRole}
        onChange={(e) => onRoleFilter(e.target.value)}
        className={buttonClasses}
      >
        <option value="">Filter</option>
        <option value="TL">Tech Lead (TL)</option>
        <option value="Er">Engineer (Er)</option>
        <option value="Sg">Sourcing (Sg)</option>
        <option value="Ds">Designer (Ds)</option>
        <option value="PM">Project Manager (PM)</option>
        <option value="Bp">Bootcamp Program (BP)</option>
      </select>

      <select onChange={(e) => onSortChange(e.target.value)} className={buttonClasses}>
        <option value="">Sort By</option>
        <option value="date">Date</option>
        <option value="name">Alphabetical</option>
        <option value="score_high">Highest Overall Score</option>
        <option value="score_low">Lowest Overall Score</option>
      </select>
    </div>
  );
};

export default FilterBar;
