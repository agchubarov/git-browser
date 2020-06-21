import React, { useState, useEffect } from 'react'
import { Switch, Route, useParams } from 'react-router-dom'
import axios from 'axios'

import Head from './head'
import Header from './header'
import ProjectView from './projectView'
import InputView from './inputView'
import RepositoryView from './repositoryView'

const Home = () => {
  const { userName, repositoryName } = useParams()

  const url = `https://api.github.com/users/${userName}/repos`
  const urlReadme = `https://api.github.com/repos/${userName}/${repositoryName}/readme`

  const [repositoryList, setRepositoryList] = useState([])

  useEffect(() => {
    if (typeof userName !== 'undefined') {
      axios.get(url).then((it) => {
        setRepositoryList(it.data.map((repo) => ({ name: repo.name, id: repo.id })))
      })
    }
  }, [url, userName])

  const [projectDescription, setProjectDescription] = useState('')

  useEffect(() => {
    if (typeof userName !== 'undefined' && typeof repositoryName !== 'undefined') {
      axios.get(urlReadme).then(({ data }) => {
        axios.get(data.download_url).then(({ data: rawdata }) => {
          setProjectDescription(rawdata)
        })
      })
    }
  }, [repositoryName, urlReadme, userName])

  return (
    <div>
      <Head title="Home" />
      <Header />
      <Switch>
        <Route exact path="/" component={() => <InputView />} />
        <Route
          exact
          path="/:userName"
          component={() => <RepositoryView repositoryList={repositoryList} />}
        />
        <Route
          exact
          path="/:userName/:repositoryName"
          component={() => <ProjectView projectDescription={projectDescription} />}
        />
      </Switch>
    </div>
  )
}

Home.propTypes = {}

export default Home
