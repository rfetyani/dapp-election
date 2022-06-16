import { SignerWalletAdapterProps } from '@solana/wallet-adapter-base'
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionBlockhashCtor,
  TransactionInstruction,
} from '@solana/web3.js'

export async function sendToken(
  connection: Connection,
  fromPubkey: PublicKey,
  toAddress: string,
  signTransaction: SignerWalletAdapterProps['signTransaction'],
  lamports: number = 10_000_000
) {
  try {
    const toPubkey = new PublicKey(toAddress)
    const instruction = SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })

    const transaction = await generateTransaction(
      connection,
      fromPubkey,
      instruction
    )

    await signAndSendTransaction(connection, signTransaction, transaction)
  } catch (error) {
    console.error('sendToken failed: ', error)
    if (error instanceof Error) {
      if (error.message.includes('User rejected the request')) {
        throw Error('UserRejected')
      }
    }
  }
}

async function generateTransaction(
  connection: Connection,
  feePayer: PublicKey,
  instruction: TransactionInstruction
): Promise<Transaction> {
  const recentBlockhash = await connection.getLatestBlockhash()
  const options: TransactionBlockhashCtor = {
    feePayer,
    blockhash: recentBlockhash.blockhash,
    lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
  }
  const transaction = new Transaction(options)
  transaction.add(instruction)
  return transaction
}

async function signAndSendTransaction(
  connection: Connection,
  signTransaction: SignerWalletAdapterProps['signTransaction'],
  transaction: Transaction
): Promise<string> {
  const signedTransaction = await signTransaction(transaction)
  const signature = await connection.sendRawTransaction(
    signedTransaction.serialize()
  )
  return signature
}

export async function getLamportsBalance(
  connection: Connection,
  publicKey: PublicKey
) {
  return await connection.getBalance(publicKey)
}

export async function requestAirdrop(
  connection: Connection,
  publicKey: PublicKey
) {
  await connection.requestAirdrop(publicKey, 1e9)
}
