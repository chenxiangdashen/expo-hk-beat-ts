import { TextInput } from "react-native";
import React from "react";
import { Button, Text, useColorMode } from "native-base";
import { login } from "@/api/auth/login";
import md5 from "md5";
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEY } from "@/enums/cacheEnum";
import { useAppDispatch } from "@/hooks/store_hooks";
import { setToken } from "@/store/features/auth/UserInfoSlice";
import { useBox } from "@/hooks/useBox";

export default function SignInScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useAppDispatch();
  const { toggleColorMode, colorMode } = useColorMode();
  const { UseComponentBox } = useBox();
  return (
    <UseComponentBox>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign in"
        onPress={async () => {
          try {
            const params = {
              username: "hkcsdl",
              password: md5("mm123456"),
            };
            const token = await login(params);
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            dispatch(setToken(token));
          } catch (e) {
            console.log(e);
          }
        }}
      />

      <Text fontSize="lg">{colorMode}</Text>
      <Button onPress={toggleColorMode}>
        登录
      </Button>
    </UseComponentBox>
  );
}
