import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = 'instructions_user_';

const getUserStorageKey = (userId) => `${STORAGE_KEY_PREFIX}${userId}`;

export const getAllInstructions = async (userId) => {
  try {
    if (!userId) return [];
    const key = getUserStorageKey(userId);
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading instructions:', error);
    return [];
  }
};

export const getInstructionById = async (userId, id) => {
  const instructions = await getAllInstructions(userId);
  return instructions.find((instruction) => instruction.id === id) || null;
};

export const addInstruction = async (userId, instruction) => {
  try {
    if (!userId) return null;

    const key = getUserStorageKey(userId);
    const instructions = await getAllInstructions(userId);

    const newInstruction = {
      id: Date.now().toString(),
      ...instruction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
    };

    instructions.push(newInstruction);
    await AsyncStorage.setItem(key, JSON.stringify(instructions));
    return newInstruction;
  } catch (error) {
    console.error('Error adding instruction:', error);
    return null;
  }
};

export const updateInstruction = async (userId, id, updates) => {
  try {
    if (!userId) return null;

    const key = getUserStorageKey(userId);
    const instructions = await getAllInstructions(userId);
    const index = instructions.findIndex((instruction) => instruction.id === id);

    if (index === -1) return null;

    instructions[index] = {
      ...instructions[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(key, JSON.stringify(instructions));
    return instructions[index];
  } catch (error) {
    console.error('Error updating instruction:', error);
    return null;
  }
};

export const deleteInstruction = async (userId, id) => {
  try {
    if (!userId) return false;

    const key = getUserStorageKey(userId);
    const instructions = await getAllInstructions(userId);
    const filtered = instructions.filter((instruction) => instruction.id !== id);

    await AsyncStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting instruction:', error);
    return false;
  }
};

export const addStepToInstruction = async (userId, instructionId, step) => {
  try {
    if (!userId) return null;

    const key = getUserStorageKey(userId);
    const instructions = await getAllInstructions(userId);
    const instruction = instructions.find((i) => i.id === instructionId);

    if (!instruction) return null;

    if (!instruction.steps) {
      instruction.steps = [];
    }

    const newStep = {
      id: Date.now().toString(),
      ...step,
      order: instruction.steps.length + 1,
    };

    instruction.steps.push(newStep);
    instruction.updatedAt = new Date().toISOString();

    await AsyncStorage.setItem(key, JSON.stringify(instructions));
    return newStep;
  } catch (error) {
    console.error('Error adding step:', error);
    return null;
  }
};

export const deleteStepFromInstruction = async (userId, instructionId, stepId) => {
  try {
    if (!userId) return false;

    const key = getUserStorageKey(userId);
    const instructions = await getAllInstructions(userId);
    const instruction = instructions.find((i) => i.id === instructionId);

    if (!instruction || !instruction.steps) return false;

    instruction.steps = instruction.steps.filter((step) => step.id !== stepId);
    instruction.steps.forEach((step, index) => {
      step.order = index + 1;
    });
    instruction.updatedAt = new Date().toISOString();

    await AsyncStorage.setItem(key, JSON.stringify(instructions));
    return true;
  } catch (error) {
    console.error('Error deleting step:', error);
    return false;
  }
};

export const updateStepInInstruction = async (
  userId,
  instructionId,
  stepId,
  updates
) => {
  try {
    if (!userId) return null;

    const key = getUserStorageKey(userId);
    const instructions = await getAllInstructions(userId);
    const instruction = instructions.find((i) => i.id === instructionId);

    if (!instruction || !instruction.steps) return null;

    const step = instruction.steps.find((s) => s.id === stepId);
    if (!step) return null;

    Object.assign(step, updates);
    instruction.updatedAt = new Date().toISOString();

    await AsyncStorage.setItem(key, JSON.stringify(instructions));
    return step;
  } catch (error) {
    console.error('Error updating step:', error);
    return null;
  }
};

export const exportData = async (userId) => {
  return await getAllInstructions(userId);
};

export const importData = async (userId, data) => {
  try {
    if (!userId || !Array.isArray(data)) return false;

    const key = getUserStorageKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};