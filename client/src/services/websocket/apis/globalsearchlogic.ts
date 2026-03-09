export interface SearchResult {
  scripId: string;
  scripToken: string;
  exchangeSegment: string;
  instrumentType: string;
  symbolName: string;
  tradingSymbol: string;
  optionType: string;
  uniqueKey: string;
  lotSize: number;
  displayStrikePrice: number;
  displayExpiryDate: string;
  exchangeName: string;
  contractType: string;
}

export interface GlobalSearchResponse {
  openSearchResponse: SearchResult[];
}

