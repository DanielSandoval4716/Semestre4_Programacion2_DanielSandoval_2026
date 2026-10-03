import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { supabase } from '@/database/supabase';
import { useTheme } from '@/hooks/use-theme';
import { Estudiante, NuevoEstudiante } from '@/models/Estudiante';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EstudiantesScreen() {
  const theme = useTheme();

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [editando, setEditando] = useState<Estudiante | null>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [carrera, setCarrera] = useState('');

  const cargar = async () => {
    const { data, error } = await supabase.from('estudiantes').select('*').order('nombre');
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    setEstudiantes((data ?? []) as Estudiante[]);
  };

  useEffect(() => {
    cargar();
  }, []);

  const limpiar = () => {
    setEditando(null);
    setNombre('');
    setEmail('');
    setCarrera('');
  };

  const guardar = async () => {
    if (!nombre.trim() || !email.trim() || !carrera.trim()) {
      Alert.alert('Faltan datos', 'Llena todos los campos');
      return;
    }

    const datos: NuevoEstudiante = {
      nombre: nombre.trim(),
      email: email.trim(),
      carrera: carrera.trim(),
    };

    const resultado = editando
      ? await supabase.from('estudiantes').update(datos).eq('id', editando.id)
      : await supabase.from('estudiantes').insert(datos);

    if (resultado.error) {
      Alert.alert('Error', resultado.error.message);
      return;
    }

    limpiar();
    cargar();
  };

  const editar = (estudiante: Estudiante) => {
    setEditando(estudiante);
    setNombre(estudiante.nombre);
    setEmail(estudiante.email);
    setCarrera(estudiante.carrera);
  };

  const eliminar = async (estudiante: Estudiante) => {
    const { error } = await supabase.from('estudiantes').delete().eq('id', estudiante.id);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    cargar();
  };

  const confirmarEliminar = (estudiante: Estudiante) => {
    Alert.alert('Eliminar', `¿Eliminar a ${estudiante.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => eliminar(estudiante) },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Estudiantes</ThemedText>

        <ThemedView type="backgroundElement" style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor={theme.textSecondary}
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
            value={carrera}
            onChangeText={setCarrera}
            placeholder="Carrera"
            placeholderTextColor={theme.textSecondary}
          />

          <Pressable onPress={guardar}>
            <ThemedView type="backgroundSelected" style={styles.button}>
              <ThemedText type="smallBold">{editando ? 'Actualizar' : 'Agregar'}</ThemedText>
            </ThemedView>
          </Pressable>

          {editando && (
            <Pressable onPress={limpiar}>
              <ThemedView style={styles.button}>
                <ThemedText type="small" themeColor="textSecondary">
                  Cancelar
                </ThemedText>
              </ThemedView>
            </Pressable>
          )}
        </ThemedView>

        <FlatList
          style={styles.list}
          data={estudiantes}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
              No hay estudiantes
            </ThemedText>
          }
          renderItem={({ item }) => (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedView type="backgroundElement" style={styles.info}>
                <ThemedText type="smallBold">{item.nombre}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.email}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.carrera}
                </ThemedText>
              </ThemedView>

              <Pressable onPress={() => editar(item)}>
                <ThemedView type="backgroundSelected" style={styles.smallButton}>
                  <ThemedText type="small">Editar</ThemedText>
                </ThemedView>
              </Pressable>

              <Pressable onPress={() => confirmarEliminar(item)}>
                <ThemedView style={[styles.smallButton, styles.deleteButton]}>
                  <ThemedText type="small" style={styles.deleteText}>
                    Eliminar
                  </ThemedText>
                </ThemedView>
              </Pressable>
            </ThemedView>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.three,
    alignItems: 'center',
  },
  form: {
    alignSelf: 'stretch',
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  input: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  button: {
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  list: {
    alignSelf: 'stretch',
  },
  empty: {
    textAlign: 'center',
    marginTop: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    marginBottom: Spacing.two,
  },
  info: {
    flex: 1,
  },
  smallButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  deleteText: {
    color: '#FFFFFF',
  },
});
