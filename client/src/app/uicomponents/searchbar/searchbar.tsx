import React, { useState } from 'react'
import styles from './searchbar.module.css'

export default function Searchbar({setSearchTerm}) {
  const [input, setInput] = useState('')
  const handleInputChange = (e) => {
    setInput(e.target.value);  // Update the state with the input
  };
  const handleSubmit = (event) => {
    event.preventDefault();  // Prevent the form from refreshing the page
  };
  const handleSearch = () =>{
    setSearchTerm(input)
  }
  return (
    <div className  ={styles.container}>
      <form onSubmit={handleSubmit}>
        <input className= {styles.inputbox} placeholder='Search for a retailer' onChange={handleInputChange}></input>
        <button className = {styles.button} type="submit" onClick={handleSearch}>Search</button>
      </form>
    </div>
  )
}


