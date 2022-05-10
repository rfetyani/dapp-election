import { useMemo } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { TransactionWithSignature } from './Transaction'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useTheme } from '@mui/material/styles'
import { mask } from '@/utils/processing'
import { useTranslation } from 'react-i18next'

type Props = {
  publicKey: PublicKey
  transactionWS: TransactionWithSignature
}

export default function TransactionItem({ publicKey, transactionWS }: Props) {
  const { t } = useTranslation(['translation'])
  const theme = useTheme()
  const { meta, transaction, blockTime } = transactionWS.transactionResponse
  const time = useMemo(
    () => new Date(blockTime! * 1000).toLocaleString(),
    [blockTime]
  )
  const sender = useMemo(
    () => transaction.message.accountKeys[0].toBase58(),
    [transaction]
  )
  const receiver = useMemo(
    () => transaction.message.accountKeys[1].toBase58(),
    [transaction]
  )
  const senderIsYou = useMemo(() => sender === publicKey.toBase58(), [sender])
  const receiverIsYou = useMemo(
    () => receiver === publicKey.toBase58(),
    [receiver]
  )
  const fee = useMemo(() => meta?.fee! / LAMPORTS_PER_SOL, [meta])
  const amount = useMemo(
    () =>
      (meta?.preBalances[0]! - meta?.postBalances[0]!) / LAMPORTS_PER_SOL - fee,
    [meta, fee]
  )

  return (
    <>
      <Paper>
        <Box px={3} py={2}>
          <Box py={1}>
            <Box>
              <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                {t('signature')}: {mask(transactionWS.signature)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                {t('blockTime')}: {time}
              </Typography>
            </Box>
          </Box>

          <Box py={1}>
            <Box>
              <Typography
                variant="caption"
                fontWeight={500}
                color={senderIsYou ? 'error.main' : ''}
              >
                {t('sender')}: {sender}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                fontWeight={500}
                color={receiverIsYou ? 'success.main' : ''}
              >
                {t('receiver')}: {receiver}
              </Typography>
            </Box>
          </Box>
          <Box
            p={1}
            sx={{
              background: `${theme.palette.background.default}`,
              borderRadius: `${theme.shape.borderRadius}px`,
            }}
          >
            <Box p={2}>
              <Typography variant="h5">
                {t('sentAmount')}: {amount} SOL
              </Typography>
              <Typography
                variant="caption"
                fontWeight={500}
                color="secondary.light"
              >
                {t('fee')}: {fee} SOL
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  )
}
