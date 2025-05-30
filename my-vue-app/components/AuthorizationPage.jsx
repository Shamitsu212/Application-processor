import { useState} from 'react'

import style from './css/auth.module.css';

function AuthorizationPage({ LogIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await LogIn(username, password);
    };

    return (
        <div className={style.container}>
            <h1 className={style.container__title}>Войти в личный кабинет</h1>
            <form className={style.container} onSubmit={handleSubmit}>
                <input
                    placeholder="Введите логин"
                    className={style.container__input}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    placeholder="Введите пароль"
                    className={style.container__input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={style.container__button} type="submit">Войти</button>
            </form>
        </div>
    );
}

export default AuthorizationPage;
