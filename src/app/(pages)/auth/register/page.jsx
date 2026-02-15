"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [form, setForm] = useState({
        shopName: "",
        managerName: "",
        phone: "",
        email: "",
        password: "",
        admin: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const validate = () => {
        if (!form.shopName.trim()) return "Введите название магазина";
        if (!form.managerName.trim()) return "Введите ФИО менеджера";
        if (!form.phone.trim()) return "Введите номер телефона";
        if (!form.email.includes("@")) return "Некорректный email";
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password))
            return "Пароль должен быть минимум 8 символов, содержать латинские буквы и цифры";
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
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Ошибка регистрации");
                return;
            }

            localStorage.setItem("apiKey", data.apiKey);
            router.push("/auth/login");
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
                    href="/auth/login"
                    className="absolute top-6 right-6 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm hover:bg-red-50 transition"
                >
                    Авторизация
                </Link>

                <h1 className="font-montserrat text-2xl text-center sm:text-3xl font-extrabold text-gray-700 mb-10 leading-snug">
                    Добро пожаловать в службу<br />
                    <span className="text-red-600">сервиса PRO Монтаж</span>
                </h1>

                <div className="max-w-sm w-full">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { name: "shopName", placeholder: "Название магазина" },
                            { name: "managerName", placeholder: "ФИО менеджера" },
                            { name: "phone", placeholder: "Контактный телефон", type: "tel" },
                            { name: "email", placeholder: "Email", type: "email" },
                        ].map((field) => (
                            <div key={field.name} className="bg-[#F5F5FA66] p-3 rounded-[12px]">
                                <input
                                    name={field.name}
                                    type={field.type || "text"}
                                    placeholder={field.placeholder}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-0 border-b border-b-[#56657740] px-0 py-3 text-sm focus:outline-none focus:border-b-red-500 transition"
                                />
                            </div>
                        ))}

                        <div className="relative bg-[#F5F5FA66] p-3 rounded-[12px]">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Пароль"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full bg-transparent border-0 border-b border-b-[#56657740] px-0 py-3 text-sm focus:outline-none focus:border-b-red-500 transition pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-10-8-10-8s1.61-3.52 6-6M1 1l22 22" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {error && <div className="text-sm text-red-600 text-center">{error}</div>}
                        {success && <div className="text-sm text-green-600 text-center">{success}</div>}

                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-[163px] h-[46px] bg-[#C30000] text-white text-sm font-medium rounded-lg transition-all duration-200 hover:bg-[#A80000] hover:shadow-md active:scale-[0.97] disabled:opacity-60"
                            >
                                {loading ? "Отправка..." : "Зарегистрироваться"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
