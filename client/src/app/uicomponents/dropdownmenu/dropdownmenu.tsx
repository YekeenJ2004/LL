import { DropdownContext } from '@/app/contexts/timeRangeContext';
import Merchant from '@/app/merchants/page';
import React, { useState, useContext, useEffect } from 'react';
import styles from './dropdown.module.css'

// Step 1: Create a context to share the dropdown state



const DropdownMenu = ({sendTimeRange})=> {

  const [timeRange, setTimeRange] =  useState<DropdownOptionType>('month')
  const handleSelectChange = (option: DropdownOptionType) => {
    setTimeRange(option);
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
          onChange={(e) => handleSelectChange(e.target.value)}
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