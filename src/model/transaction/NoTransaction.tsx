import { Box, Typography } from '@mui/material'
import { InboxRounded } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'

export default function NoTransaction() {
  const { t } = useTranslation(['translation'])
  const theme = useTheme()

  return (
    <>
      <Box
        p={4}
        sx={{
          border: `1px solid ${theme.palette.grey[300]}`,
          borderRadius: `${theme.shape.borderRadius}px`,
        }}
      >
        <Typography align="center">
          <InboxRounded
            style={{
              color: theme.palette.secondary.light,
              fontSize: '80px',
            }}
          />
        </Typography>
        <Typography
          align="center"
          variant="h6"
          sx={{ color: theme.palette.secondary.light }}
        >
          {t('noTransaction')}
        </Typography>
      </Box>
    </>
  )
}
