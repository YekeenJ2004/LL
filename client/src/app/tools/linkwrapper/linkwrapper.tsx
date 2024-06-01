import React, { useState, useEffect} from 'react'
import styles from  './linkwrapper.module.css'
import CryptoJS from 'crypto-js'


export default function Linkwrapper() {
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
  
  const [userText, setUserText] = useState('')
  const [affiliatedLink, setAffiliatedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [InputValue, setInputValue] = useState('')
  const [username, setUsername] = useState('');
  const [urlShortened,setUrlShortened] =useState(true)

  const shortenUrl = async (xcust: string) =>{
    try{
      const response = await fetch(`https://buyth.at/-make?id=225413X1707292&url=${userText}&xcust=${xcust}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      console.log(data)
      if(data.status == 0){
        return data['shorturl']
      }
      throw Error
    }catch(err){
      console.log(err)
      return 'could not shortenurl'
    }
  }


  useEffect(() => {
    const decryptDataInSessionStorage = () => {
      try {
        const passphrase = 'getThisDough';
        const encryptedxcust = sessionStorage.getItem('xcust');
        if (!encryptedxcust) {
          throw new Error('xcust is not available in sessionStorage');
        }
        const xcust = CryptoJS.AES.decrypt(encryptedxcust, passphrase);
        return xcust.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.log(error);
        return '';
      }
    };

    if (typeof window !== 'undefined') {
      const decryptedUsername = decryptDataInSessionStorage();
      setUsername(decryptedUsername);
    }
  }, []);
  const shortenUrlHandler = async() =>{
    const resFromUrlShortner = await shortenUrl(username)
    setAffiliatedLink(resFromUrlShortner)
    setUrlShortened(true)
  }

  const pasteHandler = (event: React.ClipboardEvent<HTMLInputElement>): void => {
    const pastedText = event.clipboardData.getData('text');
    setInputValue(pastedText); // Update the state with the pasted text
  }
  const generateLink = () =>{
    if(!userText){
      setAffiliatedLink('Please enter a link')
    }else{
      setAffiliatedLink(`https://go.skimresources.com/?id=225413X1707292&url=${userText}&xcust=${username}`)
      setUrlShortened(false)
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
            <input className = {styles.inputbox} placeholder='Enter link here' onChange={(e)=>{setInputValue(e.target.value); setUserText(InputValue) ; setCopied(false)}} onPaste={pasteHandler} value={InputValue}></input>
            <button className= {styles.button} onClick={() =>{ setInputValue(''); setCopied(false); setAffiliatedLink('')}}> Clear</button>
          </div>
          <button className = {styles.button} onClick={generateLink}>Generate Link</button>
        </div>
        <textarea className = {styles.textarea} defaultValue={affiliatedLink}></textarea>
        <button className = {styles.button} onClick = {copyToClipboard} > { copied ? 'Copied to Clipboard' : 'Copy'}</button>
        <button className= {styles.button} onClick = {shortenUrlHandler} disabled ={urlShortened}> Shorten</button>
      </div>
    </div>
  )
}

