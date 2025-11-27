export interface InventoryStatusModel {
    totalRawMaterialCount:number;
    totalRawMaterialStock:number;
    totalProductToProcessCount:number;
    totalProductToProcessStock:number;
    totalProcessedProduceCount:number;
    totalProcessedProduceStock:number;
    totalNeighborhoodCount:number;
    totalNeighborhoodStock:number;
    totalToPackagedCount:number;
    totalToPackagedStock:number;
    totalProductCount:number;
    totalProductStock:number;
    grandTotalStock:number;
}