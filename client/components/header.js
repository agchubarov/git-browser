import React from 'react'
import { Link, useParams } from 'react-router-dom'

const Header = () => {
  const { userName, repositoryName } = useParams()
  // const length = props.projectList.length()

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div
        id="repository-name"
        className="flex items-center px-3 py-2 text-teal-200 border-teal-400 hover:text-white hover:border-white"
      >
        {repositoryName || userName || 'Willkommen!'}
      </div>

      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {userName && (
            <Link
              id="go-back"
              to="/"
              className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              Go Home, Yankee
            </Link>
          )}
          {repositoryName && (
            <Link
              id="go-repository-list"
              to={`/${userName}`}
              className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              Go to repository list
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

Header.propTypes = {}

export default React.memo(Header)
