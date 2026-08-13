import {
  View,
  FlatList,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
export default function HomeScreen() {
  const tareas = [
    { id: "1", titulo: "Tarea 1", descripcion: "Descripción de la tarea 1" },
  ];
  return (
    <ScrollView style={styles.principal}>
      <View style={styles.parte_superior}>
        <Button title="nueva tarea"></Button>
        <TextInput style={styles.input}></TextInput>
      </View>
      <View style={styles.parte_inferior}>
        <FlatList
          data={tareas}
          keyExtractor={(tarea) => tarea.id}
          renderItem={(tarea) => {
            return (
              <View style={styles.info_fila}>
                <Text style={styles.text_fila}>{tarea.item.id}</Text>
                <Text style={styles.text_fila}>{tarea.item.titulo}</Text>
                <Text style={styles.text_fila}>{tarea.item.descripcion}</Text>
              </View>
            );
          }}
        ></FlatList>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  principal: {
    flex: 1,
    padding: 20,
    flexDirection: "column",
  },
  parte_superior: {
    padding: 20,
    margin: 10,
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
  },
  input: {
    padding: 10,
    margin: 10,
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
  },
  botonsito: {
    padding: 10,
    margin: 10,
  },
  parte_inferior: {
    padding: 20,
    margin: 10,
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
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
});
