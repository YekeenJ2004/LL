import React ,{ReactNode}from 'react'
import styles from './modal.module.css'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonName: string[];
  onClickButton: ((event: React.MouseEvent<HTMLButtonElement>) => void)[];
  children: ReactNode;
}
export default function Modal({ isOpen, onClose, buttonName, onClickButton, children}: ModalProps) {
  if (!isOpen) {
      return null;
    }
  
  return (
    <div className = {styles.modaloverlay} onClick={onClose}>
      <div className= {styles.modalcontent} onClick={e => e.stopPropagation()}>
        {children}
        <div className={styles.buttombuttons}>
            <button className= {styles.button} onClick={onClose}>exit</button>
            {buttonName.map((button, index)=>(
              <button key={index} className= {styles.button} onClick={onClickButton[index]}>{button}</button>
            ))}
        </div>
      </div>
    </div>
  );
}
