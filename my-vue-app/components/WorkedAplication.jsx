import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Router, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

import style from './css/watch.module.css'

function WorkedAplication({zayavki, id, fetchZayavki}) {
const filteredZayavki = zayavki.filter(z => 
  (z.sender_idusers == id && z.executor_id != null && z.status === 'В обработке') || 
  (z.executor_id == id && z.status === 'В обработке')
);

useEffect(() => {
  fetchZayavki();
}, []);


  return (
      <div className={style.watch}>
        <h1 className={style.watch__title}>Просмотр активных заявок</h1>
        <div className={style.watch__list}>
          {filteredZayavki.map(z => (
            <div key={z.id} className={style.watch__card}>
              <b className={style.watch__card_title}>{z.shortpage}</b>
              <div className={style.watch__card_field}>Тип: {z.type}</div>
              <div className={style.watch__card_field}>Статус: {z.status}</div>
              <div className={style.watch__card_field}>Локация: {z.location}</div>
              <Link to={`/Aplication/${z.id}`}>
                <button className={style.watch__button}>Перейти к заявке</button>
              </Link>  
            </div>
          ))}
        </div>
      </div>
    );
  }

export default WorkedAplication;
