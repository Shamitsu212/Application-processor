const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// SQL
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'diplomka',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// HTTP + WebSocket Server
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

console.log('WebSocket сервер запущен на ws://localhost:3000');

const wsClients = {}; // { zayavkaId: Set<ws> }

wss.on('connection', (ws) => {
  let subscribedZayavkaId = null;

  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg);

      if (data.type === 'subscribe') {
        subscribedZayavkaId = String(data.zayavkaId);
        if (!wsClients[subscribedZayavkaId]) {
          wsClients[subscribedZayavkaId] = new Set();
        }
        wsClients[subscribedZayavkaId].add(ws);
      } else if (data.type === 'unsubscribe') {
        const zId = String(data.zayavkaId);
        if (wsClients[zId]) wsClients[zId].delete(ws);
      } else if (data.type === 'getMessages') {
        // Получение истории сообщений по заявке
        const { zayavkaId } = data;
        const [rows] = await pool.query(
          'SELECT id, message, timestamp, sender_idusers FROM chat WHERE message_id = ? ORDER BY timestamp ASC',
          [zayavkaId]
        );
        ws.send(JSON.stringify({
          type: 'messages',
          zayavkaId,
          messages: rows.map(row => ({
            ...row,
            timestamp: new Date(row.timestamp * 1000).getTime()
          }))
        }));
      } else if (data.type === 'message') {
        const { zayavkaId, message: msg } = data;

        const [result] = await pool.query(
          'INSERT INTO chat (message_id, message, timestamp, sender_idusers) VALUES (?, ?, ?, ?)',
          [zayavkaId, msg.message, Math.floor(msg.timestamp / 1000), msg.sender_idusers]
        );

        const savedMessage = {
          id: result.insertId,
          message: msg.message,
          timestamp: msg.timestamp,
          sender_idusers: msg.sender_idusers
        };

        const zId = String(zayavkaId);
        if (wsClients[zId]) {
          for (const client of wsClients[zId]) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'message',
                zayavkaId,
                message: savedMessage
              }));
            }
          }
        }
      }
    } catch (e) {
      console.error('WebSocket error:', e);
    }
  });

  ws.on('close', () => {
    if (subscribedZayavkaId && wsClients[subscribedZayavkaId]) {
      wsClients[subscribedZayavkaId].delete(ws);
    }
  });
});

// ==== API Routes ====

