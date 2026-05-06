import { ORDERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => `${ORDERS_URL}/${id}`,
      keepUnusedDataFor: 5,
    }),

    getMyOrders: builder.query({
      query: () => `${ORDERS_URL}/myorders`,
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ORDERS_URL,
      keepUnusedDataFor: 5,
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),

    // Менеджер встановлює вартість доставки НП
    setShippingPrice: builder.mutation({
      query: ({ orderId, shippingPrice, managerNote }) => ({
        url: `${ORDERS_URL}/${orderId}/shipping`,
        method: 'PUT',
        body: { shippingPrice, managerNote },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useSetShippingPriceMutation,
} = ordersApiSlice;
