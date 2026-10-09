import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Image,
  Text,
  Card,
  Center,
  Paper,
  Alert,
  SimpleGrid,
  Group,
  Badge,
  Rating,
  Title,
  Divider,
  Button,
  Container,
  Stack,
  Loader,
  Box,
} from '@mantine/core';
import { api } from '../api/axios';
import { Product, Review } from '../types/products';
import Header from '../components/Header';
import { notifications } from '@mantine/notifications';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [productDetails, setProductDetails] = useState<Product>();
  const [isError, setIsError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProductDetails(response.data);
      } catch (error) {
        setIsError(true);
        notifications.show({
          title: 'Loading error',
          message:
            'We were unable to retrieve information about this product. Please try again later. Error message: ' +
            error,
          color: 'red',
          autoClose: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const showError = !id || isError;

  return (
    <div>
      <Header />

      <Container size="lg" mt="50">
        <Button
          variant="subtle"
          onClick={() => navigate(-1)}
          mb="md"
          c="rgba(0,180,190)"
          fw="700"
          fz="15"
        >
          &larr; Назад к списку
        </Button>

        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          mb="xl"
          c="rgba(38,35,97)"
        >
          {isLoading ? (
            <Center my={100}>
              <Loader size="xl" color="rgba(230,73,128)" type="bars" />
            </Center>
          ) : showError ? (
            <Center my={50}>
              <Paper
                p="xl"
                radius="md"
                withBorder
                style={{ textAlign: 'center', maxWidth: 400 }}
              >
                <Alert color="red" title="Data Loading Error" mb="md">
                  Unable to find product...
                </Alert>
              </Paper>
            </Center>
          ) : (
            productDetails && (
              <>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                  <Stack justify="center" align="center">
                    {productDetails.images &&
                      productDetails.images.length > 0 && (
                        <Box
                          w="100%"
                          pos="relative"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            variant="default"
                            radius="xl"
                            px={10}
                            fz="lg"
                            style={{
                              position: 'absolute',
                              left: 0,
                              zIndex: 2,
                            }}
                            onClick={() => {
                              if (currentImageIndex > 0)
                                setCurrentImageIndex((prev) => prev - 1);
                            }}
                          >
                            &#8592;
                          </Button>
                          <Image
                            src={productDetails.images?.[currentImageIndex]}
                            alt={productDetails.title}
                            fit="contain"
                            h={{ base: 260, sm: 350, md: 400 }}
                            w="100%"
                          />
                          <Button
                            fz="lg"
                            variant="default"
                            radius="xl"
                            px={10}
                            style={{
                              position: 'absolute',
                              right: 0,
                              zIndex: 2,
                            }}
                            onClick={() => {
                              if (
                                currentImageIndex <
                                productDetails.images.length - 1
                              )
                                setCurrentImageIndex((prev) => prev + 1);
                            }}
                          >
                            &#8594;
                          </Button>
                        </Box>
                      )}
                  </Stack>

                  <Group w="100%">
                    <Stack gap={20} fz="md" w="100%">
                      <Badge
                        variant="default"
                        p="md"
                        c="rgba(0,180,190)"
                        fz="s"
                        style={{ alignSelf: 'flex-start' }}
                      >
                        {productDetails.brand}/{productDetails.category}
                      </Badge>

                      <Title
                        fz={{ base: '28px', sm: '38px', md: '50px' }}
                        fw="bold"
                        mb="md"
                      >
                        {productDetails.title}
                      </Title>

                      <Group>
                        <Rating
                          value={productDetails.rating}
                          fractions={2}
                          readOnly
                        />
                        {productDetails.reviews?.length || 0} total reviews
                      </Group>

                      <Group pt="md" pb="md">
                        <Text size="50px" fw={700} c="rgba(230,73,128)">
                          ${productDetails.price}
                        </Text>

                        {productDetails.discountPercentage && (
                          <Badge
                            color="rgba(255, 100, 100)"
                            size="18px"
                            p="15"
                            mb={8}
                            style={{
                              borderWidth: '4px',
                              borderColor: 'rgba(183, 0, 0, 0.16)',
                            }}
                          >
                            -{productDetails.discountPercentage}%
                          </Badge>
                        )}
                      </Group>

                      <Box>
                        <Text mb="xs">
                          <i>Description</i>
                        </Text>
                        <Text c="dimmed" mb="xl">
                          {productDetails.description}
                        </Text>
                      </Box>

                      <Divider />

                      <Stack gap="sm" mb="sm">
                        <Group justify="space-between">
                          <Text fw={500}>Availability:</Text>
                          <Text
                            c={
                              productDetails.stock && productDetails.stock > 0
                                ? 'green'
                                : 'red'
                            }
                            fw={600}
                          >
                            {productDetails.stock && productDetails.stock > 0
                              ? `${productDetails.stock} in stock`
                              : 'Out of stock'}
                          </Text>
                        </Group>

                        <Button
                          fullWidth
                          color="rgba(230,73,128)"
                          mt="xs"
                          size="md"
                          radius="md"
                          mih="60"
                          fw="bold"
                          fz={{ base: '20px', md: '30px' }}
                          onClick={(e) => {
                            e.stopPropagation();

                            const currentCart = JSON.parse(
                              localStorage.getItem('cart') || '[]'
                            );
                            localStorage.setItem(
                              'cart',
                              JSON.stringify([...currentCart, productDetails])
                            );
                            window.dispatchEvent(new Event('cartUpdated'));
                            notifications.show({
                              title: 'Product was added to cart',
                              message: 'Product was added to cart',
                              color: 'pink',
                            });
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Stack>
                    </Stack>
                  </Group>
                </SimpleGrid>
              </>
            )
          )}
        </Card>
      </Container>

      {!isLoading &&
        productDetails?.reviews &&
        productDetails.reviews.length > 0 && (
          <Container size="lg" mt="70" mb="70">
            <Card>
              <Text
                w="100%"
                ta="center"
                fz="30"
                fw={800}
                c="rgba(0, 158, 134)"
                mb="md"
              >
                Customers reviews
              </Text>
              {productDetails.reviews.map((review: Review) => (
                <ReviewCard key={review.reviewerEmail} review={review} />
              ))}
            </Card>
          </Container>
        )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card
      key={review.reviewerEmail}
      bg="rgba(0, 255, 217, 0.24)"
      p="md"
      radius="md"
      my="md"
    >
      <Group c="rgba(0, 188, 163)" display="block">
        <Group justify="space-between" mb="xs">
          <Text
            fz={{ base: '18px', sm: '25px' }}
            fw={800}
            c="rgba(0, 158, 134)"
          >
            {review.reviewerName}
          </Text>
          <Text fz="sm">{review.date}</Text>
        </Group>
        <Text mb="xs">
          <i>{review.reviewerEmail}</i>
        </Text>
        <Stack gap="xs" mt="10">
          <Rating
            value={review.rating}
            fractions={2}
            color="rgba(0, 188, 163)"
            readOnly
          />
          <Text c="rgba(0, 158, 134)">{review.comment}</Text>
        </Stack>
      </Group>
    </Card>
  );
}
