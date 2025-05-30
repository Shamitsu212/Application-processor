import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import back from './image/arrow-left.svg'
import vivod from './image/badge-alert.svg'
import chat from './image/message-circle.svg'
import sendIcon from './image/send.svg'
import style from './css/Aplication.module.css'

function AplicationChat({ id, goback }) {
  const { Zayavkaid } = useParams()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const chatContainerRef = useRef(null)
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3000')

    ws.current.onopen = () => {
      console.log('WebSocket connected')
      setConnectionStatus('connected')
      ws.current.send(JSON.stringify({ type: 'subscribe', zayavkaId: Zayavkaid }))
      ws.current.send(JSON.stringify({ type: 'getMessages', zayavkaId: Zayavkaid }))
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Received WS data:', data)

        if (data.type === 'messages' && data.zayavkaId === Zayavkaid) {
          if (Array.isArray(data.messages)) {
            setMessages(data.messages.sort((a, b) => a.timestamp - b.timestamp))
          } else {
            console.error('Received messages is not an array:', data.messages)
          }
        } else if (data.type === 'message' && data.zayavkaId === Zayavkaid) {
          if (data.message) {
            setMessages(prev => {
              const existingIndex = prev.findIndex(
                msg => msg.pending && msg.timestamp === data.message.timestamp && msg.sender_idusers === data.message.sender_idusers
              )
              const newMessages = existingIndex !== -1
                ? prev.map((msg, idx) => idx === existingIndex ? { ...data.message, pending: false } : msg)
                : [...prev, { ...data.message, pending: false }]
              return newMessages.sort((a, b) => a.timestamp - b.timestamp)
            })
          }
        }
      } catch (err) {
        console.error('Error parsing message', err)
      }
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnectionStatus('error')
    }

    ws.current.onclose = () => {
      console.log('WebSocket disconnected')
      setConnectionStatus('disconnected')
    }

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'unsubscribe', zayavkaId: Zayavkaid }))
        ws.current.close()
      }
    }
  }, [Zayavkaid])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && ws.current && ws.current.readyState === WebSocket.OPEN) {
      const tempId = `temp-${Date.now()}`
      const newMessage = {
        message_id: tempId,
        message: message.trim(),
        timestamp: Date.now(),
        sender_idusers: id,
        pending: true,
      }

      setMessages(prev => [...prev, newMessage].sort((a, b) => a.timestamp - b.timestamp))
      ws.current.send(
        JSON.stringify({
          type: 'message',
          zayavkaId: Zayavkaid,
          message: {
            message: message.trim(),
            timestamp: newMessage.timestamp,
            sender_idusers: id,
          },
        })
      )
      setMessage('')
    }
  }

  return (
    <div className={style.aplication}>
      <h1 className={style.aplication__title}>Заявка</h1>
      <div className={style.aplication__container}>
        <button className={style.aplication__button_back} onClick={goback}>
          <img src={back} className={style.aplication__button_image} alt="Назад" />
        </button>
        <button className={style.aplication__button_chat}>
          <img src={chat} className={style.aplication__button_image} alt="Чат" />
        </button>
        <Link to={`/Aplication/${Zayavkaid}/vivod`}>
          <button className={style.aplication__button_vivod}>
            <img src={vivod} className={style.aplication__button_image} alt="Вывод" />
          </button>
        </Link>
        <h2 className={style.aplication__title}>Чат с отправителем</h2>
        <div className={style.aplication__chat} ref={chatContainerRef}>
          {messages.length === 0 ? (
            <div className={style.noMessages}>Нет сообщений</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.message_id || `temp-${msg.timestamp}`}
                className={`${style.aplication__message} ${
                  msg.sender_idusers === id ? style.aplication__message__sent : style.aplication__message__received
                } ${msg.pending ? style.pending : ''}`}
              >
                <div className={style.message__content}>{msg.message}</div>
                <div className={style.message__time}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {msg.pending && <span className={style.messageStatus}> (Отправка...)</span>}
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSendMessage} className={style.aplication__messageForm}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение..."
            className={style.messageForm__messageInput}
            disabled={connectionStatus !== 'connected'}
          />
          <button
            type="submit"
            className={style.messageForm__sendButton}
            disabled={!message.trim() || connectionStatus !== 'connected'}
          >
            <img src={sendIcon} className={style.sendButton__sendIcon} alt="Отправить" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default AplicationChat