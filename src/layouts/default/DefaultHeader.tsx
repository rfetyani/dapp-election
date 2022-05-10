import { Box, Container, Toolbar, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useNavigate } from 'react-router'

import LanguageChanger from '@/components/theme/LanguageChanger'
import ColorModeChanger from '@/components/theme/ColorModeChanger'

import logoHorizontal from '@/assets/img/logo/Epics-logo-horizontal.svg'
import logoHorizontalWhite from '@/assets/img/logo/Epics-logo-horizontal-white.svg'

import logo from '@/assets/img/logo/Epics-logo.svg'
import logoWhite from '@/assets/img/logo/Epics-logo-white.svg'

import { useRecoilValue } from 'recoil'
import { colorModeState } from '@/store/colorMode'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function DefaultHeader() {
  const colorMode = useRecoilValue(colorModeState)
  const navigate = useNavigate()
  const theme = useTheme()
  const xsDisplay = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Container maxWidth="lg">
        <Toolbar>
          {xsDisplay && (
            <Box
              onClick={() => {
                navigate('/')
              }}
              style={{ cursor: 'pointer' }}
            >
              <LazyLoadImage
                width="40"
                height="40"
                src={colorMode === 'light' ? logo : logoWhite}
                alt="Logo"
                effect="opacity"
              />
            </Box>
          )}
          {!xsDisplay && (
            <Box
              onClick={() => {
                navigate('/')
              }}
              style={{ cursor: 'pointer' }}
            >
              <LazyLoadImage
                width="140"
                height="40"
                src={
                  colorMode === 'light' ? logoHorizontal : logoHorizontalWhite
                }
                alt="Logo"
                effect="opacity"
              />
            </Box>
          )}

          <div style={{ flexGrow: 1 }} />
          {!xsDisplay && <LanguageChanger />}
          {!xsDisplay && <ColorModeChanger />}
          <Box pl={2}>
            <WalletMultiButton />
          </Box>
        </Toolbar>
      </Container>
    </>
  )
}
