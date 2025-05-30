import { useState } from 'react';
import axios from 'axios';
import style from './css/adminadd.module.css';

function AdminPageAdd() {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    firstName: '',
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
    driverLicense: '',
  });

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
      await axios.post('http://localhost:3000/api/users', formData);
      alert('Пользователь успешно добавлен!');
      setFormData({
        login: '',
        password: '',
        firstName: '',
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
        driverLicense: '',
      });
    } catch (error) {
      alert('Ошибка при добавлении пользователя');
    }
  };

  return (
    <div className={style.edit_application}>
      <h1 className={style.edit_application__title}>Добавление пользователя</h1>
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
              type="text"
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
              name="firstName"
              value={formData.firstName}
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

        <h2 className={style.edit_application__subtitle}>Контактная информация</h2>
        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Почта</label>
            <input
              className={style.edit_application__input}
              name="email"
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
              name="driverLicense"
              value={formData.driverLicense}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className={style.edit_application__button}>Добавить</button>
      </form>
    </div>
  );
}

export default AdminPageAdd;
