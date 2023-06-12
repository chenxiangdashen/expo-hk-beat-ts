import * as React from "react";
import Page from "@/index";
import { Provider } from "react-redux";
import store from "@/store";
import { NativeBaseProvider, extendTheme } from "native-base";
import type { StorageManager } from "native-base";
import * as SecureStore from "expo-secure-store";
import { COLOR_MODE_KEY } from "@/enums/cacheEnum";

export default () => {
  const theme = extendTheme({
    colors: {
      // Add new color
      primary: {
        50: '#E3F2F9',
        100: '#C5E4F3',
        200: '#A2D4EC',
        300: '#7AC1E4',
        400: '#47A9DA',
        500: '#c958e3',
        600: '#db04e3',
        700: '#006BA1',
        800: '#005885',
        900: '#003F5E',
      },
      // Redefining only one shade, rest of the color will remain same.
      amber: {
        400: '#d97706',
      },
    },
  });

  const colorModeManager: StorageManager = {
    get: async () => {
      try {
        const val = await SecureStore.getItemAsync(COLOR_MODE_KEY);
        return val === "dark" ? "dark" : "light";
      } catch (e) {
        console.log(e);
        return "light";
      }
    },
    set: async (value) => {
      try {
        await SecureStore.setItemAsync(COLOR_MODE_KEY, value);
      } catch (e) {
        console.log(e);
      }
    },
  };
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme} colorModeManager={colorModeManager}>
        <Page />
      </NativeBaseProvider>
    </Provider>
  );
};
