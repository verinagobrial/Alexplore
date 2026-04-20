// lib/payment/payment-service.client.ts
'use client'

export interface PaymentRequest {
  amount: number
  currency: string
  method: string
  customerDetails: {
    name: string
    email: string
    phone?: string
    nationalId?: string
  }
  bookingDetails: {
    packageId: string
    packageName: string
    guests: number
    date: string
  }
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  redirectUrl?: string
  qrCode?: string
  instructions?: string
  error?: string
}

export class PaymentServiceClient {
  
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('Processing payment request:', {
        method: request.method,
        amount: request.amount,
        currency: request.currency
      })

      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('Payment API error:', data)
        throw new Error(data.error || 'Payment processing failed')
      }

      console.log('Payment response:', data)
      return data
    } catch (error) {
      console.error('Payment error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment processing failed' 
      }
    }
  }

  // Handle local Egyptian payment methods with QR codes
  async processLocalPayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log('Processing local payment:', request.method)
    
    switch (request.method) {
      case 'vodafone_cash':
        return this.generateVodafoneCashQR(request)
      case 'orange_money':
        return this.generateOrangeMoneyQR(request)
      case 'etisalat_cash':
        return this.generateEtisalatCashQR(request)
      case 'instapay':
        return this.generateInstaPayQR(request)
      default:
        // For other methods, send to server
        return this.processPayment(request)
    }
  }

  private async generateVodafoneCashQR(request: PaymentRequest): Promise<PaymentResponse> {
    const transactionId = `VC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const phoneNumber = '01000000000' // Your business Vodafone Cash number
    
    const qrData = {
      merchant: 'Alexplore',
      amount: request.amount,
      currency: request.currency,
      reference: transactionId,
      phone: phoneNumber,
      customer: request.customerDetails.phone
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrData))}`

    return {
      success: true,
      transactionId,
      qrCode: qrCodeUrl,
      instructions: `Send ${request.amount} EGP to Vodafone Cash number: ${phoneNumber}. Reference: ${transactionId}`
    }
  }

  private async generateOrangeMoneyQR(request: PaymentRequest): Promise<PaymentResponse> {
    const transactionId = `OM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const phoneNumber = '01200000000' // Your business Orange Money number
    
    return {
      success: true,
      transactionId,
      instructions: `Send ${request.amount} EGP to Orange Money number: ${phoneNumber}. Reference: ${transactionId}`,
      qrCode: await this.generateQRCode({
        amount: request.amount,
        reference: transactionId,
        merchant: 'Alexplore',
        phone: phoneNumber
      })
    }
  }

  private async generateEtisalatCashQR(request: PaymentRequest): Promise<PaymentResponse> {
    const transactionId = `EC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const phoneNumber = '01100000000' // Your business Etisalat Cash number
    
    return {
      success: true,
      transactionId,
      instructions: `Send ${request.amount} EGP to Etisalat Cash number: ${phoneNumber}. Reference: ${transactionId}`,
      qrCode: await this.generateQRCode({
        amount: request.amount,
        reference: transactionId,
        merchant: 'Alexplore',
        phone: phoneNumber
      })
    }
  }

  private async generateInstaPayQR(request: PaymentRequest): Promise<PaymentResponse> {
    const transactionId = `IP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const merchantCode = '123456' // Your InstaPay merchant code
    
    return {
      success: true,
      transactionId,
      instructions: `Pay ${request.amount} EGP via InstaPay using merchant code: ${merchantCode}`,
      qrCode: await this.generateQRCode({
        merchant: 'Alexplore',
        merchantCode,
        amount: request.amount,
        reference: transactionId
      })
    }
  }

  private async generateQRCode(data: any): Promise<string> {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`
  }
}

export const paymentServiceClient = new PaymentServiceClient()