import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './css/cabinet.module.css';
import image from './image/user.png';

function CabinetProfile({ name, surname, fam, role, email, telephone, passport, INN, snils, OMS, vodila }) {
  const [dock, setDock] = useState(false);

  const [dpass, setDpass] = useState('******');
  const [dINN, setDINN] = useState('******');
  const [dsnils, setDSnils] = useState('******');
  const [dOMS, setDOMS] = useState('******');
  const [dvodila, setDVodila] = useState('******');

  const dockumentsvision = () => {
    if (dock) {
      setDpass('******');
      setDINN('******');
      setDSnils('******');
      setDOMS('******');
      setDVodila('******');
      setDock(false);
    } else {
      setDpass(passport);
      setDINN(INN);
      setDSnils(snils);
      setDOMS(OMS);
      setDVodila(vodila);
      setDock(true);
    }
  };

  return (
    <div className={style.profile}>
      <img className={style['profile__worker-pic']} src={image} alt="User" />
      <h1 className={style['profile__title']}>Личный кабинет</h1>
      <div className={style['profile__input-container']}>
        <div className={style['input-container__inputs']}>
          <div className={style['input-container__input-group']}>
            <label>Имя</label>
            <input disabled value={name} className={style['input-container__input']} />
          </div>
          <div className={style['input-container__input-group']}>
            <label>Отчество</label>
            <input disabled value={surname} className={style['input-container__input']} />
          </div>
          <div className={style['input-container__input-group']}>
            <label>Фамилия</label>
            <input disabled value={fam} className={style['input-container__input']} />
          </div>
        </div>

        <div className={style['input-container__inputs']}>
          <div className={style['input-container__input-group']}>
            <label>Роль</label>
            <input disabled value={role} className={style['input-container__input']} />
          </div>
          <div className={style['input-container__input-group']}>
            <label>Почта</label>
            <input disabled value={email} className={style['input-container__input']} />
          </div>
          <div className={style['input-container__input-group']}>
            <label>Номер Телефона</label>
            <input disabled value={telephone} className={style['input-container__input']} />
          </div>
        </div>

        <div className={style['input-container__inputs']}>
          <div className={style['input-container__input-group']}>
            <button className={style['profile__button']} onClick={dockumentsvision}>+</button>
          </div>
          <div className={style['input-container__input-group']}>
            <label>Паспорт</label>
            <input disabled value={dpass} className={style['input-container__input']} />
          </div>
          <div className={style['input-container__input-group']}>
            <label>ИНН</label>
            <input disabled value={dINN} className={style['input-container__input']} />
          </div>
        </div>

        <div className={style['input-container__inputs']}>
          <div className={style['input-container__input-group']}>
            <label>Снилс</label>
            <input disabled value={dsnils} className={style['input-container__input']} />
          </div>
          <div className={style['input-container__input-group']}>
            <label>ОМС</label>
            <input disabled value={dOMS} className={style['input-container__input']} />
          </div>
          <div className={style['input-container__input-group']}>
            <label>Вод.удостоверение</label>
            <input disabled value={dvodila} className={style['input-container__input']} />
          </div>

          <Link to="/cabinet/myAplication" className={style['profile__my-button']}>
            <button>Мои заявки</button>
          </Link>
          <Link to="/cabinet/workedAplication" className={style['profile__work-button']}>
            <button>Заявки в работе</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CabinetProfile;
