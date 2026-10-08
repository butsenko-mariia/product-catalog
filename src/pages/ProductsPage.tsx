import React, { useEffect, useState } from 'react';
import { api } from '../api/axios';
import {
  Card,
  Image,
  Group,
  Text,
  Badge,
  Button,
  SimpleGrid,
  Pagination,
  Rating,
} from '@mantine/core';
import { Product } from '../types/products';
import Header from '../components/Header';

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/products', {
          params: {
            limit: itemsPerPage,
            skip: (currentPage - 1) * itemsPerPage,
          },
        });
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <div>
      <Header />
      <Text
        w="100%"
        ta="center"
        c="rgba(200, 191, 231)"
        size="xl"
        fw={700}
        mb={20}
      >
        {totalProducts} products were found
      </Text>
      <div style={{ width: '70%', alignSelf: 'center', margin: '0 auto' }}>
        <SimpleGrid cols={4}>
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      </div>
      <div>
        <Pagination.Root
          value={currentPage}
          onChange={setCurrentPage}
          total={totalPages}
          color="pink"
          radius="md"
        >
          <Group
            justify="space-between"
            style={{ width: '80%', margin: '30px auto' }}
          >
            <Pagination.Previous />
            <Group gap={5}>
              <Pagination.Items />
            </Group>
            <Pagination.Next />
          </Group>
        </Pagination.Root>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isOnHover, setIsOnHover] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '380px',
      }}
      onMouseEnter={() => setIsOnHover(true)}
      onMouseLeave={() => setIsOnHover(false)}
    >
      <Card
        key={product.id}
        shadow="sm"
        p="md"
        radius="md"

        style={{
          width: '100%',
          position: isOnHover ? 'absolute' : 'relative',
          zIndex: isOnHover ? 10 : 1,
          top: 0,
          left: 0,
          right: 0,
          transition: 'box-shadow 1.5s ease',
        }}
      >
        <Card.Section>
          <div
            style={{
              marginLeft: 5,
              marginBottom: 10,
            }}
          >
            <Badge variant="outline">{product.discountPercentage}% off</Badge>
          </div>
          <div>
            <Image
              src={product.images?.[0]}
              alt={product.title}
              h={220}
              fit="contain"
            />
          </div>
        </Card.Section>

        <Group justify="space-between" mt="md">
          <div>
            <div style={{ minHeight: 40 }}>
              <Text lineClamp={2} fw={500}>
                {product.title}
              </Text>
            </div>
            <Text fz="xs" c="dimmed">
              {product.category}
            </Text>
            <Rating value={product.rating} readOnly />
          </div>
        </Group>

        <div style={{ marginLeft: 'auto' }}>
          <Text fz="xl" fw={700}>
            ${product.price}
          </Text>
        </div>
        {isOnHover && (
          <Button
            radius="xl"
            style={{ minHeight: 40, marginTop: 10 }}
            fullWidth
          >
            Buy now
          </Button>
        )}
      </Card>
    </div>
  );
}
