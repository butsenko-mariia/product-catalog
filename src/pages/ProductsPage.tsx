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
  TextInput,
  Select,
  Skeleton,
  Center,
  Alert,
  Paper,
} from '@mantine/core';
import { Product } from '../types/products';
import Header from '../components/Header';
import useDebounce from '../contexts/Debounce';
import { useSearchParams } from 'react-router-dom';

export default function ProductsPage() {
  const [searchParam, setSearchParam] = useSearchParams();
  const initialPage = Number(searchParam.get('page')) || 1;
  const initialCategory = searchParam.get('category') || '';
  const initialSearch = searchParam.get('q') || '';
  const initialSortBy = searchParam.get('sortBy') || 'title';
  const initialSortOrder = searchParam.get('order') || 'asc';

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchSortBy, setSearchSortBy] = useState(initialSortBy);
  const [searchSortOrder, setSearchSortOrder] = useState(initialSortOrder);
  const [isError, setIsError] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [filterList, setFilterList] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  const debouncedSeachQuery = useDebounce(searchQuery, 400);
  const itemsPerPage = 12;

  useEffect(() => {
    const params: Record<string, string> = {};
    if (Number(currentPage) > 1) {
      params.page = currentPage.toString();
      params.skip = ((currentPage - 1) * itemsPerPage).toString();
    }
    if (debouncedSeachQuery) params.q = debouncedSeachQuery.trim();
    if (categoryFilter) params.category = categoryFilter;
    if (searchSortBy) {
      params.sortBy = searchSortBy;
      if (searchSortOrder) params.order = searchSortOrder;
    }

    setSearchParam(params);
  }, [
    currentPage,
    debouncedSeachQuery,
    setSearchParam,
    categoryFilter,
    searchSortBy,
    searchSortOrder,
  ]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await api.get('/products/category-list');
        setFilterList(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        let endpoint: string = '/products';
        const requestParams: Record<string, string | number> = {
          limit: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
        };

        if (debouncedSeachQuery.trim()) {
          endpoint = '/products/search';
          requestParams.q = debouncedSeachQuery.trim();
        } else if (categoryFilter)
          endpoint = `/products/category/${categoryFilter}`;
        else if (searchSortBy) {
          requestParams.sortBy = searchSortBy;
          requestParams.order = searchSortOrder;
        }

        const response = await api.get(endpoint, {
          params: requestParams,
        });

        let fetchedProducts: Product[] = response.data.products;

        if (categoryFilter && searchSortBy) {
          fetchedProducts = [...fetchedProducts].sort((a, b) => {
            if (searchSortBy === 'price') {
              return searchSortOrder === 'asc'
                ? Number(a.price) - Number(b.price)
                : Number(b.price) - Number(a.price);
            }
            if (searchSortBy === 'title') {
              return searchSortOrder === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
            }
            return 0;
          });
        }

        setTotalProducts(response.data.total);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    debouncedSeachQuery,
    categoryFilter,
    searchSortBy,
    searchSortOrder,
    retryCount,
  ]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const currentSortValue = searchSortBy
    ? `${searchSortBy}-${searchSortOrder}`
    : '';

  const handleSortChange = (value: string | null) => {
    if (!value) {
      setSearchSortBy('');
      setSearchSortOrder('asc');
    } else {
      const [newSortBy, newOrder] = value.split('-');
      setSearchSortBy(newSortBy);
      setSearchSortOrder(newOrder);
    }
    setCurrentPage(1);
  };

  return (
    <div>
      <Header />
      <TextInput
        placeholder="Search products ..."
        value={searchQuery}
        onChange={(e) => {
          setCurrentPage(1);
          setCategoryFilter('');
          setSearchQuery(e.target.value);
        }}
        size="xl"
        fw={700}
        p={50}
        pl={100}
        pr={100}
        c="rgba(200, 191, 231)"
      />
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 20,
        }}
      >
        <Select
          label="Order by"
          placeholder="from ... to ..."
          data={[
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'title-asc', label: 'Title: A-Z' },
            { value: 'title-desc', label: 'Title: Z-A' },
          ]}
          value={currentSortValue}
          onChange={handleSortChange}
        />
        <Select
          label="Choose category"
          placeholder="categories"
          data={filterList}
          value={categoryFilter}
          onChange={(value) => {
            setSearchQuery('');
            setCurrentPage(1);
            setCategoryFilter(value || '');
          }}
        />
      </div>

      <div style={{ width: '70%', alignSelf: 'center', margin: '0 auto' }}>
        {isLoading && <SceletonShowing />}
        {!isLoading && isError && (
          <Center my={50}>
            <Paper
              p="xl"
              radius="md"
              withBorder
              style={{ textAlign: 'center', maxWidth: 400 }}
            >
              <Alert color="red" title="Data Loading Error" mb="md">
                Unable to load products...
              </Alert>
              <Button
                color="red"
                onClick={() => setRetryCount((prev) => prev + 1)}
              >
                Try again
              </Button>
            </Paper>
          </Center>
        )}

        <SimpleGrid cols={4}>
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      </div>

      {!isLoading && !isError && totalPages > 1 && (
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
      )}
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

function SceletonShowing() {
  return (
    <SimpleGrid cols={4} spacing="lg">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} shadow="sm" p="md" radius="md" withBorder>
          <Skeleton height={200} mb="xl" radius="md" />
          <Skeleton height={15} width="70%" mb="sm" radius="xl" />
          <Skeleton height={10} width="40%" mb="md" radius="xl" />
          <Skeleton height={25} width="30%" radius="xl" />
        </Card>
      ))}
    </SimpleGrid>
  );
}
