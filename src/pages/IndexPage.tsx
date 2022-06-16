import { useState, useEffect, useCallback } from 'react'
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  Chip,
  Toolbar,
  Tooltip,
  IconButton,
} from '@mui/material'
import { RefreshRounded } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import DataLoading from '@/components/loading/DataLoading'
import BlockLoading from '@/components/loading/BlockLoading'

import { useWallet } from '@solana/wallet-adapter-react'
import { useTranslation } from 'react-i18next'
import {
  getTransactions,
  TransactionWithSignature,
} from '@/model/transaction/Transaction'
import { useRecoilValue } from 'recoil'
import { walletState } from '@/store/wallet'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useSnackbar } from 'notistack'

import TransactionsList from '@/model/transaction/TransactionsList'
import TransferForm from '@/model/transaction/TransferForm'

export default function IndexPage() {
  const { t } = useTranslation(['translation'])
  const { publicKey, signTransaction } = useWallet()
  const { network, connection } = useRecoilValue(walletState)
  const [transactionsWS, setTransactionsWS] =
    useState<TransactionWithSignature[]>()
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const xsDisplay = useMediaQuery(theme.breakpoints.down('sm'))
  const { enqueueSnackbar } = useSnackbar()

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      if (publicKey) {
        const transactionsWS = await getTransactions(connection, publicKey)
        setTransactionsWS(transactionsWS)
      }
    } catch {
      enqueueSnackbar(`${t('sendTokenError')}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [publicKey])

  useEffect(() => {
    fetchTransactions()
  }, [publicKey])

  if (!publicKey) {
    return (
      <>
        <Container maxWidth="sm">
          <Box py={8}>
            <Paper>
              <Box px={xsDisplay ? 4 : 6} py={6}>
                <Typography variant="h3">{t('pleaseConnect')}</Typography>
                <Box pt={6}>
                  <WalletMultiButton />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </>
    )
  }

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={5} xl={5}>
            {!signTransaction ? (
              <BlockLoading />
            ) : (
              <TransferForm
                publicKey={publicKey}
                signTransaction={signTransaction}
                connection={connection}
                network={network}
                fetchTransactions={fetchTransactions}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={7} xl={7}>
            <Box>
              <Typography variant="h3">{t('transactions')}</Typography>
              <Typography variant="caption">
                {t('wallet')}: {publicKey?.toBase58()}
              </Typography>
            </Box>
            <Toolbar variant="dense" disableGutters>
              <Box>
                <Chip label={network} color="secondary" size="small" />
              </Box>
              <div style={{ flexGrow: 1 }} />
              <Box px={2}>
                <Tooltip title={t('update') || false} placement="top">
                  <IconButton edge="end" onClick={() => fetchTransactions()}>
                    <RefreshRounded />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>

            <Box pb={4}>
              {!transactionsWS || loading ? (
                <DataLoading />
              ) : (
                <TransactionsList
                  publicKey={publicKey}
                  transactionsWS={transactionsWS}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
