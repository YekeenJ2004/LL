import React, { useState, useContext, useEffect } from 'react';
import styles from './dropdown.module.css'

// Step 1: Create a context to share the dropdown state


interface DropdownMenuProps {
  sendTimeRange: (timeRange: DropdownOptionType) => void;
}

const DropdownMenu:  React.FC<DropdownMenuProps>  = ({sendTimeRange})=> {

  const [timeRange, setTimeRange] =  useState<DropdownOptionType>('month')
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as DropdownOptionType;
    setTimeRange(value);
  };
  useEffect(() =>{
    sendTimeRange(timeRange)
  }, [timeRange, setTimeRange, sendTimeRange]) 
  return (
    <div className={styles.container}>
        <label htmlFor="dropdown" className={styles.label}>Range</label>
        <select
          className={styles.select}
          id="dropdown"
          value={timeRange}
          onChange={handleSelectChange}
        >
          <option value = 'month'>Month</option>
          <option value="7days">7 Days</option>
          <option value="30days">30 Days</option>
          <option value="year">12 Months</option>
        </select>
    </div>
  );
};

export default DropdownMenu;