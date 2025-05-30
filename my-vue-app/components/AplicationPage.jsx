import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

import back from './image/arrow-left.svg';
import vivod from './image/badge-alert.svg';
import chat from './image/message-circle.svg';

import style from './css/Aplication.module.css';

function AplicationPage({ zayavki, id, goback }) {
  const { Zayavkaid } = useParams();
  const SortedZayavka = zayavki.find(el => String(Zayavkaid) === String(el.id));
  const [error, setError] = useState('');

  const handleRespond = async () => {
    if (!SortedZayavka) return;

    if (SortedZayavka.sender_idusers === id) {
      setError('Вы не можете быть исполнителем собственной заявки.');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/zayavki/${Zayavkaid}`, {
        shortpage: SortedZayavka.shortpage,
        type: SortedZayavka.type,
        status: 'В обработке',
        text: SortedZayavka.text,
        location: SortedZayavka.location,
        sender_idusers: SortedZayavka.sender_idusers,
        executor_id: id,
    });
      alert('Вы откликнулись на заявку!');
      setError('');
      
    } catch (err) {
      console.error(err);
      setError('Ошибка при отклике на заявку');
    }
  };

  if (!SortedZayavka) return <div>Заявка не найдена</div>;

  return (
    <div className={style.aplication}>
      <h1 className={style.aplication__title}>Заявка</h1>
      <div className={style.aplication__container}>
        <button className={style.aplication__button_back} onClick={goback}>
          <img src={back} className={style.aplication__button_image} alt="Назад" />
        </button>
        <Link to={`/Aplication/${Zayavkaid}/chat`}>
          <button className={style.aplication__button_chat}>
            <img src={chat} className={style.aplication__button_image} alt="Чат" />
          </button>
        </Link>
        <Link to={`/Aplication/${Zayavkaid}/vivod`}>
          <button className={style.aplication__button_vivod}>
            <img src={vivod} className={style.aplication__button_image} alt="Вывод" />
          </button>
        </Link>
        <div className={style.aplication__info}>
          <div className={style.aplication__info_item}>Локация: {SortedZayavka.location}</div>
          <div className={style.aplication__info_item}>Айди отправителя: {SortedZayavka.sender_idusers}</div>
          <div className={style.aplication__info_item}>Тип поломки: {SortedZayavka.type}</div>
          <div className={style.aplication__info_item}>Статус: {SortedZayavka.status}</div>
        </div>
        <div className={style.Problemtext}>
          <div className={style.aplication__shortpage}>{SortedZayavka.shortpage}</div>
          <div className={style.aplication__text}>{SortedZayavka.text}</div>
          <button className={style.aplication__submit} onClick={handleRespond}>
            Откликнуться
          </button>
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default AplicationPage;
