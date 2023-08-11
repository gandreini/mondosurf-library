export interface IAppleProduct {
    id: string;
    title: string;
    description: string;
    price: string;
    canPurchase: boolean;
    owned: boolean;
    billingPeriodUnit: "Month" | "Year";
}