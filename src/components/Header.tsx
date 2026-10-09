import { Button, Image, Indicator, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        color: 'rgba(255, 123,143, 0.8)',
        minHeight: '150px',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
        boxShadow: ' 0 10px 8px -8px rgb(0 0 0 / 20%)',
      }}
    >
      <Text pos="absolute" w="100%" ta="center" size="60px" fw={700}>
        PRODUCT CATALOG
      </Text>
      <div style={{ marginLeft: 'auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          {' '}
          <Indicator
            label={cartCount}
            showZero={false}
            size={22}
            color="pink"
            offset={7}
          >
            <Button h="auto" variant="subtle">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Image
                  src="https://static.vecteezy.com/system/resources/thumbnails/065/420/873/small/shopping-cart-icon-in-white-3d-style-free-png.png"
                  w={60}
                  h={60}
                />
                <Text c="white" size="lg">
                  Cart
                </Text>
              </div>
            </Button>
          </Indicator>
          <Button h="auto" variant="subtle">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Image src={user?.image || '/photos/11.png'} w={60} h={60} />
              <Text c="white">
                {user ? `${user.firstName} ${user.lastName}` : 'your profile'}
              </Text>
            </div>
          </Button>
          <Button h="auto" variant="subtle" onClick={handleLogout}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Image w={60} h={60} src="/photos/22.png" />
              <Text c="white">logout</Text>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
