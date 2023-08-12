import { IAPProduct } from "@ionic-native/in-app-purchase-2";

import { ExtendedTransaction } from "../model/ExtendedIAPTransaction";

/**
 * Shows the main details of a IAP product in a readable way.
 * Used only for debugging.
 *
 * @param   {IAPProduct} product Product to show the details.
 * @returns {string} Details of the product in a readable way.
 */
export const showProduct = (product: IAPProduct) => {
    const transaction: ExtendedTransaction = product.transaction as ExtendedTransaction;
    return "id: " + product.id + ", title: " + product.title + ", state: " + product.state + ", owned: " + product.owned + ", transaction: " + JSON.stringify(transaction) + ", original_transaction_id: " + transaction.original_transaction_id + ", expiration date: " + transaction.expiration_date + ", account upgrade:" + transaction.account_upgrade;
}

/**
 * Return true if the debug is active.
 *
 * @returns {bool} True if debug is active.
 */
export const isDebug = () => {
    let debugActive = false;
    if (process.env.REACT_APP_DEBUG_MODE === 'true') debugActive = true;
    return debugActive;
}