app.get('/api/user', async (req, res) => {
  const { login, password } = req.query;
  if (!login || !password) {
    return res.status(400).json({ message: 'Не указан логин или пароль' });
  }
  try {
    const [rows] = await pool.query(`SELECT 
      u.idusers AS id, u.login, u.pass AS password, u.name AS firstname, u.surename AS middleName, 
      u.fam AS lastName, u.birthday, u.sex, u.role_idrole AS roleId, r.name AS profession, 
      c.mail AS email, c.tel AS phone, d.passport, d.inn, d.snils, d.oms, d.vodila
      FROM users u
      LEFT JOIN role r ON u.role_idrole = r.idrole
      LEFT JOIN comunicate c ON u.comunicate_idcomunicate = c.idcomunicate
      LEFT JOIN doki d ON u.doki_iddoki = d.iddoki
      WHERE u.login = ? AND u.pass = ? LIMIT 1`, [login, password]);
    if (rows.length === 0) return res.status(404).json({ message: 'Пользователь не найден' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT 
      u.idusers AS id, u.login, u.pass AS password, u.name AS firstname, u.surename AS middleName, 
      u.fam AS lastName, u.birthday, u.sex, u.role_idrole AS roleId, r.name AS profession, 
      c.mail AS email, c.tel AS phone, d.passport, d.inn, d.snils, d.oms, d.vodila
      FROM users u
      LEFT JOIN role r ON u.role_idrole = r.idrole
      LEFT JOIN comunicate c ON u.comunicate_idcomunicate = c.idcomunicate
      LEFT JOIN doki d ON u.doki_iddoki = d.iddoki`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const {
    login, password, firstName, middleName, lastName,
    birthday, sex, profession, email, phone,
    passport, inn, snils, oms, driverLicense
  } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [comRes] = await connection.query(
      'INSERT INTO comunicate (mail, tel) VALUES (?, ?)', [email, phone]);
    const comunicate_id = comRes.insertId;

    const [dokiRes] = await connection.query(
      'INSERT INTO doki (passport, inn, snils, oms, vodila) VALUES (?, ?, ?, ?, ?)',
      [passport, inn, snils, oms, driverLicense]);
    const doki_id = dokiRes.insertId;

    let role_id = null;
    if (profession) {
      const [roleRows] = await connection.query(
        'SELECT idrole FROM role WHERE name = ? LIMIT 1', [profession]);
      if (roleRows.length > 0) {
        role_id = roleRows[0].idrole;
      }
    }

    const [userRes] = await connection.query(`INSERT INTO users
      (login, pass, name, surename, fam, birthday, sex, role_idrole, comunicate_idcomunicate, doki_iddoki)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      login, password, firstName, middleName, lastName,
      birthday || null, sex || null, role_id, comunicate_id, doki_id
    ]);

    await connection.commit();
    res.status(201).json({ message: 'Пользователь успешно добавлен', userId: userRes.insertId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Ошибка при добавлении пользователя', error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/zayavki', async (req, res) => {
  try {
    const [zayavki] = await pool.query(`SELECT 
      z.id, z.shortpage, z.type, z.status, z.text, z.otschet, z.location, 
      z.sender_idusers, z.executor_id, u1.name AS sender_name, u2.name AS executor_name
      FROM zayavki z
      LEFT JOIN users u1 ON z.sender_idusers = u1.idusers
      LEFT JOIN users u2 ON z.executor_id = u2.idusers
      ORDER BY z.id DESC`);

    if (!zayavki.length) return res.json([]);

    const ids = zayavki.map(z => z.id);
    const [chats] = await pool.query(`SELECT 
      c.id, c.message_id, c.message, c.timestamp, c.sender_idusers, u.name AS sender_name
      FROM chat c
      LEFT JOIN users u ON c.sender_idusers = u.idusers
      WHERE c.message_id IN (?) ORDER BY c.timestamp ASC`, [ids]);

    const chatMap = {};
    chats.forEach(msg => {
      if (!chatMap[msg.message_id]) chatMap[msg.message_id] = [];
      chatMap[msg.message_id].push({
        id: msg.id, message: msg.message, timestamp: msg.timestamp,
        sender_idusers: msg.sender_idusers, sender_name: msg.sender_name
      });
    });

    const result = zayavki.map(z => ({ ...z, chat: chatMap[z.id] || [] }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
});

app.post('/api/zayavki', async (req, res) => {
  const {
    shortpage = '', text = '', location = '', type = '', status = '',
    sender_idusers = '', executor_id = null, chat = []
  } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [zayavkaResult] = await connection.query(`INSERT INTO zayavki
      (shortpage, type, status, text, location, sender_idusers, executor_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [shortpage, type, status, text, location, sender_idusers, executor_id]);

    const zayavki_id = zayavkaResult.insertId;

    if (Array.isArray(chat) && chat.length > 0) {
      const chatValues = chat.map(msg => [
        zayavki_id, msg.message || '', Math.floor((msg.timestamp || Date.now()) / 1000), msg.sender_idusers || ''
      ]);
      const placeholders = chatValues.map(() => '(?, ?, ?, ?)').join(', ');
      const flatValues = chatValues.flat();

      await connection.query(
        `INSERT INTO chat (message_id, message, timestamp, sender_idusers) VALUES ${placeholders}`,
        flatValues
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Заявка и чат успешно сохранены', zayavki_id });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Ошибка при сохранении заявки', error: error.message });
  } finally {
    connection.release();
  }
});

app.put('/api/zayavki/:id', async (req, res) => {
  const id = req.params.id;
  const { shortpage, type, status, text, location, sender_idusers, executor_id, otschet } = req.body;

  try {
    const [result] = await pool.query(`UPDATE zayavki SET
      shortpage = ?, type = ?, status = ?, text = ?, location = ?, 
      sender_idusers = ?, executor_id = ?, otschet = ? WHERE id = ?`,
      [shortpage, type, status, text, location, sender_idusers, executor_id, otschet, id]);
    res.json({ message: 'Заявка обновлена', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при обновлении заявки', error: err.message });
  }
});

app.delete('/api/zayavki/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM chat WHERE message_id = ?', [id]);
    await pool.query('DELETE FROM zayavki WHERE id = ?', [id]);
    res.json({ message: 'Заявка и чат удалены' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении заявки', error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const {
    login, password, firstname, middleName, lastName,
    birthday, sex, profession, email, phone,
    passport, inn, snils, oms, vodila
  } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [userRows] = await connection.query(
      'SELECT comunicate_idcomunicate, doki_iddoki FROM users WHERE idusers = ?',
      [id]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { comunicate_idcomunicate, doki_iddoki } = userRows[0];

    await connection.query(
      'UPDATE comunicate SET mail = ?, tel = ? WHERE idcomunicate = ?',
      [email, phone, comunicate_idcomunicate]
    );

    await connection.query(
      'UPDATE doki SET passport = ?, inn = ?, snils = ?, oms = ?, vodila = ? WHERE iddoki = ?',
      [passport, inn, snils, oms, vodila, doki_iddoki]
    );

    let role_id = null;
    if (profession) {
      const [roleRows] = await connection.query(
        'SELECT idrole FROM role WHERE name = ? LIMIT 1',
        [profession]
      );
      if (roleRows.length > 0) {
        role_id = roleRows[0].idrole;
      }
    }

    await connection.query(
      `UPDATE users SET 
        login = ?, pass = ?, name = ?, surename = ?, fam = ?, 
        birthday = ?, sex = ?, role_idrole = ?
      WHERE idusers = ?`,
      [
        login, password, firstname, middleName, lastName,
        birthday || null, sex || null, role_id, id
      ]
    );

    await connection.commit();
    res.json({ message: 'Пользователь успешно обновлен' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Ошибка при обновлении пользователя', error: error.message });
  } finally {
    connection.release();
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [userRows] = await connection.query(
      'SELECT comunicate_idcomunicate, doki_iddoki FROM users WHERE idusers = ?',
      [id]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { comunicate_idcomunicate, doki_iddoki } = userRows[0];

    await connection.query('DELETE FROM users WHERE idusers = ?', [id]);

    await connection.query('DELETE FROM comunicate WHERE idcomunicate = ?', [comunicate_idcomunicate]);
    await connection.query('DELETE FROM doki WHERE iddoki = ?', [doki_iddoki]);

    await connection.commit();
    res.json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Ошибка при удалении пользователя', error: error.message });
  } finally {
    connection.release();
  }
});

// Запуск сервера
server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
