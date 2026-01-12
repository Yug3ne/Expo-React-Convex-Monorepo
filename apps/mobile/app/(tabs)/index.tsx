import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "@monorepo/backend";

export default function TabHomeScreen() {
  const [newTask, setNewTask] = useState("");

  const tasks = useQuery(api.tasks.list);
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  const handleSubmit = async () => {
    if (!newTask.trim()) return;
    await createTask({ text: newTask.trim() });
    setNewTask("");
  };

  const remainingCount = tasks?.filter((t) => !t.isCompleted).length ?? 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Synced Tasks</Text>
          <Text style={styles.subtitle}>
            Mobile App • Real-time with Convex
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Add a new task..."
            placeholderTextColor="#8888a0"
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tasksContainer}>
          <View style={styles.tasksHeader}>
            <Text style={styles.tasksTitle}>Tasks</Text>
            <Text style={styles.taskCount}>{remainingCount} remaining</Text>
          </View>

          {tasks === undefined ? (
            <Text style={styles.emptyText}>Loading tasks...</Text>
          ) : tasks.length === 0 ? (
            <Text style={styles.emptyText}>No tasks yet. Add one above!</Text>
          ) : (
            tasks.map((task) => (
              <View
                key={task._id}
                style={[
                  styles.taskItem,
                  task.isCompleted && styles.taskCompleted,
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    task.isCompleted && styles.checkboxChecked,
                  ]}
                  onPress={() => toggleTask({ id: task._id })}
                >
                  {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.taskText,
                    task.isCompleted && styles.taskTextCompleted,
                  ]}
                >
                  {task.text}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeTask({ id: task._id })}
                >
                  <Text style={styles.deleteText}>×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Real-time Sync</Text>
          <Text style={styles.infoText}>
            Open the <Text style={styles.highlight}>web app</Text> to see tasks
            sync in real-time! Changes made here appear instantly on web, and
            vice versa.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "300",
    fontStyle: "italic",
    color: "#e4e4ed",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: "#8888a0",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: "#12121a",
    borderWidth: 1,
    borderColor: "#1e1e2e",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#e4e4ed",
  },
  addButton: {
    backgroundColor: "#ff6b35",
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#0a0a0f",
    fontSize: 16,
    fontWeight: "600",
  },
  tasksContainer: {
    backgroundColor: "#12121a",
    borderWidth: 1,
    borderColor: "#1e1e2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
    marginBottom: 12,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: "300",
    fontStyle: "italic",
    color: "#e4e4ed",
  },
  taskCount: {
    fontSize: 11,
    color: "#8888a0",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyText: {
    color: "#8888a0",
    textAlign: "center",
    paddingVertical: 24,
    fontSize: 14,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0a0f",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  taskCompleted: {
    opacity: 0.7,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: "#1e1e2e",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  checkmark: {
    color: "#0a0a0f",
    fontSize: 14,
    fontWeight: "700",
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: "#e4e4ed",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#8888a0",
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  deleteText: {
    fontSize: 24,
    color: "#8888a0",
    lineHeight: 24,
  },
  infoSection: {
    backgroundColor: "#12121a",
    borderWidth: 1,
    borderColor: "#1e1e2e",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "300",
    fontStyle: "italic",
    color: "#e4e4ed",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#8888a0",
    textAlign: "center",
    lineHeight: 22,
  },
  highlight: {
    color: "#ff6b35",
    fontWeight: "600",
  },
});
