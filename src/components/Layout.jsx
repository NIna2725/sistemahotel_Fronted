import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../pages/Sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    // No mostrar sidebar en la página de login
    const isLoginPage = location.pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <Flex h="100vh">
            <Sidebar />
            <Box flex="1" overflowY="auto">
                {children}
            </Box>
        </Flex>
    );
};

export default Layout;
