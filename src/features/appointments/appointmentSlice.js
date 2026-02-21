import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import appointmentService from "./appointmentService";

const initialState = {
  appointments: [],
  doctors: [],
  loading: false,
  error: null,
};

// ================= GET APPOINTMENTS =================
export const getAppointments = createAsyncThunk(
  "appointments/getAll",
  async (_, thunkAPI) => {
    try {
      return await appointmentService.getAppointments();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ================= FETCH DOCTORS =================
export const fetchDoctors = createAsyncThunk(
  "appointments/getDoctors",
  async (_, thunkAPI) => {
    try {
      return await appointmentService.getDoctors();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ================= BOOK =================
export const bookAppointment = createAsyncThunk(
  "appointments/book",
  async (appointmentData, thunkAPI) => {
    try {
      return await appointmentService.bookAppointment(appointmentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ================= UPDATE =================
export const updateStatus = createAsyncThunk(
  "appointments/updateStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      return await appointmentService.updateStatus({ id, status });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ================= DELETE =================
export const deleteAppointment = createAsyncThunk(
  "appointments/delete",
  async (id, thunkAPI) => {
    try {
      return await appointmentService.deleteAppointment(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET APPOINTMENTS
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET DOCTORS
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // BOOK
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.appointments.push(action.payload);
      })

      // UPDATE
      .addCase(updateStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (appt) => appt._id === action.payload._id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(
          (appt) => appt._id !== action.payload._id
        );
      });
  },
});

export default appointmentSlice.reducer;
