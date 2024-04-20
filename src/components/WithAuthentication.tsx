import React, { ReactElement, ReactNode } from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { WithErrorBoundariesWrapper } from './WithErrorBoundaries'

const WithAuthentication = ({children}:ReactElement) => {
  const isAuthenticate=useAuth()
  if(!isAuthenticate){
    return  <Navigate to="/"  state={{isNeedToLogin:true}}/>
  }
  return (
    <>
    {children}
    </>
  )
}

export default WithErrorBoundariesWrapper(WithAuthentication)