import React from 'react'

export default function Manual() {
  return (
    <div className="w-screen h-screen fixed top-0 left-0">
      <embed src="/files/game-manual.pdf" type="application/pdf" width="100%" height="100%"/>
    </div>
  )
}
