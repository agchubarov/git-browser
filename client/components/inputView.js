import React, { useState } from 'react'
import { history } from '../redux'

const InputView = () => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onClick = () => {
    history.push(`/${value}`)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form className="items-center justify-between">
        <div className="mb-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Username"
            value={value}
            onChange={onChange}
            id="input-field"
          />
        </div>
        <div className="mb-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            id="search-button"
            onClick={onClick}
          >
            Go to user
          </button>
        </div>
      </form>
    </div>
  )
}

InputView.propTypes = {}

export default React.memo(InputView)
