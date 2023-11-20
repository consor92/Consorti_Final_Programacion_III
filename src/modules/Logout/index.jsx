import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Spin } from 'antd';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('userData');
      localStorage.removeItem('authData');
      navigate('/');
    };

    // Call handleLogout when the component mounts
    handleLogout();
  }, [navigate]);

  // The component can be empty or return a message indicating the logout process
  return (
    <div>
      <Spin tip="Logging out..." size="large">
        <div className="content" />
      </Spin>
      
    </div>
  );
};

export default Logout;