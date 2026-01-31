import { createContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Product } from '../lib';

type MerchContextProviderProp = {
    children: React.ReactNode
}

export const MerchContext = createContext<{
  products: Product[];
  loading: boolean;
  saveOrders: (orderData: any, order: any, table: string) => Promise<boolean | string>;
}>({
  products: [],
  loading: true,
  saveOrders: async () => false,
});


export const MerchContextProvider = ( {children}: MerchContextProviderProp ) => {
  const [products, setProducts] = useState<any | null>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      async function fetchProducts() {
        setLoading(true);
        const { data } = await supabase.from('product').select('*');
        setProducts(data);
        setLoading(false);
      }
      fetchProducts();
    }, []);

   async function saveOrders(orderData: any, order: any, table: string ): Promise<boolean | string> {
        const { data: orderTable,  error: orderCreationError } = await supabase
          .from(table).insert([
            { playfab_id: orderData.id,
              status: 'PENDING',
              street: orderData.street,
              city: orderData.city,
              state: orderData.state,
              zip_code: orderData.zip_code,
              user_name: orderData.user_name,
              phone_number: orderData.phone_number,
              wallet_address: orderData.wallet_address,
              email: orderData.email,
              total: orderData.total, },
          ]).select()
  
        if (orderCreationError) {
          throw new Error(orderCreationError.message);
        }

        if (orderTable) {
          const order_id = orderTable[0].id;
          const orderItemsFromCartitems = Object.entries(order).map(([productId, quantity]) => ({
            order_id,
            id: productId,
            product_id: productId,
            quantity: quantity,
            playfab_id: orderData.PlayFabId,
          }));
    
          const { data: orderItemsInsertion, error: orderItemsInsertionError } =
            await supabase
              .from(`${table}_item`)
              .insert(orderItemsFromCartitems)
              .select();
    
              if (orderItemsInsertionError) {
                throw new Error(orderItemsInsertionError.message);
              }

              return order_id;
            }

            return false
          };


  return (
      <MerchContext.Provider 
          value={{
              products,
              loading,
              saveOrders,
          }}
      >
          {children}
      </MerchContext.Provider >

  );
};
