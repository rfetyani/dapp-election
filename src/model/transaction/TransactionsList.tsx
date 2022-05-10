import { Box } from '@mui/material'
import { TransactionWithSignature } from './Transaction'
import { PublicKey } from '@solana/web3.js'
import NoTransaction from './NoTransaction'
import TransactionItem from './TransactionItem'

type Props = {
  publicKey: PublicKey
  transactionsWS: TransactionWithSignature[]
}
export default function TransactionsList({ publicKey, transactionsWS }: Props) {
  if (!transactionsWS.length) {
    return (
      <Box py={2}>
        <NoTransaction />
      </Box>
    )
  }
  return (
    <>
      {transactionsWS.map((transactionWS) => (
        <Box py={2} key={transactionWS.signature}>
          <TransactionItem
            publicKey={publicKey}
            transactionWS={transactionWS}
          />
        </Box>
      ))}
    </>
  )
}
