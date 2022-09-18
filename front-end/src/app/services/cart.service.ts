import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  cartItems: CartItem[] = [];

  totalTempPrice : number = 0;
  totalTempQuantity: number = 0;

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {

    // // check if we already have the item in our cart 
    // console.log(`${theCartItem.name}, ${theCartItem.unitPrice}`); 
    // this.totalTempValue += theCartItem.unitPrice;
    // let alreadyExistsInCart: boolean = false;
    // let existingCartItem: CartItem = undefined;

    // if (this.cartItems.length > 0) {
    //   // find the item in the cart based on item id

    //   existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );

    //   // check if we found it
    //   alreadyExistsInCart = (existingCartItem != undefined);
    // }

    // if (alreadyExistsInCart) {
    //   // increment the quantity
    //   existingCartItem.quantity++;
    // }
    // else {
    //   // just add the item to the array
    //   this.cartItems.push(theCartItem);
    // }

    // // compute cart total price and total quantity
    // this.computeCartTotals(); 
    // console.log(this.totalTempValue); 

    let hasCartItem : boolean = false; 

    for(let tempItem of this.cartItems) {
      if(tempItem.id === theCartItem.id) {
        tempItem.quantity++;
        hasCartItem = true;
        break;
      }
    }

    if(!hasCartItem) {
      this.cartItems.push(theCartItem);
    }

    console.log(this.cartItems);


    this.computeCartTotals();






  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  } 

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity === 0) {
      this.remove(cartItem);
    }else {
      this.computeCartTotals();
    }
  }


  remove(cartItem: CartItem) {
    
    const index = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id); 

    if(index > -1) {
      this.cartItems.splice(index,1);
      this.computeCartTotals();
    }
  }
}

  
