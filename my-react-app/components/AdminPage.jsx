import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Router, Navigate, Link } from 'react-router-dom';
import axios from 'axios';

import style from './css/admin.module.css';

function AdminPage({ zayavki, goToAdduser, fetchZayavki }) {
  const [FindU, setFindU] = useState('');
  const [FindA, setFindA] = useState('');

  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setAllUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }

    fetchAllUsers();
  }, []);

useEffect(() => {
  fetchZayavki();
}, []);

  // Фильтрация пользователей
  const filteredUsers = allUsers.filter(user => {
    const search = FindU.toLowerCase();
    return (
      user.firstname?.toLowerCase().includes(search) ||
      user.middleName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search) ||
      user.login?.toLowerCase().includes(search) ||
      user.profession?.toLowerCase().includes(search)
    );
  });

  // Фильтрация заявок 
  const filteredZayavki = zayavki.filter(z => {
    const search = FindA.toLowerCase();
    return (
      z.shortpage?.toLowerCase().includes(search) ||
      z.status?.toLowerCase().includes(search) ||
      z.location?.toLowerCase().includes(search)
    );
  });

  return (
    <div className={style['admin-panel']}>
      <h1 className={style['admin-panel__title']}>Панель администратора</h1>
      <div className={style['admin-panel__main']}>
        <div className={style['admin-panel__section']}>
          <button className={style['admin-panel__add-btn']} onClick={goToAdduser}>+</button>
          <h2 className={style['admin-panel__subtitle']}>Пользователи</h2>
          <label className={style['admin-panel__label']}>Поиск пользователя</label>
          <input
            className={style['admin-panel__input']}
            type="text"
            value={FindU}
            onChange={e => setFindU(e.target.value)}
            placeholder="Поиск по имени, логину или профессии"
          />

          <div className={style['admin-panel__list']}>
            {filteredUsers.map(user => (
              <Link to={`/admin/users/${user.id}/edit`} state={{ allUsers }} key={user.id}>
                <div className={style['admin-panel__card']}>
                  <b>Айди: {user.id}</b>
                  <div>Инициалы: {user.firstname} {user.middleName} {user.lastName}</div>
                  <div>Профессия: {user.profession}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className={style['admin-panel__section']}>
          <h2 className={style['admin-panel__subtitle']}>Заявки</h2>
          <label className={style['admin-panel__label']}>Поиск заявки</label>
          <input
            className={style['admin-panel__input']}
            type="text"
            value={FindA}
            onChange={e => setFindA(e.target.value)}
            placeholder="Поиск по заголовку, статусу или локации"
          />

          <div className={style['admin-panel__list']}>
            {filteredZayavki.map(z => (
              <Link to={`/admin/aplication/${z.id}/edit`} key={z.id}>
                <div className={style['admin-panel__card']}>
                  <b>Айди: {z.id}</b>
                  <div>Заголовок: {z.shortpage}</div>
                  <div>Статус: {z.status}</div>
                  <div>Локация: {z.location}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
    </div>
  );
}

export default AdminPage;