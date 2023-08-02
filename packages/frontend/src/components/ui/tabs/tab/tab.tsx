interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      cursor: 'pointer',
      fontWeight: active ? 'bold' : 'normal'
    }}
  >
    {label}
  </div>
);

export default Tab;
