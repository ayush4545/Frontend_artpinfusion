import React from 'react'
import { WithErrorBoundariesWrapper } from './WithErrorBoundaries'

const Loader = () => {
  return (
    <div className='w-full flex items-center justify-center my-5'>

        <div className="spinner"></div>
    </div>
  )
}

export default WithErrorBoundariesWrapper( Loader);