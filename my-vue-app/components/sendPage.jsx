import { useState } from 'react';
import axios from 'axios';
import style from './css/sendPage.module.css';

function Sendpage({id}) {
  const [shortpage, setshortpage] = useState('');
  const [text, settext] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('В процессе выполнения');
  const [chatMessage, setChatMessage] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    shortpage,
    text,
    location,
    type,
    status,
    sender_idusers: id,
    executor_id: null, 
    chat: []           
  };

  try {
    const response = await axios.post('http://localhost:3000/api/zayavki', data);
    alert('Заявка успешно отправлена!');
    
    // Очистить форму
    setshortpage('');
    settext('');
    setLocation('');
    setType('');
    setChatMessage('');
  } catch (error) {
    alert('Ошибка при отправке заявки');
    console.error(error);
  }
};


  return (
    <div className={style.sendpage}>
      <h1 className={style.sendpage__title}>Отправка заявок</h1>
      <form className={style.sendpage__form} onSubmit={handleSubmit}>
        <label className={style.sendpage__label}>Опишите проблему кратко</label>
        <input
          type="text"
          className={style.sendpage__input}
          placeholder="Введите кратко суть проблемы"
          value={shortpage}
          onChange={(e) => setshortpage(e.target.value)}
        />

        <label className={style.sendpage__label}>Опишите проблему более детально</label>
        <textarea
          className={style.sendpage__textarea}
          placeholder="Опишите подробно, что случилось и как воспроизвести проблему"
          value={text}
          onChange={(e) => settext(e.target.value)}
        />

        <div className={style.sendpage__selects}>
          <select
            value={location}
            className={style.sendpage__select}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="" disabled hidden>
              Выберите место поломки
            </option>
            <option value="Цех1" className={style.sendpage__option}>Цех 1</option>
            <option value="Цех2" className={style.sendpage__option}>Цех 2</option>
            <option value="Цех3" className={style.sendpage__option}>Цех 3</option>
            <option value="Цех4" className={style.sendpage__option}>Цех 4</option>
          </select>

          <select
            value={type}
            className={style.sendpage__select}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="" disabled hidden>
              Выберите тип поломки
            </option>
            <option value="Поломка компьютерного оборудования" className={style.sendpage__option}>
              Поломка компьютерного оборудования
            </option>
            <option value="Перепад электроэнергии" className={style.sendpage__option}>
              Перепад электроэнергии
            </option>
            <option value="Поломка рабочего компьютера" className={style.sendpage__option}>
              Поломка рабочего компьютера
            </option>
          </select>
        </div>

        <button type="submit" className={style.sendpage__button}>
          Отправить заявку
        </button>
      </form>
    </div>
  );
}

export default Sendpage;
