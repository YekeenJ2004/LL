import React, { useState, useEffect } from 'react';
import Modal from '@/app/uicomponents/modal/modal';
import styles from '../profile.module.css';
import CryptoJS from 'crypto-js';

const checkIfValidEmail = (email: string) => {
  const regexPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexPattern.test(email);
};

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

export default function Email(props: any) {
  const [paypalChanged, setPaypalChanged] = useState('');
  const [currentPaypal, setCurrentPaypal] = useState('');
  const [validCurrentPaypal, setValidCurrentPaypal] = useState(true);
  const [validNewPaypal, setValidNewPaypal] = useState(true);
  const [newPaypal, setNewPaypal] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [paypal, setPaypal] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPaypal = sessionStorage.getItem('paypal');
      setPaypal(storedPaypal);
    }
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setPaypalChanged('');
    setValidCurrentPaypal(true);
  };

  const changePaypal = async (paypal: string) => {
    try {
      const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/changepaypal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: decryptDataInSessionStorage(), paypal }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        sessionStorage.setItem('paypal', paypal.slice(0, 3));
        return setPaypalChanged('true');
      }
      setPaypalChanged('couldNotChangePaypal');
    } catch (err) {
      console.log(err);
    }
  };

  const onChangePaypal = () => {
    const valid = checkIfValidEmail(newPaypal);
    setValidNewPaypal(valid);
    if (valid) {
      changePaypal(newPaypal);
    }
  };

  if (paypalChanged === 'true') {
    return (
      <Modal isOpen={modalOpen} onClose={toggleModal} buttonName={[]} onClickButton={[]}>
        <div>Email Successfully changed</div>
      </Modal>
    );
  }

  if (paypalChanged === 'couldNotChangePaypal') {
    return (
      <Modal isOpen={modalOpen} onClose={toggleModal} buttonName={[]} onClickButton={[]}>
        <div>could not change Paypal</div>
      </Modal>
    );
  }

  return (
    <div className={styles.cards}>
      <span className={styles.title}>Paypal</span>
      <span className={styles.value}>{paypal ? `${paypal}***` : 'Loading...'}</span>
      <button onClick={toggleModal}>Change</button>
      <Modal isOpen={modalOpen} onClose={toggleModal} buttonName={['change']} onClickButton={[onChangePaypal]}>
        <input className={styles.inputbox} placeholder='Current paypal' onChange={(e) => setCurrentPaypal(e.target.value)}></input>
        {!validCurrentPaypal && <span className={styles.errormessage}> Does not match current email</span>}
        <input className={styles.inputbox} placeholder='New paypal' onChange={(e) => setNewPaypal(e.target.value)}></input>
        {!validNewPaypal && <span className={styles.errormessage}> Enter a valid email</span>}
      </Modal>
    </div>
  );
}