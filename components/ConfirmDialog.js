import React from "react";
import { Dialog, Button, Text } from "react-native-paper";

export default function ConfirmDialog({ visible, onCancel, onConfirm, title, children, confirmText = "Confirmar" }) {
  return (
    <Dialog visible={visible} onDismiss={onCancel}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text>{children}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onCancel}>Cancelar</Button>
        <Button onPress={onConfirm}>{confirmText}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
