import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { supabase } from '@/database/supabase';
import { useTheme } from '@/hooks/use-theme';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tarea = {
  id: number;
  nombre: string;
  Fecha: string;
  Responsable: string;
};

export default function PersoScreen() {
  const theme = useTheme();

  const [tarea, setTarea] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario que aparece en el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaEdit, setTareaEdit] = useState<Tarea | null>(null);
  const [nombre, setNombre] = useState('');
  const [Fecha, setFecha] = useState('');
  const [Responsable, setRes] = useState('');
  const [guardando, setGuardando] = useState(false);

  const cargarTareas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('Persona').select('*').order('id');

      if (error) {
        Alert.alert('Ha ocurrido un error', error.message);
        return;
      }

      // Supabase devuelve las filas sin tipos, así que las casteamos.
      setTarea((data ?? []) as Tarea[]);
    } catch (err) {
      Alert.alert('Ha ocurrido un error', err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  const abrirNuevo = () => {
    setTareaEdit(null);
    setNombre('');
    setFecha('');
    setRes('');
    setModalVisible(true);
  };

  const abrirEdicion = (producto: Tarea) => {
    setTareaEdit(producto);
    setNombre(producto.nombre);
    setFecha(producto.Fecha);
    setRes(String(producto.Responsable));
    setModalVisible(true);
  };

  const guardarTarea = async () => {
    if (!nombre.trim() || !Fecha.trim()|| !Responsable.trim()) {
      Alert.alert('Datos incompletos');
      return;
    }
    setGuardando(true);
    try {
      const datos = {
        nombre: nombre.trim(),
        Fecha: Fecha.trim(),
        Responsable: Responsable.trim(),
      };

      // Si hay un producto en edición hacemos UPDATE, si no, INSERT.
      const resultado = tareaEdit
        ? await supabase.from('Persona').update(datos).eq('id', tareaEdit.id)
        : await supabase.from('Persona').insert(datos);

      if (resultado.error) {
        Alert.alert('Ha ocurrido un error', resultado.error.message);
        return;
      }

      setModalVisible(false);
      cargarTareas();
    } catch (err) {
      Alert.alert('Ha ocurrido un error', err instanceof Error ? err.message : String(err));
    } finally {
      setGuardando(false);
    }
  };

  const eliminarTarea = async (producto: Tarea) => {
    try {
      const { error } = await supabase.from('Persona').delete().eq('id', producto.id);

      if (error) {
        Alert.alert('Ha ocurrido un error', error.message);
        return;
      }

      setTarea((prev) => prev.filter((item) => item.id !== producto.id));
    } catch (err) {
      Alert.alert('Ha ocurrido un error', err instanceof Error ? err.message : String(err));
    }
  };

  const confirmarEliminacion = (persona: Tarea) => {
    // En web, Alert.alert no muestra diálogos; usamos el confirm del navegador.
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm(`¿Deseas eliminar "${persona.nombre}"?`)) {
        eliminarTarea(persona);
      }
      return;
    }

    Alert.alert('Eliminar tarea', `¿Deseas eliminar la tarea: "${persona.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => eliminarTarea(persona) },
    ]);
  };

  const renderItem = ({ item }: { item: Tarea }) => (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView type="backgroundElement" style={styles.cardInfo}>
        <ThemedText type="smallBold">{item.nombre}</ThemedText>
        <ThemedText type="smallBold">{item.Responsable}</ThemedText>
        <ThemedText type="smallBold">{item.Fecha}</ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.cardActions}>
        <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={() => abrirEdicion(item)}>
          <ThemedView type="backgroundSelected" style={styles.editButton}>
            <ThemedText type="small" style={styles.editButtonText}>
              Editar
            </ThemedText>
          </ThemedView>
        </Pressable>

        <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={() => confirmarEliminacion(item)}>
          <ThemedView style={styles.deleteButton}>
            <ThemedText type="small" style={styles.deleteButtonText}>
              Eliminar
            </ThemedText>
          </ThemedView>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Tareas</ThemedText>
          <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={abrirNuevo}>
            <ThemedView type="backgroundSelected" style={styles.newProductButton}>
              <ThemedText type="small" style={styles.editButtonText}>
                + Nuevo producto
              </ThemedText>
            </ThemedView>
          </Pressable>
        </ThemedView>

        {loading ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
            Cargando tareas…
          </ThemedText>
        ) : tarea.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
            No hay tareas registrados.
          </ThemedText>
        ) : (
          <FlatList
            data={tarea}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </SafeAreaView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView type="backgroundElement" style={styles.modalCard}>
            <ThemedText type="subtitle">
              {tareaEdit ? 'Editar producto' : 'Nuevo producto'}
            </ThemedText>

            <ThemedView type="backgroundElement" style={styles.field}>
              <ThemedText type="smallBold">Nombre</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej. Tarea programacion"
                placeholderTextColor={theme.textSecondary}
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.field}>
              <ThemedText type="smallBold">Fecha</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                value={Fecha}
                onChangeText={setFecha}
                placeholder="Ej. 27/05/2007"
                placeholderTextColor={theme.textSecondary}
              />
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.field}>
              <ThemedText type="smallBold">Responsable</ThemedText>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                value={Responsable}
                onChangeText={setRes}
                placeholder="Ej. Daniel Sandoval"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </ThemedView>

            <Pressable disabled={guardando} style={({ pressed }) => pressed && styles.pressed} onPress={guardarTarea}>
              <ThemedView type="backgroundSelected" style={styles.saveButton}>
                <ThemedText type="small" style={styles.saveButtonText}>
                  {guardando ? 'Guardando…' : 'Guardar producto'}
                </ThemedText>
              </ThemedView>
            </Pressable>

            <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={() => setModalVisible(false)}>
              <ThemedView style={styles.cancelButton}>
                <ThemedText type="small" themeColor="textSecondary">
                  Cancelar
                </ThemedText>
              </ThemedView>
            </Pressable>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
    alignSelf: 'stretch',
  },
  newProductButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.five,
  },
  listContent: {
    alignSelf: 'stretch',
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  cardInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  editButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  editButtonText: {
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    alignSelf: 'stretch',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  field: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
  saveButtonText: {
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
  },
});
