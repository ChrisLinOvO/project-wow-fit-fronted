import { cartActionTypes } from "./cart-action-type";
import {
  addShopItemToCart,
  removeCartItem,
  unlikeCartItem,
} from "./cart-utils";

const INITIAL_STATE = {
  hidden: true,
  cartItems: [],
  cartFavoriteItems: [],
};

const cartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case cartActionTypes.TAGGLE_CART_DROPDOWN:
      return { ...state, hidden: !state.hidden };
    case cartActionTypes.ADD_ITEM:
      return {
        ...state,
        cartItems: addShopItemToCart(state.cartItems, action.payload),
      };
    case cartActionTypes.REOMOVE_ITEM:
      return {
        ...state,
        cartItems: removeCartItem(state.cartItems, action.payload),
      };
    case cartActionTypes.LIKE_ITEM:
      return {
        ...state,
        cartFavoriteItems: [...state.cartFavoriteItems, action.payload],
      };
    case cartActionTypes.UNLIKE_ITEM:
      return {
        ...state,
        cartFavoriteItems: unlikeCartItem(
          state.cartFavoriteItems,
          action.payload
        ),
      };
    default:
      return state;
  }
};

export default cartReducer;
