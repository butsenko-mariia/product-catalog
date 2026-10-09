import { Button, Image, Text } from '@mantine/core';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { logout } = useAuth();
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
        <Button h="auto" variant="subtle">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image src="/photos/11.jpg" w={60} h={60} />
            <Text c="white">your profile</Text>
          </div>
        </Button>
        <Button h="auto" variant="subtle" onClick={logout}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Image w={60} h={60} src="/photos/22.jpg" />
            <Text c="white">logout</Text>
          </div>
        </Button>
      </div>
    </div>
  );
}
