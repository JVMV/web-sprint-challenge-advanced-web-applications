import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'
import {AuthRoute} from './AuthRoute'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [currentArticle, setCurrentArticle] = useState(null)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    localStorage.getItem('token') && localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    axios.post(loginUrl, {username: username, password: password})
      .then(res => {
        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        setSpinnerOn(false)
        redirectToArticles()
      })
      .catch(err => {
        console.log(err)
      })
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = (articleArray, message) => {
    setArticles(articleArray)
    setMessage(message)
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
      axiosWithAuth().post(articlesUrl, article)
        .then(res => {
          setArticles(articles.concat(res.data.article))
          setMessage(res.data.message)
        })
        .catch(err => {
          setMessage(err.message)
        })
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = (values) => {
    const { article_id, text, title, topic } = values
    axiosWithAuth().put(articlesUrl + `/${article_id}`, { text: text, title: title, topic: topic })
      .then(res => {
        const { article, message } = res.data
        // console.log(article, message)
        const newData = articles.map(art => {
          if(article.article_id === art.article_id) {
            return article
          } else {
            return art
          }
        })
        setArticles(newData)
        setMessage(message)

      })
      .catch(err => {
        console.log(err)
      })
    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
    axiosWithAuth().delete(articlesUrl + '/' + article_id)
      .then(res => {
        setMessage(res.data.message)
        const newData = articles.filter(art => art.article_id !== article_id)
        setArticles(newData)
      })
      .catch(err => {
        console.log(err)
      })
    // ✨ implement
  }

  const getCurrentArticle = (id) => {
    articles.map(art => {
      if(art.article_id === id) {
        setCurrentArticle(art)
      }
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={currentArticle}
                currentArticleId={currentArticleId}
                getCurrentArticle={getCurrentArticle}
              />
              <AuthRoute>
                <Articles 
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </AuthRoute>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
