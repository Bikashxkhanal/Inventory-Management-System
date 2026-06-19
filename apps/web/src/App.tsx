import  {useRef, useState, type JSX } from 'react'
import './App.css'
import {io} from 'socket.io-client'




function App() : JSX.Element {
  const [message, setMessage] = useState<string>('');
  const socketRef = useRef<any>(null);

  const userId =  Math.floor(Math.random() * 1000)

  if(!socketRef.current){
       socketRef.current = io("http://localhost:8000", {
        withCredentials : true,
      transportOptions : ['websocket']
  });
  }


  // socketRef.current.emit('connection', ()=> {
  //   console.log(`Connected with ID:${socketRef.current.id}`);
     
    
  // })

   socketRef.current.emit('register-user',userId);
  
  socketRef.current.on('receive-message', (data : string) => {
      console.log(data);
  })
  
  const handleSubmit = (e : React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(message);
      setMessage("")

       socketRef.current.emit('user-to-server', {
    senderId : userId,
    receiverID : 102,
    message : message
  });
      
      


  }
  return (<>
  <form onSubmit={(e) => handleSubmit(e)}>
    <input type='text' 
    className='px-5 py-2 border-2 rounded-xl mt-10 ml-20'
    name='user-input' 
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    />
    <button>
      send
    </button>
    </form>
    </>
  )
}

export default App
