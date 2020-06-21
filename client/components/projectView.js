import React from 'react'
import ReactMarkdown from 'react-markdown'

const ProjectView = (props) => {
  return (
    <div id="description">
      <ReactMarkdown source={props.projectDescription} />
    </div>
  )
}

ProjectView.propTypes = {}

export default ProjectView
