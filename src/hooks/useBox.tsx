import { Box, useColorModeValue } from "native-base";

const useBox = () => {
  function UseComponentBox({ children }) {
    const backgroundColor = useColorModeValue("warmGray.50", "coolGray.800");
    return (
      <Box w="100%" h="100%" bg={backgroundColor}>
        {children}
      </Box>
    );
  }

  return { UseComponentBox };
};

export { useBox };
