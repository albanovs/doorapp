import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const stored = localStorage.getItem("user");
            if (!stored) return [];

            const user = JSON.parse(stored);
            if (!user?.apiKey) return [];

            const res = await fetch(`/api/orders/get?apikey=${user.apiKey}`);
            if (!res.ok) throw new Error("Ошибка загрузки");

            const data = await res.json();
            return data.orders || [];
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        list: [],
        loading: false,
        loaded: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
                state.loaded = true;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default ordersSlice.reducer;
