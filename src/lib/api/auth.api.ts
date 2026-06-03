import axios from "axios";
import { LoginFormData, RegisterFormData } from "../validations/auth";

export const authApi = {
    login: async (data: LoginFormData) => {
        // Not used directly here since we use NextAuth signIn('credentials')
        // but keeping it for completeness if needed elsewhere
        return { token: "mock-jwt-token", user: { id: "3", role: "user", name: data.email.split('@')[0] } };
    },

    register: async (data: RegisterFormData) => {
        const response = await axios.post('/api/auth/register', data);
        return response.data;
    }
};
