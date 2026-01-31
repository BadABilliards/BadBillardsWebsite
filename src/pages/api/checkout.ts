import { supabase } from '../../utils/supabaseClient';
import { Product } from '../../lib';
import { client } from '../../utils/squareClient.js';
import { v4 as uuidv4 } from 'uuid';

export default async function checkoutHandler( req: any, res: any ) {

  const locationId = 'LXQRM8PCJ01HN'

  if (req.method === 'POST') {
    
    const { orderData } = req.body;

  const { data: products, error: productsError } = await supabase
    .from('product').select('*');

    const line_items = Object.entries(orderData).map(([productId, quantity]) => {
      if (products) {
        const newProduct = products.find((product: { [x: string]: any; } | Product) => product.id === +productId) as Product | undefined;
        if (newProduct) {
          return {
            name: newProduct.color ? newProduct.color + newProduct.name : newProduct.name,
            quantity: quantity ? quantity.toString() : '0',
            basePriceMoney: {
              amount: BigInt(20),
              currency: 'USD'
            },
            note: newProduct.description,
          };
        }
      }

      return {
        name: '',
        quantity: '0',
        basePriceMoney: {
          amount: BigInt(0),
          currency: 'USD'
        },
        note: '',
      };
    });

    function generateUniqueId(): string {
      return uuidv4();
  }

    try {
      const {result} = await client.checkoutApi.createPaymentLink({
        idempotencyKey: generateUniqueId(),
        order: {
          locationId:  locationId,
          lineItems: line_items,
        }
      });
    
      return res.status(200).json({
        response: result?.paymentLink?.url,
      })

  } catch (error) {
    return res.status(504).json({
      message: error
    })
  
      
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
}