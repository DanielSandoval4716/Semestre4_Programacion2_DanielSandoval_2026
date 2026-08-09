import { View, Text, Button, StyleSheet } from "react-native";

export default function StudentCardScreen() {
  return (
    <View style={styles.cont}>
      <View style={styles.foto}>
        <Text style={styles.titulo}>pendiente la foto</Text>
      </View>

      <View style={styles.ca}>
        <Text style={styles.titulo}>Nombre</Text>

        <View style={styles.info_fila}>
          <Text style={styles.text_fila}>Carné:</Text>
          <Text style={styles.text_fila}>Prueba</Text>
        </View>

        <View style={styles.info_fila}>
          <Text style={styles.text_fila}>Carrera:</Text>
          <Text style={styles.text_fila}>Prueba</Text>
        </View>

        <View style={styles.descripcont}>
          <Text style={styles.text_fila}>Descripción:</Text>
          <Text style={styles.text_fila}>Prueba</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Ver más" onPress={() => {}} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  ca: {
    width: "50%",
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  foto: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#999",
  },
  titulo: {
    fontSize: 18,
    textAlign: "center",
    margin: 10,
  },
  info_fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    margin: 5,
  },
  text_fila: {
    fontSize: 17,
  },
  descripcont: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "white",
  },
  buttonContainer: {
    margin: 15,
    alignItems: "center",
  },
});
