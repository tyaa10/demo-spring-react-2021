import React, {useState, useEffect} from 'react'
import './App.css'
import OrderModel from './models/OrderModel'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const currentOrders: OrderModel[] = []

interface IProps {}
/* interface IState {
  orders: OrderModel[]
} */

function App (props: IProps) {
    const [orders, setOrders] = useState<OrderModel[]>([])
    useEffect(
        () => {
            // создаем объект для подключения,
            // указывая конечную точку подписки
            const socket = new SockJS('http://localhost:8081/broker/ws')
            // инициализируем объект,
            // при помощи которого можно отправлять сообщения на точку назначения
            const stompClient = Stomp.over(socket)
            // запуск соединения (подписки)
            stompClient.connect({},  (frame) => {
                console.log('Connected: ' + frame)
                // подписка на рассылку сообщений с точки назначения /topic/greetings
                stompClient.subscribe('/topic/orders', (data) => {
                    // когда придет сообщение
                    console.log(data)
                    currentOrders.unshift(JSON.parse(data.body))
                    setOrders(Object.assign([], currentOrders))
                })
            })
        },
        []
        )
    return (
      <ul>
          {orders.map(order => (
              <li key={order.id}>
                  {order.id}
                  <ul>
                      {order.items.map(item => (
                          <li key={item.name}>
                              Name: {item.name}; Price: {item.price}; Quantity: {item.quantity}
                          </li>
                      ))}
                  </ul>
              </li>
          ))}
      </ul>
    );
}

export default App;
