import { supabase } from '../lib/supabase';

export const LibraryService = {
  async getPublicInstructions() {
    try {
      const { data, error } = await supabase
        .from('public_instructions')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message, data: [] };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error loading public instructions:', error);
      return {
        success: false,
        error: 'Nie udało się pobrać biblioteki',
        data: [],
      };
    }
  },

  async getPublicInstructionWithSteps(instructionId) {
    try {
      const { data: instruction, error: instructionError } = await supabase
        .from('public_instructions')
        .select('*')
        .eq('id', instructionId)
        .single();

      if (instructionError) {
        return { success: false, error: instructionError.message };
      }

      const { data: steps, error: stepsError } = await supabase
        .from('public_instruction_steps')
        .select('*')
        .eq('instruction_id', instructionId)
        .order('step_order', { ascending: true });

      if (stepsError) {
        return { success: false, error: stepsError.message };
      }

      return {
        success: true,
        data: {
          ...instruction,
          steps: steps || [],
        },
      };
    } catch (error) {
      console.error('Error loading public instruction details:', error);
      return {
        success: false,
        error: 'Nie udało się pobrać szczegółów instrukcji',
      };
    }
  },

  async publishInstruction(user, instruction) {
    try {
      if (!user?.id) {
        return { success: false, error: 'Użytkownik nie jest zalogowany' };
      }

      if (!instruction?.title || !instruction?.category) {
        return { success: false, error: 'Instrukcja jest niepoprawna' };
      }

      const { data: insertedInstruction, error: instructionError } = await supabase
        .from('public_instructions')
        .insert([
          {
            title: instruction.title,
            category: instruction.category,
            image: instruction.image || null,
            author_user_id: user.id,
            author_name: user.fullName || 'Użytkownik',
            author_email: user.email || null,
            is_official: false,
            is_public: true,
          },
        ])
        .select()
        .single();

      if (instructionError) {
        return { success: false, error: instructionError.message };
      }

      const steps = instruction.steps || [];

      if (steps.length > 0) {
        const mappedSteps = steps.map((step, index) => ({
          instruction_id: insertedInstruction.id,
          step_order: index + 1,
          description: step.description || step.text || '',
        }));

        const { error: stepsError } = await supabase
          .from('public_instruction_steps')
          .insert(mappedSteps);

        if (stepsError) {
          return { success: false, error: stepsError.message };
        }
      }

      return { success: true, data: insertedInstruction };
    } catch (error) {
      console.error('Error publishing instruction:', error);
      return {
        success: false,
        error: 'Nie udało się opublikować instrukcji',
      };
    }
  },




  async deletePublicInstruction(instructionId) {
  try {
    const { error } = await supabase
      .from('public_instructions')
      .delete()
      .eq('id', instructionId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting public instruction:', error);
    return {
      success: false,
      error: 'Nie udało się usunąć instrukcji publicznej',
    };
  }
},



  async createOfficialInstruction(instruction, steps = []) {
    try {
      const { data: insertedInstruction, error: instructionError } = await supabase
        .from('public_instructions')
        .insert([
          {
            title: instruction.title,
            category: instruction.category,
            image: instruction.image || null,
            author_user_id: null,
            author_name: 'EasyManual',
            author_email: null,
            is_official: true,
            is_public: true,
          },
        ])
        .select()
        .single();

      if (instructionError) {
        return { success: false, error: instructionError.message };
      }

      if (steps.length > 0) {
        const mappedSteps = steps.map((step, index) => ({
          instruction_id: insertedInstruction.id,
          step_order: index + 1,
          description: step.description,
        }));

        const { error: stepsError } = await supabase
          .from('public_instruction_steps')
          .insert(mappedSteps);

        if (stepsError) {
          return { success: false, error: stepsError.message };
        }
      }

      return { success: true, data: insertedInstruction };
    } catch (error) {
      console.error('Error creating official instruction:', error);
      return {
        success: false,
        error: 'Nie udało się utworzyć oficjalnej instrukcji',
      };
    }
  },
};

export default LibraryService;