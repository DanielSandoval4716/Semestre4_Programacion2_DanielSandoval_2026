import {
  View,
  FlatList,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const [Tar, cTar] = useState([]);
  const [texto1, cte1] = useState("");
  const [texto2, cte2] = useState("");
  const [View_tareas, cVT] = useState(false);
  let formulario, botonsito;
  function Guardar(No, Nombre) {
    const tarea = {
      id: Tar.length + 1,
      Descri: No,
      Nombre: Nombre,
    };
    cTar([...Tar, tarea]);
    cte2("");
    cte2("");
  }
  if (View_tareas) {
    botonsito = (
      <Button title="Guardar" onPress={() => Guardar(texto1, texto2)}></Button>
    );
    formulario = (
      <View style={styles.formulario}>
        <View style={styles.entradas}>
          <TextInput
            style={styles.input}
            value={texto2}
            onChangeText={cte2}
          ></TextInput>
          <TextInput
            style={styles.input}
            value={texto1}
            onChangeText={cte1}
          ></TextInput>
        </View>
        <View style={styles.entradas}>
          <Text style={styles.acomp_inpu}>Nombre</Text>
          <Text style={styles.acomp_inpu}>Descripcion</Text>
        </View>
      </View>
    );
  } else {
    formulario = null;
    botonsito = (
      <Button title="Nueva Tarea" onPress={() => cVT(!View_tareas)}></Button>
    );
  }
  return (
    <ScrollView style={styles.principal}>
      <View style={styles.parte_superior}>
        <View>{botonsito}</View>
        {formulario}
      </View>
      <View style={styles.parte_inferior}>
        <FlatList
          ListEmptyComponent={() => {
            return (
              <View>
                <Text style={styles.titulo}>No hay tareas</Text>
              </View>
            );
          }}
          data={Tar}
          keyExtractor={(tarea) => tarea.id.toString()}
          renderItem={(tarea) => {
            return (
              <View style={styles.info_fila}>
                <Text style={styles.text_fila}>{tarea.item.id}</Text>
                <Text style={styles.text_fila}>{tarea.item.Nombre}</Text>
                <Text style={styles.text_fila}>{tarea.item.Descri}</Text>
                <Button title="Eliminar Tarea"></Button>
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
  entradas: {
    width: "50%",
    padding: 20,
    flexDirection: "column",
  },
  formulario: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  input: {
    padding: 10,
    margin: 10,
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
  },
  acomp_inpu: {
    padding: 10,
    margin: 10,
    fontSize: 17,
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
});
