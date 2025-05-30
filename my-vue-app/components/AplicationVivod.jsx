import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import back from './image/arrow-left.svg';
import vivod from './image/badge-alert.svg';
import chat from './image/message-circle.svg';

import style from './css/Aplication.module.css';

function AplicationVivod({ zayavki, goback }) {
  const { Zayavkaid } = useParams();
  const SortedZayavka = zayavki.find(el => String(Zayavkaid) === String(el.id)) || {};

  // Инициализируем состояния пустыми строками, чтобы не было null
  const [otschet, setOtschet] = useState('');
  const [status, setStatus] = useState('');

  // Обновляем состояния при изменении выбранной заявки
  useEffect(() => {
    setOtschet(SortedZayavka.otschet ?? '');
    setStatus(SortedZayavka.status ?? '');
  }, [SortedZayavka]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status) {
      alert('Выберите статус');
      return;
    }

    const updatedZayavka = {
      shortpage: SortedZayavka.shortpage || '',
      type: SortedZayavka.type || '',
      status,
      text: SortedZayavka.text || '',
      location: SortedZayavka.location || '',
      sender_idusers: SortedZayavka.sender_idusers || null,
      executor_id: SortedZayavka.executor_id || null,
      otschet,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/zayavki/${Zayavkaid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedZayavka),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.statusText}`);
      }

      alert('Вывод успешно отправлен!');
    } catch (error) {
      alert('Ошибка отправки: ' + error.message);
    }
  };

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
        <h2 className={style.aplication__title}>Вывод о проделанной работе</h2>
        <form onSubmit={handleSubmit} className={style.aplication__form}>
          <textarea
            className={style.form__textarea }
            placeholder="Напишите вывод о проделанной работе тут"
            value={otschet}
            onChange={(e) => setOtschet(e.target.value)}
          />
          <div className={style.form__radio_group}>
            <div>
              <input
                type="radio"
                name="status"
                value="Выполнена"
                checked={status === 'Выполнена'}
                onChange={(e) => setStatus(e.target.value)}
              />
              <label>Выполнена</label>
            </div>
            <div>
              <input
                type="radio"
                name="status"
                value="Не выполнена"
                checked={status === 'Не выполнена'}
                onChange={(e) => setStatus(e.target.value)}
              />
              <label>Не выполнена</label>
            </div>
            <div>
              <input
                type="radio"
                name="status"
                value="Доп.решение"
                checked={status === 'Доп.решение'}
                onChange={(e) => setStatus(e.target.value)}
              />
              <label>Доп.решение</label>
            </div>
          </div>
          <button className={style.aplication__submit} type="submit">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}

export default AplicationVivod;
