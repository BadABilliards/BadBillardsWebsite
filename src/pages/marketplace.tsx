import React, { useContext, useState } from 'react';
import { WalletModal } from "../layout/components";
import { Navbar, Footer } from '../layout';
import { Filter, ProductCard } from '../components/marketplace';
import { MerchContext, AuthContext } from '../context';
import Image from 'next/image';
import { Marketpalce } from '../assets/img';

interface FilterType {
  digitalItems: boolean;
  customItems: boolean;
  apparel: boolean;
  experiences: boolean;
  buyNow: boolean;
  raffle: boolean
  search: string;
};

function Marketplace() {
  const { modelIsOpen, setModelIsOpen, } = useContext(AuthContext);
  const { products } = useContext(MerchContext);
  const [filter, setFilter] = useState<FilterType>({
    digitalItems: false,
    customItems: false,
    apparel: false,
    experiences: false,
    buyNow: false,
    raffle: false,
    search: '',
  });

  const filteredProducts = products.filter((product) => {
    if (!product.inactive) {
      if (!(
        filter.digitalItems || filter.customItems ||
        filter.apparel || filter.experiences ||
        filter.buyNow || filter.raffle ||
        filter.search
      )
    ) {
      return true;
    }
    if (
      (filter.digitalItems && product.digital) ||
      (filter.customItems && product.custom) ||
      (filter.apparel && product.apparel) ||
      (filter.experiences && product.experiences) ||
      (filter.buyNow && product.buyNow) ||
      (filter.raffle && product.raffle) ||
      (filter.search.length > 0)
    ) {
      if (filter.search.length > 0) {
        const searchTerms = filter.search.toLowerCase().split(" ");
        const productString = `${product.name.toLowerCase()} ${product.description.toLowerCase()}`;
        return searchTerms.some((term) => productString.includes(term));
      } else {
        return true;
      }
    }
    }})

    const uniqueFilteredProducts = filteredProducts.filter(
      (product) => product.size === null || (product.size === 'Large' && product.color === 'Red'));

  return (
    <>
      <Navbar />
      <WalletModal
        modelIsOpen={modelIsOpen}
        CloseModal={() => setModelIsOpen("false")}
      />
      <Image
        src={Marketpalce}
        width={1000}
        height={400}
        className='w-11/12 max-w-7xl hidden md:block h-auto mx-auto mt-32 rounded-3xl border-8 border-black'
        alt={'Bad a Billiard banner'}
        priority={true}
      />
      <div className='mt-24 mx-auto md:mt-10 gap-11 merch-block md:grid md:px-4'>
        <div className='md:w-72 w-full'>
          <Filter filter={filter} setFilter={setFilter} />
        </div>
        <div className='md:grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          { uniqueFilteredProducts.length > 0 && uniqueFilteredProducts.map((product) => (
            product && <ProductCard key={product.id.toString()} product={product} />
          ))
        }
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Marketplace;