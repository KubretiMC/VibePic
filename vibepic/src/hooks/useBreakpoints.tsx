import { useMediaQuery } from '@mui/material';

const useBreakpoints = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1100px)');
  const isMediumScreen = useMediaQuery('(min-width: 800px)');
  const isSmallScreen = useMediaQuery('(min-width: 650px)');
  const isVerySmallScreen = useMediaQuery('(min-width: 550px)');

  return { isLargeScreen, isMediumScreen, isSmallScreen, isVerySmallScreen };
};

export default useBreakpoints;
