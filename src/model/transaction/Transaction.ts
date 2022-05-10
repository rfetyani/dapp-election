import { Connection, PublicKey, TransactionResponse } from '@solana/web3.js'

export type TransactionWithSignature = {
  signature: string
  transactionResponse: TransactionResponse
}

export async function getTransactions(
  connection: Connection,
  publicKey: PublicKey
): Promise<TransactionWithSignature[]> {
  const transactionSignatures =
    await connection.getConfirmedSignaturesForAddress2(publicKey)
  const transactionsWS: TransactionWithSignature[] = []

  for (let i = 0; i < transactionSignatures.length; i++) {
    const { signature } = transactionSignatures[i]
    const transactionResponse = await connection.getTransaction(signature)
    if (transactionResponse) {
      const transactionWithSignature = {
        signature,
        transactionResponse,
      }
      transactionsWS.push(transactionWithSignature)
    }
  }
  return transactionsWS
}
