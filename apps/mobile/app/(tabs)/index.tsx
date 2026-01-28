import { useState } from "react";
import {
  View,
  Text,
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
      className="flex-1 bg-dark-bg"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center py-6 border-b border-dark-border mb-6">
          <Text className="text-3xl font-light italic text-primary mb-2">Synced Tasks</Text>
          <Text className="text-[11px] text-muted uppercase tracking-widest">
            Mobile App • Real-time with Convex
          </Text>
        </View>

        <View className="flex-row gap-3 mb-6">
          <TextInput
            className="flex-1 bg-dark-card border border-dark-border rounded-[10px] px-4 py-3.5 text-base text-primary"
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Add a new task..."
            placeholderTextColor="#8888a0"
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          <TouchableOpacity className="bg-accent rounded-[10px] px-5 justify-center" onPress={handleSubmit}>
            <Text className="text-dark-bg text-base font-semibold">Add</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6">
          <View className="flex-row justify-between items-center pb-3 border-b border-dark-border mb-3">
            <Text className="text-lg font-light italic text-primary">Tasks</Text>
            <Text className="text-[11px] text-muted uppercase tracking-wide">{remainingCount} remaining</Text>
          </View>

          {tasks === undefined ? (
            <Text className="text-muted text-center py-6 text-sm">Loading tasks...</Text>
          ) : tasks.length === 0 ? (
            <Text className="text-muted text-center py-6 text-sm">No tasks yet. Add one above!</Text>
          ) : (
            tasks.map((task) => (
              <View
                key={task._id}
                className={`flex-row items-center bg-dark-bg rounded-[10px] p-3 mb-2 gap-3 ${task.isCompleted ? "opacity-70" : ""}`}
              >
                <TouchableOpacity
                  className={`w-[26px] h-[26px] border-2 rounded-[7px] items-center justify-center ${task.isCompleted ? "bg-success border-success" : "border-dark-border"}`}
                  onPress={() => toggleTask({ id: task._id })}
                >
                  {task.isCompleted && <Text className="text-dark-bg text-sm font-bold">✓</Text>}
                </TouchableOpacity>
                <Text
                  className={`flex-1 text-[15px] ${task.isCompleted ? "line-through text-muted" : "text-primary"}`}
                >
                  {task.text}
                </Text>
                <TouchableOpacity
                  className="w-8 h-8 items-center justify-center rounded-lg"
                  onPress={() => removeTask({ id: task._id })}
                >
                  <Text className="text-2xl text-muted leading-6">×</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View className="bg-dark-card border border-dark-border rounded-xl p-5 items-center">
          <Text className="text-lg font-light italic text-primary mb-2">Real-time Sync</Text>
          <Text className="text-sm text-muted text-center leading-[22px]">
            Open the <Text className="text-accent font-semibold">web app</Text> to see tasks
            sync in real-time! Changes made here appear instantly on web, and
            vice versa.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
