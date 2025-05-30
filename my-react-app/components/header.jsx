import { Link } from 'react-router-dom';
import setting from './image/settings.svg';
import history from './image/file-clock.svg';
import watch from './image/file.svg';
import send from './image/file-plus.svg';
import logout from './image/log-out.svg';
import cabinet from './image/user.svg';

import style from './css/header.module.css';

function Siteheader({ LogOut, goToCabinet, role }) {
  const showAdminLink = role === 'Администратор' || role === 'Модератор';

  return (
    <div className={style.header}>
      <Link to="/sendpage">
        <img src={send} className={`${style.header__pic} ${style.header__pic_first}`} alt="Отправить" />
      </Link>
      <Link to="/history">
        <img src={history} className={style.header__pic} alt="История" />
      </Link>
      <Link to="/watchpage">
        <img src={watch} className={style.header__pic} alt="Просмотр" />
      </Link>
      <img src={cabinet} className={style.header__pic} onClick={goToCabinet} alt="Кабинет" />
      {showAdminLink && (
        <Link to="/admin">
          <img src={setting} className={style.header__pic} alt="Настройки" />
        </Link>
      )}
      <img src={logout} className={`${style.header__pic} ${style.header__pic_last}`} onClick={LogOut} alt="Выйти" />
    </div>
  );
}

export default Siteheader;
