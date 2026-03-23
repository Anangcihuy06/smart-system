import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '@/types';

interface ChatbotState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const WELCOME_MESSAGE = `Selamat datang di Smart System Kebumen! 👋

Saya adalah **Smart AI Kebumen**, asisten resmi Pemerintah Kabupaten Kebumen.

Saya bisa membantu Anda untuk:
- 📄 Pengurusan dokumen (KTP, KK, Akta, Surat Pindah)
- 📋 Informasi layanan publik
- 🔍 Status pengajuan layanan
- 📢 Prosedur pengaduan masyarakat
- 💰 Informasi anggaran dan pembangunan

Ada yang bisa saya bantu hari ini?`;

const initialState: ChatbotState = {
  messages: [
    {
      id: '1',
      text: WELCOME_MESSAGE,
      isBot: true,
      timestamp: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async (message: string, { getState }) => {
    const state = getState() as { chatbot: ChatbotState };
    const currentMessages = state.chatbot.messages;

    const apiMessages = currentMessages
      .filter((msg) => msg.id !== '1')
      .map((msg) => ({
        role: msg.isBot ? 'assistant' as const : 'user' as const,
        content: msg.text,
      }));

    apiMessages.push({ role: 'user' as const, content: message });

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: apiMessages,
        maxHistory: 20,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to get response');
    }

    const data = await response.json();
    return data.response;
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: action.payload,
        isBot: false,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(newMessage);
    },
    clearChat: (state) => {
      state.messages = [{
        id: '1',
        text: initialState.messages[0].text,
        isBot: true,
        timestamp: new Date().toISOString(),
      }];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: action.payload,
          isBot: true,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(botMessage);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { addUserMessage, clearChat } = chatbotSlice.actions;
export default chatbotSlice.reducer;
