import { ref } from 'vue';
import { registerUser, loginUser, logoutUser } from '../composables/useFirestore';

const user = ref(null);

const register = async (email, password) => {
    try {
        const newUser = await registerUser(email, password);
        user.value = newUser;
        console.log('✅ Usuario registrado:', newUser);
    } catch (error) {
        console.error('❌ Error registrando usuario:', error.message);
    }
};

const login = async (email, password) => {
    try {
        const loggedInUser = await loginUser(email, password);
        user.value = loggedInUser;
        console.log('✅ Usuario inició sesión:', loggedInUser);
    } catch (error) {
        console.error('❌ Error iniciando sesión:', error.message);
    }
};

const logout = async () => {
    try {
        await logoutUser();
        user.value = null;
        console.log('✅ Usuario cerró sesión');
    } catch (error) {
        console.error('❌ Error cerrando sesión:', error.message);
    }
};

export { user, register, login, logout };
