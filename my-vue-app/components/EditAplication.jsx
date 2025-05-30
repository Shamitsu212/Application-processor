import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import style from './css/adminadd.module.css';

function EditAplication({ zayavki }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shortpage: '',
    location: '',
    status: '',
    sender_idusers: '',
    executor_id: '',
    text: '',
    type: '',
    otschet: ''
  });

  useEffect(() => {
    if (zayavki && id) {
      const zayavka = zayavki.find(z => String(z.id) === String(id));
      if (zayavka) {
        setFormData({
          shortpage: zayavka.shortpage || '',
          location: zayavka.location || '',
          status: zayavka.status || '',
          sender_idusers: zayavka.sender_idusers || '',
          executor_id: zayavka.executor_id === null ? '' : zayavka.executor_id,
          text: zayavka.text || '',
          type: zayavka.type || '',
          otschet: zayavka.otschet || ''
        });
      }
    }
  }, [zayavki, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      sender_idusers: formData.sender_idusers === '' ? null : Number(formData.sender_idusers),
      executor_id: formData.executor_id === '' ? null : Number(formData.executor_id),
      otschet: formData.otschet || null
    };

    try {
      await axios.put(`http://localhost:3000/api/zayavki/${id}`, dataToSend);
      alert('Заявка успешно обновлена!');
      navigate('/admin');
    } catch (error) {
      alert('Ошибка при обновлении заявки');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        await axios.delete(`http://localhost:3000/api/zayavki/${id}`);
        alert('Заявка успешно удалена!');
        navigate('/admin');
      } catch (error) {
        alert('Ошибка при удалении заявки');
        console.error(error);
      }
    }
  };

  return (
    <div className={style.edit_application}>
      <h1 className={style.edit_application__title}>Редактирование заявки</h1>
      <form className={style.edit_application__form} onSubmit={handleSubmit}>
        <h2 className={style.edit_application__subtitle}>Данные заявки</h2>

        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Заголовок</label>
            <input
              className={style.edit_application__input}
              name="shortpage"
              value={formData.shortpage}
              onChange={handleChange}
              required
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Локация</label>
            <select
              className={style.edit_application__input}
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>Выберите локацию</option>
              <option value="цех1">цех1</option>
              <option value="цех2">цех2</option>
              <option value="цех3">цех3</option>
              <option value="цех4">цех4</option>
            </select>
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Состояние</label>
            <select
              className={style.edit_application__input}
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>Выберите состояние</option>
              <option value="В процессе выполнения">В процессе выполнения</option>
              <option value="Выполнена">Выполнена</option>
              <option value="Не выполнена">Не выполнена</option>
              <option value="Доп.решение">Доп.решение</option>
            </select>
          </div>
        </div>

        <div className={style.edit_application__field_group}>
          <div className={style.edit_application__field_wrapper}>
            <label>Тип заявки</label>
            <select
              className={style.edit_application__input}
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>Выберите тип</option>
              <option value="Поломка рабочего компьютера">Поломка рабочего компьютера</option>
              <option value="Перепад электроэнергии">Перепад электроэнергии</option>
              <option value="Поломка компьютерного оборудования">Поломка компьютерного оборудования</option>
            </select>
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Айди отправителя</label>
            <input
              className={style.edit_application__input}
              name="sender_idusers"
              type="number"
              value={formData.sender_idusers}
              onChange={handleChange}
              required
              placeholder="ID отправителя"
            />
          </div>
          <div className={style.edit_application__field_wrapper}>
            <label>Айди исполнителя</label>
            <input
              className={style.edit_application__input}
              name="executor_id"
              type="number"
              value={formData.executor_id}
              onChange={handleChange}
              placeholder="Пусто"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
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

export default EditAplication;
