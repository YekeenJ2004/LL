"use client"
import React, { useState, useEffect } from 'react'
import ListItemContainer from '../listitemcontainer/listitemcontainer'
import ListContainerHeader from './listcontainerheader'
import styles from './listcontainer.module.css'
import { useMediaQuery } from 'react-responsive';

export default function ListContainer(props: any) {
  return (
    <div className={styles.container}>
        <ListContainerHeader key={props.title} title = {props.title} values = {props.headers}>
        </ListContainerHeader>
        {Object.entries(props.values).map( (item, index) =>(
            <ListItemContainer key={index} title = { item[0].slice(0,50)} values = {item[1]} color ={props.color} link = {props.link}>
            </ListItemContainer>
        ))
        }
    </div>
  )
}
