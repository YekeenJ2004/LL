import React, { useState } from 'react'
import styles from './searchbar.module.css'

interface SearchbarProps {
  setSearchTerm: (term: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ setSearchTerm }) => {

  const [input, setInput] = useState('')
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);  // Update the state with the input
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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


export default Searchbar;