'use client';
import { useState, ReactNode } from 'react';
import Tab from './tab/tab';

interface TabItem {
  label: string;
  component: ReactNode;
}

interface TabsProps {
  tabItems: TabItem[];
}

const Tabs: React.FC<TabsProps> = ({ tabItems }) => {
  const [activeTab, setActiveTab] = useState(tabItems[0].label);

  const activeItem = tabItems.find(tabItem => tabItem.label === activeTab);

  return (
    <div className='tabs'>
      {tabItems.map(tabItem => (
        <Tab
          key={tabItem.label}
          label={tabItem.label}
          active={tabItem.label === activeTab}
          onClick={() => setActiveTab(tabItem.label)}
        />
      ))}
      {activeItem && activeItem.component}
    </div>
  );
};

export default Tabs;
