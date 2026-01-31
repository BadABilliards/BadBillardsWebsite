import { Product } from "../../lib"
import Link from "next/link"
import Image from "next/image"
import { BadCoin } from '../../assets/img'

interface ProductProp {
  product: Product,
  key: string
}

export function ProductCard({ product }: ProductProp) {

  return (
    <Link className='w-56 block h-80 bg-grey text-center rounded-2xl md:mt-0 mx-auto'
     href={ { pathname: '/product', query: { id: product.id } }} >
        <h3 className="text-2xl h-14 mt-4" >{product.name}</h3>
        <Image
          src={product.image}
          width={844}
          height={844}
          alt={product.name}
          className="w-3/4 mx-auto block my-2"
        />
      <div className="flex w-3/4 mx-auto mt-4 justify-between">
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
        <h3 className="text-2xl">{ (product.total_stock && product.total_stock > 0) ?  product.stock + '/' + product.total_stock : '' }</h3>
      </div>
    </Link>
  )
}