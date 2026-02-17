import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const stored = localStorage.getItem("user");
            if (!stored) return [];

            const user = JSON.parse(stored);

            if (user?.apiKey) {
                const res = await fetch(`/api/orders/get?apikey=${user.apiKey}`);
                if (!res.ok) throw new Error("Ошибка загрузки");

                const data = await res.json();
                return data.orders || [];
            } else {
                const res = await fetch(`/api/orders/get`);
                if (!res.ok) throw new Error("Ошибка загрузки");

                const data = await res.json();
                return data.orders || [];
            }

        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


export const updateOrderStatusOnServer = createAsyncThunk(
    "orders/updateOrderStatusOnServer",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await fetch("/api/orders/update-status", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, status }),
            });

            if (!res.ok) {
                throw new Error("Ошибка обновления статуса");
            }

            const data = await res.json();
            return data.order;
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
    reducers: {

        // ✅ ЛОКАЛЬНОЕ ОБНОВЛЕНИЕ (для drag & drop)
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const order = state.list.find(o => o._id === id);
            if (order) {
                order.status = status;
            }
        },

    },
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
            })

            // 🔥 Сервер подтвердил обновление
            .addCase(updateOrderStatusOnServer.fulfilled, (state) => {
                // Ничего не делаем, потому что мы уже обновили оптимистично
            })

            // ❗ Если сервер упал — можно откатить (пока просто логируем)
            .addCase(updateOrderStatusOnServer.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { updateOrderStatus } = ordersSlice.actions;

export default ordersSlice.reducer;