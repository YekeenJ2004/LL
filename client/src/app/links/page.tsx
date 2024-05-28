"use client"
import React, {useState, useEffect} from 'react'
import styles from  '../uicomponents/layout.module.css'
import DropdownMenu from '../uicomponents/dropdownmenu/dropdownmenu'
import LinkListContainer from '../uicomponents/listcontainer/listcontainer'
import CryptoJS from 'crypto-js'
import { useAuth } from '../authcontext'
import Loading from '../uicomponents/loadingspinner/loadingspinner'

// const links = {
//   'https://www.parfumdreams.co.uk/Weleda/Facial-care/Day-care/Skin-Food/index_83928.aspx?cjdata=MXxZfFl8WXwxNzAxMzA3MDI3Nzg4':[[9.67, 3.00, 169.89], 'https://www.parfumdreams.co.uk/Weleda/Facial-care/Day-care/Skin-Food/index_83928.aspx?cjdata=MXxZfFl8WXwxNzAxMzA3MDI3Nzg4'],
//   'https://www.luxplus.co.uk/product/egyptian-magic-all-purpose-skin-cream-7-5-ml?gsmp=1': [[6.76, 5.00, 138.15],'https://www.luxplus.co.uk/product/egyptian-magic-all-purpose-skin-cream-7-5-ml?gsmp=1'], 
//   'https://www.superdrug.com/toiletries/incontinence/incontinence-pads/tena-discreet-extra-incontinence-pads-20-pack/p/799001?gclsrc=aw.ds':[[0.13, 1.00, 19.14], 'https://www.superdrug.com/toiletries/incontinence/incontinence-pads/tena-discreet-extra-incontinence-pads-20-pack/p/799001?gclsrc=aw.ds'],
//   'https://www.stylevana.com/en_GB/deal-ishizawa-lab-nadeshiko-keana-pore-care-rice-mask-10pc.html': [[33.86, 3.00, 322.45], 'https://www.stylevana.com/en_GB/deal-ishizawa-lab-nadeshiko-keana-pore-care-rice-mask-10pc.html'],
//   'https://www.iceland.co.uk/p/mr-naga-hot-pepper-pickle-190g/95409.html': [[0.35, 1.00, 49.59], 'https://www.iceland.co.uk/p/mr-naga-hot-pepper-pickle-190g/95409.html'],
// }

const fetchData = async (xcust: String,timeRange: String) =>{
  try{
    const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/data/linkspagedata?xcust=${xcust}&timeRange=${timeRange}`)
    if (!response.ok) {
      console.log('failed')
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
  }catch(err){
    console.log(err)
  }
}
const decryptDataInSessionStorage = () =>{
  const passphrase = 'getThisDough'
  const encryptedxcust = sessionStorage.getItem('xcust')
  const xcust  = CryptoJS.AES.decrypt(encryptedxcust, passphrase);
  return xcust.toString(CryptoJS.enc.Utf8)
}

export default function Links() {
  const {isLoggedIn} = useAuth()
  const [timeRange, setTimeRange] = useState<DropdownOptionType>('month');
  const [links, setLinks] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  

  const recieveTimeRange = (data: DropdownOptionType) =>{
    setTimeRange(data)
  }

  useEffect(() =>{
    (async () =>{
      setIsLoading(true)
      const xcust = decryptDataInSessionStorage()
      const data =  await fetchData(xcust, timeRange)
      setLinks(data.links)
      setIsLoading(false)
    })()
  },[timeRange, setTimeRange])


  if(isLoggedIn){
    return (
      <div>
        <div className = {styles.wrapper}>
          <div className = {styles.main}>
            <DropdownMenu sendTimeRange={recieveTimeRange}></DropdownMenu>
            {isLoading && <Loading></Loading>}
            {!isLoading &&
              <div className={styles.tophalf}>
                <LinkListContainer title = "Links" values ={links} headers = {["Commission", "Orders"," Order Total"]}></LinkListContainer>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
