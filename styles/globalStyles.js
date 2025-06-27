// src/styles/globalStyles.js
import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  imageTouchable: {
    width: 180,
    height: 180,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#648DDB",
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    tintColor: "#999",
    resizeMode: "contain",
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: 56,
    backgroundColor: "#FF575A",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    margin: 5,
    marginTop: 7,
    padding: 2,
  },
  errorText: {
    color: "red",
    margin: 5,
  },
  snackbar: {
    backgroundColor: "#E7F9ED",
    borderRadius: 12,
  },
  snackbarContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  snackbarIcon: {
    marginRight: 8,
  },
  snackbarText: {
    color: "#219653",
  },
  button: {
    flex: 1,
  },
  buttonDelete: {
    marginRight: 8,
  },
  buttonSave: {
    flex: 2,
  },
  buttonContent: {
    height: 48,
  },
  fixedButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 6,
  },
  status: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "flex-start",
  },
  desc: {
    fontSize: 12,
    color: "#444",
    marginTop: 2,
  },
  lastData: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
  },
  infoLine: {
    fontSize: 12,
    marginTop: 5,
  },
  label: {
    fontWeight: "bold",
  },
  dividerVertical: {
    width: 1.3,
    backgroundColor: "#DDD",
    margin: 10,
    marginVertical: 8,
  },
  statusWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sortButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button_order: {
    marginRight: 4,
    borderRadius: 4,
    padding: 0,
  },
});

export default globalStyles;
