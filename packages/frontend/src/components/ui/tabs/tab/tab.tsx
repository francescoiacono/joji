import * as styles from './tab.linaria';

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`${styles.tab} ${active ? styles.active : ''}`}
  >
    {label}
  </div>
);

export default Tab;
