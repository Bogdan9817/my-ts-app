import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://cave-drone-server.shtoa.xyz";

const SERVER_ERROR_ALERT =
  "Looks like we have some problem with server. Please come back later";
const CLIENT_ERROR_ALERT = "Please fullfill the form first";

export type StatusType = "scoreboard" | "lost" | "win" | "active" | "pending";
export type ServerQuery = {
  complexity: string;
  name: string;
};

type initState = {
  status: StatusType;
  userName: string | null;
  complexity: number;
  errors?: string;
  id?: string;
  load: boolean;
  token?: string;
  score?: number;
};

const initialState: initState = {
  status: "scoreboard",
  userName: null,
  complexity: 1,
  load: false,
};

export const initGame = createAsyncThunk(
  "init/game",
  async (data: ServerQuery) => {
    const response = await axios.post(`${BASE_URL}/init`, data);
    return response.data.id;
  }
);

async function getToken(num: number, id: string) {
  return axios(`${BASE_URL}/token/${num}`, { params: { id } });
}

export const fetchToken = createAsyncThunk(
  "fetch/token",
  async (data: string) => {
    const [response1, response2, response3, response4] = await Promise.all([
      getToken(1, data),
      getToken(2, data),
      getToken(3, data),
      getToken(4, data),
    ]);
    return [
      response1.data.chunk,
      response2.data.chunk,
      response3.data.chunk,
      response4.data.chunk,
    ].join("");
  }
);

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    switchStatus: (state, action) => {
      state.status = action.payload;
    },
    setupName: (state, action) => {
      state.userName = action.payload;
    },
    setupComplexity: (state, action) => {
      if (action.payload <= 10 && action.payload >= 1) {
        state.complexity = action.payload;
      }
    },
    formError: (state) => {
      state.errors = CLIENT_ERROR_ALERT;
    },
    saveScore: (state, action) => {
      state.score = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(initGame.fulfilled, (state, action) => {
      state.id = action.payload;
      state.load = false;
    });
    builder.addCase(initGame.pending, (state) => {
      state.load = true;
      state.errors = undefined;
    });
    builder.addCase(initGame.rejected, (state, action) => {
      state.load = false;
      state.errors = SERVER_ERROR_ALERT;
    });

    builder.addCase(fetchToken.fulfilled, (state, action) => {
      state.token = action.payload;
      state.status = "active";
      state.load = false;
    });

    builder.addCase(fetchToken.pending, (state) => {
      state.load = true;
      state.errors = undefined;
    });

    builder.addCase(fetchToken.rejected, (state) => {
      state.load = false;
      state.errors = SERVER_ERROR_ALERT;
    });
  },
});

export const {
  switchStatus,
  setupName,
  setupComplexity,
  formError,
  saveScore,
} = gameSlice.actions;

export default gameSlice.reducer;
