export interface EasypaisaPaymentResponse {
  orderId: string;
  storeId: string;
  transactionId: string;
  transactionStatus: string;
  transactionDateTime: string;
  paymentToken: string;
  responseCode: string;
  responseDesc: string;
}

export interface EasypaisaStatusResponse {
  orderId: string;
  storeId: string;
  transactionStatus: string;
  transactionAmount: string;
  transactionDateTime: string;
  paymentToken: string;
  responseCode: string;
  responseDesc: string;
}

export interface EasypaisaTokenResponse {
  paymentToken: string;
  tokenExpiryDateTime: string;
  responseCode: string;
  responseDesc: string;
}

export interface EasypaisaError {
  responseCode: string;
  responseDesc: string;
}
