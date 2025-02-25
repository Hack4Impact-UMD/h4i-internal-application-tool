type Props = {
  onSearch?: (query: string) => void,
  onSortByDate?: () => void,
  onRoleFilter?: (filterBy: string) => void,
  selectedRole: string,
}

const FilterBar: React.FC<Props> = ({
  onSearch = () => { },
  onRoleFilter = () => { },
  onSortByDate = () => { },
  selectedRole = "" }: Props
) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="Search by name or email"
        style={{
          backgroundColor: 'white',
          border: '1px solid #B4BBC3',
          padding: '0.6rem 0.6rem',
          borderRadius: '5px',
          width: '17%',
          marginTop: '20px',
          marginLeft: '-80px',
          fontFamily: 'Karla',
          fontSize: '16px',
          color: 'black',
          height: '1.4rem',
        }}
        onChange={(e) => onSearch(e.target.value)}
      />


      <select
        /*value={selectedRole}
        onChange={(e) => onRoleFilter(e.target.value)}*/
        value={selectedRole}
        onChange={(e) => onRoleFilter(e.target.value)}
        style={{
          backgroundColor: '#CBF9F3',
          border: '2px solid #CBF9F3',
          padding: '0.6rem 0.6rem',
          height: '2.75rem',
          borderRadius: '15px',
          marginTop: '20px',
          marginLeft: '25px',
          color: '#333333',
          cursor: 'pointer',
          fontFamily: 'Karla',
          fontSize: '20px',
          width: '8%',
          appearance: 'none',
          textAlign: 'center',
        }}
      >
        <option value="">Filter</option>
        <option value="TL">Tech Lead (TL)</option>
        <option value="Er">Engineer (Er)</option>
        <option value="Sg">Sourcing (Sg)</option>
        <option value="Ds">Designer (Ds)</option>
        <option value="PM">Project Manager (PM)</option>
        <option value="Bp">Bootcamp Program (BP)</option>
      </select>

      <button
        onClick={onSortByDate}
        style={{
          backgroundColor: '#CBF9F3',
          color: '#333333',
          padding: '0.6rem 1rem',
          border: 'none',
          borderRadius: '15px',
          cursor: 'pointer',
          fontFamily: 'Karla',
          fontSize: '20px',
          marginTop: '20px',
          marginLeft: '20px',
          height: '2.75rem',
        }}
      >
        Sort By: Date
      </button>
    </div>
  );
};

export default FilterBar;
