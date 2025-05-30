import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Router, Navigate } from 'react-router-dom';
import axios from 'axios';

import AuthorizationPage from '../components/AuthorizationPage.jsx';
import CabinetProfile from '../components/CabinetProfile.jsx';
import Siteheader from '../components/header.jsx';
import Sendpage from '../components/sendPage.jsx'
import Watchpage from '../components/Watchpage.jsx'
import Historypage from '../components/historypage.jsx'
import Mypage from '../components/Mypage.jsx'
import AplicationPage from '../components/AplicationPage.jsx'
import AplicationVivod from '../components/AplicationVivod.jsx'
import AdminPage from '../components/AdminPage.jsx'
import AdminPageAdd from '../components/AdminPageAdd.jsx'
import EditUser from '../components/EditUser.jsx'
import EditAplication from '../components/EditAplication.jsx'
import AplicationChat from '../components/AplicationChat.jsx'
import WorkedAplication from '../components/WorkedAplication.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'



import './App.css'

function App() {
  //****пользователь****

  //данные аккаунта
  const [id, setId] = useState(0);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  //Инициалы
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [fam, setFam] = useState('');

  //Пол, дата рождения
  const [birthday, setBirthday] = useState('');
  const [sex, setSex] = useState('');

  //Профессия
  const [roleid, setRoleid] = useState(0);
  const [role, setRole] = useState('');

  //Контактные данные
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  //Документы
  const [passport, setPassport] = useState('');
  const [INN, setINN] = useState('');
  const [snils, setSnils] = useState('');
  const [OMS, setOMS] = useState('');
  const [vodila, setVodila] = useState('');

  //Проверка на авторизацию
  const [isAuthentificated, setIsAutheticated] = useState(false);  


  //****заявка****
  const [zayavki, setZayavki] = useState([]);



  //****Навигация по сайту****
  const navigate = useNavigate();

  //Авторизация
  const goToAuth = () => navigate(``);

  //Кабинет
  const goToCabinet = () => navigate(`/cabinet/${id}/profile`);

  //Заявка
  const goback = () => navigate(-1)

  //Админ панель
  const goToAdduser = () => navigate(`/admin/users/add`);

  //****функции****

  const LogOut = () => {

    setId(0)
    setLogin('')
    setPassword('')

    setName('')
    setSurname('')
    setFam('')

    setBirthday('')
    setSex('')

    setRoleid(0)
    setRole('')

    setEmail('')
    setTelephone('')

    setPassport('')
    setINN('')
    setSnils('')
    setOMS('')
    setVodila('')

    setIsAutheticated(false)

    goToAuth();
  } 
const LogIn = async (username, password) => {
  try {
    const response = await axios.get('http://localhost:3000/api/user', {
      params: {
        login: username,
        password: password
      }
    });

    const user = response.data;
    console.log(user)

    if (!user || user.message) {
      alert(user.message || 'Данные не корректны!');
      return;
    }

    setId(user.id);
    setLogin(user.login);
    setPassword(user.password);

    setName(user.firstname);
    setSurname(user.middleName);
    setFam(user.lastName);

    setBirthday(user.birthday);
    setSex(user.sex);

    setRoleid(user.roleId);
    setRole(user.profession);

    setEmail(user.email);
    setTelephone(user.phone);

    setPassport(user.passport);
    setINN(user.inn);
    setSnils(user.snils);
    setOMS(user.oms);
    setVodila(user.vodila);

    setIsAutheticated(true);

    console.log('Данные пользователя:');
    console.log('ID:', user.id);
    console.log('Логин:', user.login);
    console.log('Пароль:', user.password);

    console.log('Имя:', user.firstname);
    console.log('Отчество:', user.middleName);
    console.log('Фамилия:', user.lastName);

    console.log('Дата рождения:', user.birthday);
    console.log('Пол:', user.sex);

    console.log('ID роли:', user.roleId);
    console.log('Профессия (роль):', user.profession);

    console.log('Email:', user.email);
    console.log('Телефон:', user.phone);

    console.log('Паспорт:', user.passport);
    console.log('ИНН:', user.inn);
    console.log('СНИЛС:', user.snils);
    console.log('ОМС:', user.oms);
    console.log('Водительское удостоверение:', user.vodila);

    
  
    navigate(`/cabinet/${user.id}/profile`);
  } 
  catch (error) 
  {
    alert('Ошибка при авторизации');
    console.error(error);
  }
};

  // Получение заявок
const fetchZayavki = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/zayavki');
    setZayavki(response.data);
  } catch (error) {
    console.error('Ошибка при получении заявок:', error);
  }
};
useEffect(() => {
  fetchZayavki();
}, []);

useEffect(() => {
  console.log(zayavki);
}, [zayavki]); 


  return (
    <>
    <Siteheader goToCabinet={goToCabinet} LogOut={LogOut} role={role}/>
      <Routes>

        <Route 
        path = "/" 
        element =  
        {
          <AuthorizationPage
           LogIn = {LogIn}
          />
        }
        />

        <Route
    path="/cabinet/:id/profile"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <CabinetProfile
          name={name} surname={surname} fam={fam}
          role={role} email={email} telephone={telephone}
          passport={passport} INN={INN} snils={snils} OMS={OMS} vodila={vodila}
        />
      </ProtectedRoute>
    }
  />
  <Route
    path="/sendpage"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <Sendpage id={id} fetchZayavki={fetchZayavki} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/watchpage"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <Watchpage zayavki={zayavki} fetchZayavki={fetchZayavki} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/history"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <Historypage zayavki={zayavki} fetchZayavki={fetchZayavki} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/cabinet/myAplication"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <Mypage zayavki={zayavki} id={id} fetchZayavki={fetchZayavki} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/Aplication/:Zayavkaid"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <AplicationPage zayavki={zayavki} id={id} goback={goback} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/Aplication/:Zayavkaid/vivod"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <AplicationVivod zayavki={zayavki} id={id} goback={goback} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/Aplication/:Zayavkaid/chat"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <AplicationChat zayavki={zayavki} id={id} goback={goback} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <AdminPage zayavki={zayavki} goback={goback} goToAdduser={goToAdduser} fetchZayavki={fetchZayavki} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/users/add"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <AdminPageAdd />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/users/:id/edit"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <EditUser />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin/aplication/:id/edit"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <EditAplication zayavki={zayavki} />
      </ProtectedRoute>
    }
  />
  <Route
    path="/cabinet/workedAplication"
    element={
      <ProtectedRoute isAuthentificated={isAuthentificated}>
        <WorkedAplication zayavki={zayavki} id={id} fetchZayavki={fetchZayavki} />
      </ProtectedRoute>
    }
  />

</Routes>
    </>
  )
}

export default App
