import { Container, Toolbar, Typography, Box, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { useRecoilValue } from 'recoil'
import { colorModeState } from '@/store/colorMode'
import { EpicsGrey } from '@/constants/colors'

export default function DefaultFooter() {
  const colorMode = useRecoilValue(colorModeState)
  return (
    <>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="caption">©2022 Epics DAO</Typography>
          <div style={{ flexGrow: 1 }} />
          <Box pr={1}>
            <IconButton
              href={`https://twitter.com/EpicsDAO`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter link"
            >
              <FontAwesomeIcon
                color={colorMode === 'light' ? EpicsGrey[400] : '#FFFFFF'}
                icon={faTwitter}
                size="sm"
                aria-label="Twitter icon"
              />
            </IconButton>
          </Box>
          <Box>
            <IconButton
              href={`https://github.com/EpicsDAO`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub link"
            >
              <FontAwesomeIcon
                color={colorMode === 'light' ? EpicsGrey[400] : '#FFFFFF'}
                icon={faGithub}
                size="sm"
                aria-label="GitHub icon"
              />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </>
  )
}
