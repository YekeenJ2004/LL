import React, { useState } from 'react'
import styles from  './linkwrapper.module.css'
import CryptoJS from 'crypto-js'

const decryptDataInSessionStorage = () =>{
  try{
    const passphrase = 'getThisDough'
    const encryptedxcust = sessionStorage.getItem('xcust')
    if (!encryptedxcust) {
      throw new Error('xcust is not available in sessionStorage');
    }
    const xcust  = CryptoJS.AES.decrypt(encryptedxcust, passphrase);
    return xcust.toString(CryptoJS.enc.Utf8)
  }catch(error){
    console.log(error)
    return ''
  }
}

export default function Linkwrapper() {

  const [userText, setUserText] = useState('')
  const [affiliatedLink, setAffiliatedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [InputValue, setInputValue] = useState('')


  const username = decryptDataInSessionStorage()

  const generateLink = () =>{
    if(!userText){
      setAffiliatedLink('Please enter a link')
    }else{
      setAffiliatedLink(`https://go.skimresources.com/?id=225413X1707292&url=${userText}&xcust=${username}`)
    }
  }
  const copyToClipboard  = async() =>{
    try{
      await navigator.clipboard.writeText(affiliatedLink)
      setCopied(true)
    }catch(err){
      console.log(err)
    }
  }
  
  return (
    <div>
      <span className={styles.title}>Link Wrapper</span>
      <div className={styles.container}>
        <div className= {styles.firstsection}>
          <div>
            <input className = {styles.inputbox} placeholder='Enter link here' onChange={(e)=>{setInputValue(e.target.value); setUserText(InputValue) ; setCopied(false)}} value={InputValue}></input>
            <button className= {styles.button} onClick={() =>{ setInputValue(''); setCopied(false); setAffiliatedLink('')}}> Clear</button>
          </div>
          <button className = {styles.button} onClick={generateLink}>Generate Link</button>
        </div>
        <textarea className = {styles.textarea} defaultValue={affiliatedLink}></textarea>
        <button className = {styles.button} onClick = {copyToClipboard}> { copied ? 'Copied to Clipboard' : 'Copy'}</button>
      </div>
    </div>
  )
}

