import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import style from './css/adminadd.module.css';

function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { allUsers } = location.state || {};

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    firstname: '',
    middleName: '',
    lastName: '',
    birthday: '',
    sex: '',
    profession: '',
    email: '',
    phone: '',
    passport: '',
    inn: '',
    snils: '',
    oms: '',
    vodila: '',
  });

  useEffect(() => {
    if (allUsers && id) {
      const user = allUsers.find(u => String(u.id) === String(id));
      if (user) {
        setFormData({
          login: user.login || '',
          password: user.password || '',
          firstname: user.firstname || '',
          middleName: user.middleName || '',
          lastName: user.lastName || '',
          birthday: user.birthday ? user.birthday.slice(0, 10) : '',
          sex: user.sex || '',
          profession: user.profession || '',
          email: user.email || '',
          phone: user.phone || '',
          passport: user.passport || '',
          inn: user.inn || '',
          snils: user.snils || '',
          oms: user.oms || '',
          vodila: user.vodila || '',
        });
      }
    }
  }, [allUsers, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/users/${id}`, formData);
      alert('Пользователь успешно обновлён!');
      navigate('/admin');
    } catch (error) {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить этого пользователя?')) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        alert('Пользователь удалён.');
        navigate('/admin');
      } catch (error) {
        alert(`Ошибка удаления: ${error.response?.data?.message || error.message}`);
        console.error(error);
      }
    }
  };

  return (
    <div className={style.edit_application}>
      <h1 className={style.edit_application__title}>Редактирование пользователя</h1>
      <form className={style.edit_application__form} onSubmit={handleSubmit}>
        
        <h2 className={style.edit_application__subtitle}>Учётные данные</h2>
        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Логин</label>
            <input
              className={style.edit_application__input}
              name="login"
              value={formData.login}
              onChange={handleChange}
              required
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Пароль</label>
            <input
              className={style.edit_application__input}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h2 className={style.edit_application__subtitle}>Инициалы</h2>
        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Имя</label>
            <input
              className={style.edit_application__input}
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Отчество</label>
            <input
              className={style.edit_application__input}
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Фамилия</label>
            <input
              className={style.edit_application__input}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Дата рождения</label>
            <input
              className={style.edit_application__input}
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Пол</label>
            <select
              className={style.edit_application__input}
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option className={style.edit_application__option} value="">Выберите пол</option>
              <option className={style.edit_application__option} value="Ж">Ж</option>
              <option className={style.edit_application__option} value="М">М</option>
            </select>
          </div>
        </div>

        <h2 className={style.edit_application__subtitle}>Профессия</h2>
        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Профессия</label>
            <select
              className={style.edit_application__input}
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
            >
              <option className={style.edit_application__option} value="">Выберите профессию</option>
              <option className={style.edit_application__option} value="Пользователь">Пользователь</option>
              <option className={style.edit_application__option} value="Администратор">Администратор</option>
              <option className={style.edit_application__option} value="Модератор">Модератор</option>
            </select>
          </div>
        </div>

        <h2 className={style.edit_application__subtitle}>Контакты</h2>
        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Email</label>
            <input
              className={style.edit_application__input}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Телефон</label>
            <input
              className={style.edit_application__input}
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <h2 className={style.edit_application__subtitle}>Документы</h2>
        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Паспорт</label>
            <input
              className={style.edit_application__input}
              name="passport"
              value={formData.passport}
              onChange={handleChange}
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>ИНН</label>
            <input
              className={style.edit_application__input}
              name="inn"
              value={formData.inn}
              onChange={handleChange}
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>СНИЛС</label>
            <input
              className={style.edit_application__input}
              name="snils"
              value={formData.snils}
              onChange={handleChange}
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>ОМС</label>
            <input
              className={style.edit_application__input}
              name="oms"
              value={formData.oms}
              onChange={handleChange}
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Вод. удостоверение</label>
            <input
              className={style.edit_application__input}
              name="vodila"
              value={formData.vodila}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginLeft: '7px' }}>
          <button type="submit" className={style.edit_application__button}>Обновить</button>
          <button
            type="button"
            className={`${style.edit_application__button} ${style.edit_application__button_delete}`}
            onClick={handleDelete}
          >
            Удалить
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
