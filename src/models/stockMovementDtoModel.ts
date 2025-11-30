export interface StockMovementDto {
    id: number;
    productId: number;
    productName: string;
    productType: number;
    amount: number;
    movementDate: string;
    isIncoming: boolean;
    description: string;
}