import React from 'react'
import LoginForm from './LoginForm'
import DashboardHome from './DashboardHome'

const Dashboard = ({onLogout}) => {
  return (
    <div>
        {/* <LoginForm /> */}
        <DashboardHome onLogout={onLogout} />
    </div>
  )
}

export default Dashboard