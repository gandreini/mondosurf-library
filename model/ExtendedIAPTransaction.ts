import { AppStoreReceipt } from "@ionic-native/in-app-purchase-2";

// IAP transaction object extended to add two custom fields.
export type ExtendedTransaction = AppStoreReceipt & { expiration_date: number, account_upgrade: boolean }