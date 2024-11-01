import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const toggleFormMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setMessage('')
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }
  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }
  // Handle submit will be an asynchronous function that takes an event object.
  const handleSubmit = async (event) => {
    // We will use the event object to prevent the default behavior of the form on submission.
    // and we will take the opportunity now to clear any messages from the server
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      // declaring a data variable and pull it out of await in axios.post
      const { data} = await axios.post(
        //the first argument is the url we are posting to
        //the last segment depends on whether we are in login mode or in register mode
        `/api/auth/${isLogin ? 'login' : 'register'}`,
        {username, password}
      )
      if (isLogin) {
        localStorage.setItem('token', data.token)
        navigate('/stars')
      } else {
        setMessage(data.message)
      }

    } catch (err) {
      setError(err?.response?.data?.message ||
        'An error has occurred. Please try again.'
      )
    }
  }

  return (
    <div className="container">
      <div aria-live="polite">{message}</div>
      <div aria-live="assertive" style={{ color: 'red' }}>{error}</div>
      <h3>{isLogin ? 'Login' : 'Register'}
        <button onClick={toggleFormMode}>
          Switch to {isLogin ? 'Register' : 'Login'}
        </button>
      </h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
    </div>
  )
}
