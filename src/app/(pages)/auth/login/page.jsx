"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const validate = () => {
        if (!form.email.trim()) return "Введите email";
        if (!form.password.trim()) return "Введите пароль";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Ошибка авторизации");
                return;
            }

            localStorage.setItem("apiKey", JSON.stringify(data.user));
            router.push("/");

        } catch {
            setError("Ошибка соединения с сервером");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div
                className="hidden lg:block bg-cover bg-center"
                style={{ backgroundImage: "url('/bg.png')" }}
            />

            <div className="flex flex-col items-center justify-center px-6 sm:px-10 lg:px-20 relative">

                <Link
                    href="/auth/register"
                    className="absolute top-6 right-6 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-50 transition"
                >
                    Регистрация
                </Link>

                <h1 className="font-montserrat text-2xl text-center sm:text-3xl font-extrabold text-gray-700 mb-10 leading-snug">
                    Добро пожаловать в службу <br />
                    <span className="text-red-600">
                        сервиса PRO Монтаж
                    </span>
                </h1>

                <div className="max-w-sm w-full">
                    <h2 className="font-lato text-lg text-center font-semibold text-gray-800 mb-6">
                        Авторизация
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="bg-[#F5F5FA66] p-3 rounded-[12px]">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full bg-transparent border-0 border-b border-b-[#56657740] px-0 py-3 text-sm focus:outline-none focus:border-b-red-500 transition"
                            />
                        </div>

                        <div className="bg-[#F5F5FA66] p-3 rounded-[12px]">
                            <input
                                name="password"
                                type="password"
                                placeholder="Пароль"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full bg-transparent border-0 border-b border-b-[#56657740] px-0 py-3 text-sm focus:outline-none focus:border-b-red-500 transition"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-[163px] h-[46px] bg-[#C30000] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-[#A80000] hover:shadow-md active:scale-[0.97] disabled:opacity-60"
                            >
                                {loading ? "Вход..." : "Войти"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
