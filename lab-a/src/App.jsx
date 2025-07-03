import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ListarUsuario from './componentes/ListarUsuario'





function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
<ListarUsuario></ListarUsuario>
    </>
  )
}

export default App;
