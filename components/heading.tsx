import React from 'react'

interface Text {
    text : string
}

export const Heading = ({text} :Text) => {
  return <div className="text-3xl font-sans text-center">{text}</div>
}

