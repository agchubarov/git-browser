import React from 'react'
import { Link, useParams } from 'react-router-dom'

const RepositoryView = (props) => {
  const { userName } = useParams()

  return (
    <div>
      {props.repositoryList.map((repo) => (
        <div className="bg-indigo-400 text-white rounded p-2 mb-4" key={repo.id}>
          <Link to={`/${userName}/${repo.name}`}>{repo.name}</Link>
        </div>
      ))}
    </div>
  )
}

RepositoryView.propTypes = {}

export default React.memo(RepositoryView)
