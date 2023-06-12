import { useState } from "react";
import { View } from "react-native";

const useDialog = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const DialogComponent = () => {
    return <View></View>;
  };

  return {
    DialogComponent,
    handleOpen,
    handleClose,
  };
};

export { useDialog };
