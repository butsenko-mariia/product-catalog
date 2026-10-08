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
        backgroundColor: 'pink',
        minHeight: '150px',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
      }}
    >
      <Text
        pos="absolute"
        w="100%"
        ta="center"
        size="60px"
        fw={700}
        c="rgb(255, 255, 255)"
      >
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
            <Image src="public\photos\11.jpg" w={60} h={60} />
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
            <Image w={60} h={60} src="public\photos\22.jpg" />
            <Text c="white">logout</Text>
          </div>
        </Button>
      </div>
    </div>
  );
}
