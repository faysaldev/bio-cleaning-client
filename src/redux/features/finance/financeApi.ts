import { baseApi } from "@/src/redux/baseApi/baseApi";
import type { CreateBookingResult } from "../bookings/types";
import type { CreateQuoteInput, FinanceSummary, InvoiceRecord, Paged, PaymentRecord, PublicQuoteConversion, QuoteRecord, RecurringBilling } from "./types";

type ApiResponse<T>={code:number;message:string;status:string;data:T;meta?:any;type?:any};
const financeApi=baseApi.injectEndpoints({endpoints:(builder)=>({
  getQuotes:builder.query<Paged<QuoteRecord>,Record<string,unknown>|void>({query:(params)=>({url:"/quotes",params:params||undefined}),transformResponse:(r:ApiResponse<QuoteRecord[]>)=>({data:r.data,meta:r.type||r.meta}),providesTags:["Quote"]}),
  getQuote:builder.query<QuoteRecord,string>({query:(id)=>`/quotes/${id}`,transformResponse:(r:ApiResponse<QuoteRecord>)=>r.data,providesTags:(_r,_e,id)=>[{type:"Quote",id}]}),
  createQuote:builder.mutation<QuoteRecord,CreateQuoteInput>({query:(body)=>({url:"/quotes",method:"POST",body}),transformResponse:(r:ApiResponse<QuoteRecord>)=>r.data,invalidatesTags:["Quote","Lead"]}),
  updateQuote:builder.mutation<QuoteRecord,{id:string;body:Partial<Pick<QuoteRecord,"terms"|"notes"|"expiresAt">>}>({query:({id,body})=>({url:`/quotes/${id}`,method:"PATCH",body}),transformResponse:(r:ApiResponse<QuoteRecord>)=>r.data,invalidatesTags:(_r,_e,a)=>[{type:"Quote",id:a.id},"Quote"]}),
  sendQuote:builder.mutation<{quote:QuoteRecord;publicUrl?:string},string>({query:(id)=>({url:`/quotes/${id}/send`,method:"POST"}),transformResponse:(r:ApiResponse<any>)=>r.data,invalidatesTags:["Quote","Lead"]}),
  getPublicQuote:builder.query<QuoteRecord,string>({query:(token)=>`/quotes/public/${encodeURIComponent(token)}`,transformResponse:(r:ApiResponse<QuoteRecord>)=>r.data}),
  acceptPublicQuote:builder.mutation<QuoteRecord,{token:string;name:string;email:string;agreed:true}>({query:({token,...body})=>({url:`/quotes/public/${encodeURIComponent(token)}/accept`,method:"POST",body}),transformResponse:(r:ApiResponse<QuoteRecord>)=>r.data}),
  declinePublicQuote:builder.mutation<unknown,string>({query:(token)=>({url:`/quotes/public/${encodeURIComponent(token)}/decline`,method:"POST"})}),
  convertPublicQuote:builder.mutation<CreateBookingResult,{token:string;body:PublicQuoteConversion}>({query:({token,body})=>({url:`/quotes/public/${encodeURIComponent(token)}/convert`,method:"POST",body}),transformResponse:(r:ApiResponse<CreateBookingResult>)=>r.data}),
  getInvoices:builder.query<Paged<InvoiceRecord>,Record<string,unknown>|void>({query:(params)=>({url:"/invoices",params:params||undefined}),transformResponse:(r:ApiResponse<InvoiceRecord[]>)=>({data:r.data,meta:r.type||r.meta}),providesTags:["Invoice"]}),
  getInvoice:builder.query<InvoiceRecord,string>({query:(id)=>`/invoices/${id}`,transformResponse:(r:ApiResponse<InvoiceRecord>)=>r.data,providesTags:(_r,_e,id)=>[{type:"Invoice",id}]}),
  getFinanceSummary:builder.query<FinanceSummary,void>({query:()=>"/invoices/summary",transformResponse:(r:ApiResponse<FinanceSummary>)=>r.data,providesTags:["Invoice","Payment"]}),
  sendInvoice:builder.mutation<any,string>({query:(id)=>({url:`/invoices/${id}/send`,method:"POST"}),transformResponse:(r:ApiResponse<any>)=>r.data,invalidatesTags:["Invoice"]}),
  createInvoicePaymentLink:builder.mutation<any,string>({query:(id)=>({url:`/invoices/${id}/payment-link`,method:"POST"}),transformResponse:(r:ApiResponse<any>)=>r.data,invalidatesTags:["Payment"]}),
  recordManualPayment:builder.mutation<InvoiceRecord,{id:string;amount:number;note?:string}>({query:({id,...body})=>({url:`/invoices/${id}/manual-payment`,method:"POST",body}),transformResponse:(r:ApiResponse<InvoiceRecord>)=>r.data,invalidatesTags:["Invoice","Payment","Dashboard"]}),
  voidInvoice:builder.mutation<InvoiceRecord,string>({query:(id)=>({url:`/invoices/${id}/void`,method:"POST"}),transformResponse:(r:ApiResponse<InvoiceRecord>)=>r.data,invalidatesTags:["Invoice","Dashboard"]}),
  startRecurringBilling:builder.mutation<any,string>({query:(id)=>({url:`/invoices/${id}/recurring/start`,method:"POST"}),transformResponse:(r:ApiResponse<any>)=>r.data,invalidatesTags:["Payment"]}),
  cancelRecurringBilling:builder.mutation<any,string>({query:(id)=>({url:`/invoices/${id}/recurring/cancel`,method:"POST"}),transformResponse:(r:ApiResponse<any>)=>r.data,invalidatesTags:["Payment"]}),
  getPublicInvoice:builder.query<InvoiceRecord,string>({query:(token)=>`/invoices/public/${encodeURIComponent(token)}`,transformResponse:(r:ApiResponse<InvoiceRecord>)=>r.data}),
  payPublicInvoice:builder.mutation<any,string>({query:(token)=>({url:`/invoices/public/${encodeURIComponent(token)}/pay`,method:"POST"}),transformResponse:(r:ApiResponse<any>)=>r.data}),
  startPublicRecurringBilling:builder.mutation<any,string>({query:(token)=>({url:`/invoices/public/${encodeURIComponent(token)}/recurring/start`,method:"POST"}),transformResponse:(r:ApiResponse<any>)=>r.data}),
  getPayments:builder.query<Paged<PaymentRecord>,Record<string,unknown>|void>({query:(params)=>({url:"/payments",params:params||undefined}),transformResponse:(r:ApiResponse<PaymentRecord[]>)=>({data:r.data,meta:r.type||r.meta}),providesTags:["Payment"]}),
  refundPayment:builder.mutation<PaymentRecord,{id:string;amount:number}>({query:({id,amount})=>({url:`/payments/${id}/refund`,method:"POST",body:{amount}}),transformResponse:(r:ApiResponse<PaymentRecord>)=>r.data,invalidatesTags:["Payment","Invoice","Dashboard"]}),
  getRecurringBilling:builder.query<RecurringBilling[],void>({query:()=>"/payments/recurring",transformResponse:(r:ApiResponse<RecurringBilling[]>)=>r.data,providesTags:["Payment"]}),
  cancelRecurringAgreement:builder.mutation<RecurringBilling,string>({query:(id)=>({url:`/payments/recurring/${id}/cancel`,method:"POST"}),transformResponse:(r:ApiResponse<RecurringBilling>)=>r.data,invalidatesTags:["Payment"]}),
})});
export const {useGetQuotesQuery,useGetQuoteQuery,useCreateQuoteMutation,useUpdateQuoteMutation,useSendQuoteMutation,useGetPublicQuoteQuery,useAcceptPublicQuoteMutation,useDeclinePublicQuoteMutation,useConvertPublicQuoteMutation,useGetInvoicesQuery,useGetInvoiceQuery,useGetFinanceSummaryQuery,useSendInvoiceMutation,useCreateInvoicePaymentLinkMutation,useRecordManualPaymentMutation,useVoidInvoiceMutation,useStartRecurringBillingMutation,useCancelRecurringBillingMutation,useGetPublicInvoiceQuery,usePayPublicInvoiceMutation,useStartPublicRecurringBillingMutation,useGetPaymentsQuery,useRefundPaymentMutation,useGetRecurringBillingQuery,useCancelRecurringAgreementMutation}=financeApi;
