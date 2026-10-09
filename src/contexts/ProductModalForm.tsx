import React, { useEffect, useState } from 'react';
import { Product } from '../types/products';
import { api } from '../api/axios';
import { notifications } from '@mantine/notifications';
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';

interface ProductModalFormProps {
  opened: boolean;
  onClose: () => void;
  initialData?: Product | null;
  onSuccess: (product?: Product, isEdit?: boolean, isDelete?: boolean) => void;
}

export const ProductModalForm: React.FC<ProductModalFormProps> = ({
  opened,
  onClose,
  initialData,
  onSuccess,
}) => {
  const isEdit = !!initialData;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '0',
    stock: 0,
    category: '',
  });

  useEffect(() => {
    const initiateForm = async () => {
      if (initialData) {
        setFormData({
          title: initialData.title,
          description: initialData.description,
          price: initialData.price,
          category: initialData.category,
          stock: initialData.stock ?? 0,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          price: '0',
          stock: 0,
          category: '',
        });
      }
    };

    initiateForm();
  }, [initialData, opened]);

  const handleSubmit = async () => {
    const priceNum = Number(formData.price);
    const stockNum = Number(formData.stock);
    if (
      !formData.title.trim() ||
      formData.price === '' ||
      isNaN(priceNum) ||
      priceNum <= 0 ||
      isNaN(stockNum) ||
      stockNum <= 0
    ) {
      notifications.show({
        title: 'Warning',
        message: 'Title is required, Price and Stock must be greater than 0!',
        color: 'orange',
      });
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = isEdit ? `/products/${initialData.id}` : '/products/add';

      const response = isEdit
        ? await api.put(endpoint, formData)
        : await api.post(endpoint, formData);

      notifications.show({
        title: 'Sucessfull',
        message: 'Product info was saved',
        color: 'green',
      });
      onSuccess(response.data, isEdit, false);
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save the product' + error,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (initialData) {
        await api.delete(`/products/${initialData.id}`);
        notifications.show({
          title: 'Succesfull',
          message: 'The product was   deleted',
          color: 'green',
        });
        onSuccess(initialData, true, true);
        onClose();
      } else {
        notifications.show({
          title: 'Warning',
          message: 'Initial data is empty',
          color: 'orange',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete' + error,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={onClose}
        title={isEdit ? 'Editting the product' : 'Creating a product'}
        centered
      >
        <Stack>
          <TextInput
            label="Title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <NumberInput
            label="Price"
            required
            value={formData.price}
            onChange={(val) => {
              const value = val;
              const num = Number(value);

              setFormData({
                ...formData,
                price: value === '' ? '' : num.toString(),
              });
            }}
          />
          <NumberInput
            label="Stock"
            required
            value={formData.stock}
            onChange={(val) => {
              const value = val;
              const num = Number(value);

              setFormData({
                ...formData,
                stock: value === '' ? 0 : num,
              });
            }}
          />
          <TextInput
            label="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          <Group justify="space-between" mt="md">
            {isEdit ? (
              <Button
                color="red"
                variant="outline"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to delete this product'
                    )
                  ) {
                    handleDelete();
                  }
                }}
                loading={isLoading}
              >
                Delete
              </Button>
            ) : (
              <div />
            )}

            <Group>
              <Button variant="default" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} loading={isLoading}>
                Save
              </Button>
            </Group>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};
