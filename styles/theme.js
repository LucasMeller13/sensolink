import { DefaultTheme } from "react-native-paper";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#648DDB",
    accent: "#FF575A",
    background: "#FFFFFF",
    surface: "#FFFFFF",
    text: "#333333",
    placeholder: "#999999",
    error: "#FF3333",
    success: "#33cc66",
  },
  roundness: 12,
};

export default theme;
