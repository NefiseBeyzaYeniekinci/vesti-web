import axios from "axios";
import { LoginFormData, RegisterFormData } from "../validations/auth";

// API Gateway config
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/auth";

export const authApi = {
    login: async (data: LoginFormData) => {
        // Mikroservis mimarisinde doğrudan auth-service'e giden API gateway ucu
        // const response = await axios.post(`${API_URL}/login`, data);
        // return response.data;

        // Geçici Mock: (Kendi endpoint'imiz üzerinden de test edebiliriz)
        if (data.email === "admin@vesti.com" && data.password === "password") {
            return { token: "mock-jwt-token-admin", user: { id: "1", role: "admin", name: "Admin" } };
        }
        if (data.email === "user@vesti.com" && data.password === "password") {
            return { token: "mock-jwt-token-user", user: { id: "2", role: "user", name: "User" } };
        }

        // Demo ortamında başarılı dönmesi için herhangi bir kullanıcıyı kabul edelim:
        return { token: "mock-jwt-token", user: { id: "3", role: "user", name: data.email.split('@')[0] } };
    },

    register: async (data: RegisterFormData) => {
        // const response = await axios.post(`${API_URL}/register`, data);
        // return response.data;

        // Geçici Mock
        return { success: true, message: "Kayıt başarılı", user: { name: data.name, email: data.email } };
    }
};
