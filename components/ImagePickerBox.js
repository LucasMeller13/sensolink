import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import styles from "../styles/globalStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ImagePickerBox({ imageUri, onPick, onRemove }) {
  return (
    <View style={styles.imageWrapper}>
      <TouchableOpacity onPress={onPick}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require("../assets/camera-icon.png")
          }
          style={[
            styles.imageTouchable,
            !imageUri && styles.placeholderImage,
          ]}
        />
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity
          style={styles.removeImageButton}
          onPress={onRemove}
        >
          <MaterialIcons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
