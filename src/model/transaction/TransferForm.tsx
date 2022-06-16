import { useCallback, useEffect, useState } from 'react'
import {
  Toolbar,
  Paper,
  Box,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Skeleton,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { RefreshRounded } from '@mui/icons-material'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'
import type { FieldError } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSnackbar } from 'notistack'
import { sendToken, getLamportsBalance, requestAirdrop } from './Transfer'
import {
  SignerWalletAdapterProps,
  WalletAdapterNetwork,
} from '@solana/wallet-adapter-base'
import { useTheme } from '@mui/material/styles'

const toAddressMaxLength = 44

const schema = z.object({
  toAddress: z
    .string()
    .max(toAddressMaxLength)
    .nonempty({ message: 'Required' }),
  sol: z.number().nonnegative(),
})

type FormInput = {
  toAddress: string
  sol: number
}

type Props = {
  publicKey: PublicKey
  signTransaction: SignerWalletAdapterProps['signTransaction']
  connection: Connection
  network: WalletAdapterNetwork
  fetchTransactions: () => Promise<void>
}

export default function TransferForm({
  publicKey,
  signTransaction,
  connection,
  network,
  fetchTransactions,
}: Props) {
  const { t } = useTranslation(['translation'])
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [airdropLoading, setAirdropLoading] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)

  const getBalance = useCallback(async () => {
    setBalanceLoading(true)
    try {
      const lamportsBalance = await getLamportsBalance(connection, publicKey)
      const solBalance = lamportsBalance / LAMPORTS_PER_SOL
      setBalance(solBalance)
    } catch {
      enqueueSnackbar(`${t('getBalanceError')}`, { variant: 'error' })
    } finally {
      setBalanceLoading(false)
    }
  }, [setBalance, connection, enqueueSnackbar, publicKey, t])

  const handleRequestAirdrop = useCallback(async () => {
    setAirdropLoading(true)
    try {
      await requestAirdrop(connection, publicKey)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch {
      enqueueSnackbar(`${t('tryLater')}`, { variant: 'error' })
    } finally {
      await getBalance()
      enqueueSnackbar(`${t('airdropSuccess')}`, { variant: 'success' })
      setAirdropLoading(false)
    }
  }, [enqueueSnackbar, setAirdropLoading, connection, getBalance, publicKey, t])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      toAddress: '',
      sol: 0.01,
    },
  })

  const onSubmit = useCallback(
    async (input: FormInput) => {
      setLoading(true)
      try {
        const lamports = input.sol * LAMPORTS_PER_SOL
        await sendToken(
          connection,
          publicKey,
          input.toAddress,
          signTransaction,
          lamports
        )
        await new Promise((resolve) => setTimeout(resolve, 2000))
        await getBalance()
        enqueueSnackbar(`${t('sendTokenSuccess')}`, { variant: 'success' })
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('UserRejected')) {
            enqueueSnackbar(`${t('sendTokenRejected')}`, {
              variant: 'info',
            })
          } else {
            enqueueSnackbar(`${t('sendTokenError')}`, {
              variant: 'error',
            })
          }
        }
      } finally {
        await fetchTransactions()
        setLoading(false)
      }
    },
    [
      t,
      connection,
      enqueueSnackbar,
      fetchTransactions,
      getBalance,
      publicKey,
      signTransaction,
    ]
  )

  const toAddressErrorHelperText = useCallback(
    (error: FieldError | undefined) => {
      if (!error) return ''
      if (error.type === 'too_big') {
        return t('tooLongMessage', { length: toAddressMaxLength })
      }
      if (error.type === 'too_small') {
        return t('requiredMessage')
      }
      return t('pleaseCheckValue')
    },
    [t]
  )

  const solErrorHelperText = useCallback(
    (error: FieldError | undefined) => {
      if (!error) return ''
      return t('pleaseCheckValue')
    },
    [t]
  )

  useEffect(() => {
    getBalance()
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper>
          <Box p={3} textAlign="center">
            <Box py={2}>
              <Typography variant="h4">GM 🙌 </Typography>
            </Box>

            <Box pb={6}>
              <Toolbar variant="dense">
                <div style={{ flexGrow: 1 }} />
                <Typography variant="caption">
                  {t('balance')} ({network})
                </Typography>

                <Tooltip title={t('update') || false} placement="top">
                  <IconButton edge="end" onClick={() => getBalance()}>
                    <RefreshRounded />
                  </IconButton>
                </Tooltip>
                <div style={{ flexGrow: 1 }} />
              </Toolbar>
              {balanceLoading ? (
                <Box>
                  <Skeleton height={32} width="50%" sx={{ margin: '0 auto' }} />
                </Box>
              ) : (
                <Typography variant="h3">
                  {balance}
                  <span
                    style={{ fontSize: '1.33333rem', marginLeft: '0.8rem' }}
                  >
                    SOL
                  </span>
                </Typography>
              )}
              <Box py={2}>
                <LoadingButton
                  variant="outlined"
                  size="small"
                  color="secondary"
                  loading={airdropLoading}
                  onClick={() => {
                    handleRequestAirdrop()
                  }}
                >
                  GET 1 SOL
                </LoadingButton>
              </Box>
            </Box>
            <Box
              p={2}
              sx={{
                background: `${theme.palette.background.default}`,
                borderRadius: `${theme.shape.borderRadius}px`,
              }}
            >
              <Box py={1}>
                <Typography variant="h6">{t('transfer')}</Typography>
              </Box>
              <Box py={1}>
                <Controller
                  name="toAddress"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      minRows={1}
                      required
                      fullWidth
                      label={t('toAddress')}
                      margin="normal"
                      error={!!errors.toAddress}
                      helperText={toAddressErrorHelperText(errors.toAddress)}
                    />
                  )}
                />
              </Box>
              <Box py={1}>
                <Controller
                  name="sol"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      required
                      fullWidth
                      type="number"
                      label={t('sendingSol')}
                      margin="normal"
                      error={!!errors.sol}
                      helperText={solErrorHelperText(errors.sol)}
                    />
                  )}
                />
              </Box>
              <Box py={2}>
                <LoadingButton
                  variant="contained"
                  color="secondary"
                  fullWidth
                  type="submit"
                  loading={loading}
                >
                  {t('executeTransaction')}
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      </form>
    </>
  )
}
