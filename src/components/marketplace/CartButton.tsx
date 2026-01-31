import React, { useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { Cart, Product } from '../../lib';

interface CartButtonProp {
  product: Product;
  setCartState: (newCartState: Cart) => void;
  cartState: Cart;
  setBadCartState: (newCartState: Cart) => void;
  badCartState: Cart;
}

export const CartButton = ({ product, setCartState, cartState, setBadCartState, badCartState }: CartButtonProp) => {
  const currentCartState = product.badCoin && product.badCoin > 0 ? 'badCart' : 'cart';


  
  useEffect(() => {
    let cart = localStorage.getItem(currentCartState);
    if (cart) {
      const parsedCart = JSON.parse(cart);
      if (typeof parsedCart === 'object' && !Array.isArray(parsedCart)) {
        if (currentCartState === 'badCart'){
          setBadCartState(parsedCart);
        } else {
          setCartState(parsedCart);
          }
      }
    }
  }, [currentCartState]);

  const addToCart = () => {
    let newCartState = currentCartState === 'badCart' ? { ...badCartState } : { ...cartState };
    if (newCartState[product.id]) {
      newCartState[product.id]++;
    } else {
      newCartState[product.id] = 1;
    }
    localStorage.setItem(currentCartState, JSON.stringify(newCartState));
    if (currentCartState === 'badCart'){
      setBadCartState(newCartState);
    } else {
      setCartState(newCartState);
    }
  };

  const removeFromCart = () => {
    let newCartState = currentCartState === 'badCart' ? { ...badCartState } : { ...cartState }
    if (newCartState[product.id] && newCartState[product.id] > 1) {
      newCartState[product.id]--;
    } else {
      delete newCartState[product.id];
    }
    localStorage.setItem(currentCartState, JSON.stringify(newCartState));
    if (currentCartState === 'badCart'){
      setBadCartState(newCartState);
    } else {
      setCartState(newCartState);
    }
  };


  return (
    <div >
      { currentCartState === 'cart' && !cartState[product.id] && (
        <button className='buy-button' onClick={addToCart} >
          Add to cart
        </button>
      )}
      { currentCartState === 'cart' && cartState[product.id] && (
        <div className='flex justify-center w-40 mx-auto'>
          <button className='increment-button' onClick={removeFromCart} >
            <AiOutlineMinus />
          </button>
          <div className='mt-6 mx-6 block text-2xl'>{cartState[product.id]}</div>
          <button className='increment-button' onClick={addToCart} >
            <AiOutlinePlus />
          </button>
        </div>
      )}
      {currentCartState === 'badCart' && !badCartState[product.id] && (
        <button className='buy-button' onClick={addToCart} >
          Add to cart
        </button>
      )}
      {currentCartState === 'badCart' && badCartState[product.id] && (
        <div className='flex justify-center w-40 mx-auto'>
          <button className='increment-button' onClick={removeFromCart} >
            <AiOutlineMinus />
          </button>
          <div className='mt-6 mx-6 block text-2xl'>{badCartState[product.id]}</div>
          <button className='increment-button' onClick={addToCart} >
            <AiOutlinePlus />
          </button>
        </div>
      )}
    </div>
  );
};

