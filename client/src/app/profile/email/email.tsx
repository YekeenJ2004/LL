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
  const [emailChanged, setEmailChanged] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [validCurrentEmail, setValidCurrentEmail] = useState(true);
  const [validNewEmail, setValidNewEmail] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('email');
      setEmail(storedEmail);
    }
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setEmailChanged('');
    setValidCurrentEmail(true);
  };

  const changeEmail = async (email: string) => {
    try {
      const response = await fetch(`https://ll-server-yekeen-jimohs-projects.vercel.app/api/changeemail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: decryptDataInSessionStorage(), email }),
      });
      const data = await response.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('email', email);
        }
        return setEmailChanged('true');
      }
      setEmailChanged('couldNotChangeEmail');
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeEmail = () => {
    if (!(currentEmail === email)) {
      return setValidCurrentEmail(false);
    } else {
      setValidCurrentEmail(true);
    }
    const valid = checkIfValidEmail(newEmail);
    setValidNewEmail(valid);
    if (valid) {
      changeEmail(newEmail);
    }
  };

  if (emailChanged === 'true') {
    return (
      <Modal isOpen={modalOpen} onClose={toggleModal} buttonName={[]} onClickButton={[]}>
        <div>Email Successfully changed</div>
      </Modal>
    );
  }

  if (emailChanged === 'couldNotChangeEmail') {
    return (
      <Modal isOpen={modalOpen} onClose={toggleModal} buttonName={[]} onClickButton={[]}>
        <div>could not change email</div>
      </Modal>
    );
  }

  return (
    <div className={styles.cards}>
      <span className={styles.title}>Email</span>
      <span className={styles.value}>{email}</span>
      <button onClick={toggleModal}>Change</button>
      <Modal isOpen={modalOpen} onClose={toggleModal} buttonName={['change']} onClickButton={[onChangeEmail]}>
        <input className={styles.inputbox} placeholder='Current email' onChange={(e) => { setCurrentEmail(e.target.value) }}></input>
        {!validCurrentEmail && <span className={styles.errormessage}> Does not match current email</span>}
        <input className={styles.inputbox} placeholder='New email' onChange={(e) => { setNewEmail(e.target.value) }}></input>
        {!validNewEmail && <span className={styles.errormessage}> Enter a valid email</span>}
      </Modal>
    </div>
  );
}