import * as React from "react";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import IndexScreen from "@/pages/home/IndexScreen";
import SignInScreen from "@/pages/signIn/SignInScreen";
import { TOKEN_KEY } from "@/enums/cacheEnum";
import { qryUserInfo } from "@/api/auth/login";
import { useAppDispatch, useAppSelector } from "@/hooks/store_hooks";
import { setToken } from "@/store/features/auth/UserInfoSlice";
import { useDialog } from "@/hooks/useDialog";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();

interface State {
  isLoading: boolean;
}

export default function App() {
  const { handleOpen, handleClose, DialogComponent } = useDialog();

  const [isReady, setIsReady] = useState<boolean>(false);
  const [state, setState] = React.useState<State>({
    isLoading: true,
  });
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.userInfo.token);

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (userToken !== null && userToken !== "") {
          await dispatch(setToken(userToken));
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsReady(true);
      }
    };
    bootstrapAsync();
  }, []);

  React.useEffect(() => {
    if (token !== null && token !== "") {
      try {
        qryUserInfo().then((res) => {
          // console.log("qryUserInfo", res);
        });
      } catch (e) {
        // console.log(e);
      }
    }
  }, [token]);

  const onLayoutRootView = React.useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }
  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {token == null || token === "" ? (
            <Stack.Screen name="SignIn" component={SignInScreen} />
          ) : (
            <Stack.Screen name="Index" component={IndexScreen} />
          )}
        </Stack.Navigator>
        <DialogComponent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
