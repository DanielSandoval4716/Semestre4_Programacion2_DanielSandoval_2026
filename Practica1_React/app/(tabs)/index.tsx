import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Platform,
  Alert,
} from "react-native";

function saludar() {
  const mens =
    "El repositorio de GitHub es: https://github.com/DanielSandoval4716/Semestre4_Programacion2_DanielSandoval_2026";
  if (Platform.OS == "web") {
    window.alert(mens);
  } else {
    Alert.alert(mens);
  }
}

export default function Carta_estudiante() {
  return (
    <View style={styles.princiapl}>
      <Image
        style={styles.foto}
        source={{
          uri: "https://commons.wikimedia.org/wiki/Special:FilePath/Escudo_de_la_universidad_Mariano_G%C3%A1lvez_Guatemala.svg",
        }}
      ></Image>

      <View style={styles.ca}>
        <Text style={styles.titulo}>Daniel Estuardo Sandoval Torres</Text>

        <View style={styles.info_fila}>
          <Text style={styles.text_fila}>Carné:</Text>
          <Text style={styles.text_fila}>0907-25-11351</Text>
        </View>

        <View style={styles.info_fila}>
          <Text style={styles.text_fila}>Carrera:</Text>
          <Text style={styles.text_fila}>Ingenieria en Sistemas</Text>
        </View>

        <View style={styles.descripcont}>
          <Text style={styles.text_fila}>Descripción:</Text>
          <Text style={styles.text_fila}>
            Soy un alumno de universidad mariano Galvez sede Jalapa, actualmente
            cursando la carrera de ingenieria en Sistemas.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Ver más" onPress={() => saludar()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  princiapl: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  ca: {
    width: "50%",
    padding: 20,
    margin: 10,
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
  },
  foto: {
    width: "10%",
    height: "18%",
    padding: 10,
    margin: 10,
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
