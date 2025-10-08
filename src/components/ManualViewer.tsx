import React from 'react' 
import gameManual from "/game-manual.pdf"
export default function GameManual() {
  return (
    <div className='w-full'>
        <iframe src={gameManual} className='w-full h-screen'></iframe>
    </div>
  )
}
