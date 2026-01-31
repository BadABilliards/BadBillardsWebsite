import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { MerchContext } from '../context';
import { Product } from "../lib";
import { OpenSeaIcon } from '../assets/social'
import { Navbar, Footer } from "../layout";
import Image from "next/image";
import { CartButton } from "../components/marketplace";
import { Cart } from "../lib";
import { BadCoin } from "../assets/img";

interface ApparealDetailsProp {
  color: DetailArray[] | null;
  size: DetailArray[] | null;
}

interface DetailArray {
  id: number;
  name: string | null;
}

export default function RecieptPage() {
  const [cartState, setCartState] = useState<Cart>({});
  const [badCartState, setBadCartState] = useState<Cart>({});
  const { products, loading } = useContext(MerchContext);
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [apparealDetails, setApparealDetails] = useState<ApparealDetailsProp>({ color: [], size: [] });


  useEffect(() => {
    if (id) {
      const displayProduct = products.find((product) => product.id === +id)
      if (displayProduct) {
        if (displayProduct.apparel) {
          const colors = products
            .filter(
              (filterProduct) =>
                filterProduct.name === (displayProduct ? displayProduct.name : '') &&
                filterProduct.size === (displayProduct ? displayProduct.size : [])
            )
            .map((filterProduct) => ({ id: filterProduct.id, name: filterProduct.color }))
            .sort((a, b) => a.id - b.id);
          const sizes = products
            .filter(
              (filterProduct) =>
                filterProduct.name === (displayProduct ? displayProduct.name : '') &&
                filterProduct.color === (displayProduct ? displayProduct.color : [])
            )
            .map((filterProduct) => ({ id: filterProduct.id, name: filterProduct.size }))
            .sort((a, b) => a.id - b.id);
          setApparealDetails({ color: colors, size: sizes })
        }
        setProduct(displayProduct);
      }
    }
  }, [id, products, ]);

  useEffect(() => {
    const cart = localStorage.getItem('cart');
    const badCart = localStorage.getItem('bad-cart');
    if (cart) {
      const parsedCart = JSON.parse(cart);
      if (typeof parsedCart === 'object' && !Array.isArray(parsedCart)) {
        setCartState(parsedCart);
      }
    }
    if (badCart) {
      const parsedBadCart = JSON.parse(badCart);
      if (typeof parsedBadCart === 'object' && !Array.isArray(parsedBadCart)) {
        setBadCartState(parsedBadCart);
      }
    }
    if (id) {
      const displayProduct = products.find((product) => product.id === +id)
      if (displayProduct) {
        if (displayProduct.apparel) {
          const colors = products
            .filter(
              (filterProduct) =>
                filterProduct.name === (displayProduct ? displayProduct.name : '') &&
                filterProduct.size === (displayProduct ? displayProduct.size : [])
            )
            .map((filterProduct) => ({ id: filterProduct.id, name: filterProduct.color }))
            .sort((a, b) => a.id - b.id);
          const sizes = products
            .filter(
              (filterProduct) =>
                filterProduct.name === (displayProduct ? displayProduct.name : '') &&
                filterProduct.color === (displayProduct ? displayProduct.color : [])
            )
            .map((filterProduct) => ({ id: filterProduct.id, name: filterProduct.size }))
            .sort((a, b) => a.id - b.id);
          setApparealDetails({ color: colors, size: sizes })
        }
        setProduct(displayProduct);
      }
    }
  }, []);


  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.push({
      pathname: '/product',
      query: { id: event.target.value },
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Navbar />
      <div className="bg-grey product md:flex mt-32 rounded-3xl p-10 w-3/4 mx-auto">
      <h1 className="text-4xl text-center md:hidden block my-4">{product.name}</h1>
      <h3 className="text-2xl text-center md:hidden block my-4">{product.size}</h3>
      <div className="md:w-1/2 w-3/4 mx-auto block">
        <Image
          src={product.image}
          width={844}
          height={844}
          alt={product.name}
          priority
          className="w-full mx-auto block my-2"
        />
        
      </div>
      <div className="md:w-1/2 w-3/4 mx-auto px-4 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl text-center hidden md:block mt-4">{product.name}</h1>
          <h3 className="text-2xl text-center hidden md:block">{product.size}</h3>
          <div className="flex mt-4 justify-between">
            { product.badCoin ? 
              <h3 className="text-2xl">
                <Image
                  src={BadCoin}
                  width={25}
                  height={25}
                  alt={product.name}
                  className="inline mb-1 mr-1"
                />
                {product.badCoin}
              </h3>
            :
              <h3 className="text-2xl">
                ${product.price}
              </h3>
            }
            <h3 className="text-2xl"> {product.total_stock ? product.stock + '/' + product.total_stock: ''}</h3>
          </div>
          { product.link && 
          <a className="hidden md:block ml-auto mr-0 w-10" href={product.link}>
            <Image
              src={OpenSeaIcon}
              width={30}
              height={30}
              alt={product.name}
              className="block mr-0 ml-auto"
            />
          </a>
        }
          {apparealDetails && (
            <div className="flex justify-between md:mr-2">
            {apparealDetails.size != null && apparealDetails.size .length > 0 && (
                <div>
                  <label className="text-2xl mr-2" htmlFor="sizeDropdown">Sizes</label>
                  <select className="bg-grey border-2 p-2 rounded-xl"
                    id="sizeDropdown"
                    value={product.size ? product.size : 'None'}
                    onChange={handleOptionChange}
                  >
                    <option value="">{product.size}</option>
                    {apparealDetails.size.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {apparealDetails.color != null && apparealDetails.color.length > 0 && (
                <div>
                  <label className="text-2xl mr-2" htmlFor="colorDropdown">Colors</label>
                  <select className="bg-grey border-2 p-2 rounded-xl"
                    id="colorDropdown"
                    value={product.color ? product.color : 'None'}
                    onChange={handleOptionChange}
                  >
                    <option value="">{product.color}</option>
                    {apparealDetails.color.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
            </div>
          )}
          <h3 className="text-2xl my-2">{product.description}</h3>
          <h3 className="text-2xl my-2">{product.deliveryDetails}</h3>
          { product.raffle && <h3 className="text-2xl my-4">This item is a RAFFLE! Each purchase is for a ticket that will be entered into the raffle</h3>}
          { product.link && 
            <a className="md:hidden block" href={product.link}>
              <Image
                src={OpenSeaIcon}
                width={30}
                height={30}
                alt={product.name}
                className="block my-2"
              />
            </a>
          }
        </div>
        <div className="mb-12">
          <CartButton product={product} setCartState={setCartState} cartState={cartState} setBadCartState={setBadCartState} badCartState={badCartState} />
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
}