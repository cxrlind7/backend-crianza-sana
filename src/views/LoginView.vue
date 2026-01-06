<template>
  <section :class="['container', { 'show-signup': isSignup }]">
    <!-- ✅ Formulario de Login -->
    <div class="form login">
      <div class="form-content">
        <header>Iniciar Sesión</header>
        <form @submit.prevent="handleLogin">
          <div class="field input-field">
            <input v-model="email" type="email" placeholder="Email" class="input" />
          </div>
          <div class="field input-field">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Contraseña"
              class="password" />
            <i :class="showPassword ? 'bx bx-show eye-icon' : 'bx bx-hide eye-icon'" @click="togglePassword"></i>
          </div>
          <!-- <div class="form-link">
                        <a href="#" class="forgot-pass">¿Olvidaste tu contraseña?</a>
                    </div> -->
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <div class="field button-field">
            <button type="submit">Entrar</button>
          </div>
        </form>
        <div class="form-link">
          <span>¿No tienes una cuenta? <a href="#" class="link signup-link" @click="toggleForm">Crear
              una Cuenta</a></span>
        </div>
      </div>
    </div>

    <!-- ✅ Formulario de Registro -->
    <div class="form signup" :class="{ 'show-signup': isSignup }">
      <div class="form-content">
        <header>Regístrate</header>
        <form @submit.prevent="handleRegister">
          <div class="field input-field">
            <input v-model="name" type="text" placeholder="Nombre" class="input" />
          </div>
          <div class="field input-field">
            <input v-model="email" type="email" placeholder="Email" class="input" />
          </div>

          <div class="field input-field">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Crear Contraseña"
              class="password" />
            <i :class="showPassword ? 'bx bx-show eye-icon' : 'bx bx-hide eye-icon'" @click="togglePassword"></i>
          </div>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <div class="field button-field">
            <button type="submit">Enviar</button>
          </div>
        </form>
        <div class="form-link">
          <span>¿Ya tienes una cuenta? <a href="#" class="link login-link" @click="toggleForm">Ingresa</a></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
import { RouterLink, useRouter } from "vue-router";

// import { registerUser, loginUser, loginWithGoogle, loginWithFacebook } from '../composables/useFirestore';
import { registerUser, loginUser } from '../composables/useFirestore';

export default {
  setup(props, { emit }) {
    const name = ref('');
    const email = ref('');
    const confirmEmail = ref('');
    const password = ref('');
    const isSignup = ref(false);
    const showPassword = ref(false);
    const errorMessage = ref('');
    const router = useRouter();

    const toggleForm = () => {
      isSignup.value = !isSignup.value;
      errorMessage.value = '';
      // emailMismatch.value = false;
    };

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleRegister = async () => {
      errorMessage.value = '';
      // emailMismatch.value = false;

      if (!name.value || !email.value || !password.value) {
        errorMessage.value = 'Por favor, completa todos los campos.';
        return;
      }


      try {
        await registerUser(email.value, password.value, name.value);
        alert('✅ Registro exitoso. Revisa tu correo para verificar tu cuenta.');
        emit('close');
      } catch (error) {
        console.error(error.message);
        if (error.code === 'auth/email-already-in-use') {
          errorMessage.value = 'Este correo ya está en uso.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage.value = 'Correo no válido.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage.value = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
        } else {
          errorMessage.value = '❌ Error registrando usuario.';
        }
      }
    };

    const handleLogin = async () => {
      errorMessage.value = '';
      if (!email.value || !password.value) {
        errorMessage.value = 'Debes ingresar tu correo y contraseña.';
        return;
      }

      try {
        await loginUser(email.value, password.value);
        alert('✅ Inicio de sesión exitoso');
        router.push('/');          // ✅ Redirige al inicio
        emit('close');
      } catch (error) {
        console.error(error.message);
        if (error.code === 'auth/user-not-found') {
          errorMessage.value = 'Usuario no encontrado.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage.value = 'Contraseña incorrecta.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage.value = 'Correo no válido.';
        } else {
          errorMessage.value = '❌ Error iniciando sesión.';
        }
      }
    };

    return {
      name,
      email,
      // confirmEmail,
      password,
      isSignup,
      showPassword,
      toggleForm,
      togglePassword,
      handleRegister,
      handleLogin,
      errorMessage,
      // emailMismatch
    };
  }
};
</script>

<style scoped>
/* Google Fonts - Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.error-message {
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
  text-align: center;
}

.container {
  width: 50vw;
  height: 60vh;
  /* padding: 20px; */
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f5f5f5;
  overflow: hidden;
  /* ✅ prevenir scroll si se desborda */
  position: relative;
  padding: 0 10px;
  /* ✅ un poco de padding lateral */
  box-sizing: border-box;
}

.form {
  position: absolute;
  max-width: 430px;
  width: 100%;
  padding: 30px;
  border-radius: 6px;
  background: #f5f5f5;
}

.form.signup {
  opacity: 0;
  pointer-events: none;
}

.show-signup .form.signup {
  opacity: 1;
  pointer-events: auto;
}

.show-signup .form.login {
  opacity: 0;
  pointer-events: none;
}

header {
  font-size: 28px;
  font-weight: 600;
  color: #232836;
  text-align: center;
}

/* form {
    margin-top: 30px;
} */

.form .field {
  position: relative;
  height: 50px;
  width: 100%;
  margin-top: 20px;
  border-radius: 6px;
}

.field input,
.field button {
  height: 100%;
  width: 100%;
  border: none;
  font-size: 16px;
  font-weight: 400;
  border-radius: 6px;
}

.field input {
  outline: none;
  padding: 0 15px;
  border: 1px solid#CACACA;
}

.field input:focus {
  border-bottom-width: 2px;
}

.eye-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 18px;
  color: #8b8b8b;
  cursor: pointer;
  padding: 5px;
}

.field button {
  color: #fff;
  background-color: #0171d3;
  transition: all 0.3s ease;
  cursor: pointer;
}

.field button:hover {
  background-color: #016dcb;
}

.form-link {
  text-align: center;
  margin-top: 10px;
}

.form-link span,
.form-link a {
  font-size: 14px;
  font-weight: 400;
  color: #232836;
}

.form a {
  color: #0171d3;
  text-decoration: none;
}

.form-content a:hover {
  text-decoration: underline;
}

.line {
  position: relative;
  height: 1px;
  width: 100%;
  margin: 36px 0;
  background-color: #d4d4d4;
}

.line::before {
  content: 'Or';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f5f5f5;
  color: #8b8b8b;
  padding: 0 15px;
}

.media-options a {
  display: flex;
  align-items: center;
  justify-content: center;
}

a.facebook {
  color: #fff;
  background-color: #4267b2;
}

a.facebook .facebook-icon {
  height: 28px;
  width: 28px;
  color: #0171d3;
  font-size: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.facebook-icon,
img.google-img {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
}

img.google-img {
  height: 20px;
  width: 20px;
  object-fit: cover;
}

a.google {
  border: 1px solid #CACACA;
}

a.google span {
  font-weight: 500;
  opacity: 0.6;
  color: #232836;
}

@media (max-width: 768px) {

  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #f5f5f5;
    /* ✅ evita desplazamiento vertical */
  }

  .container {
    height: 100vh;
    /* ✅ toda la altura visible */
    width: 100vw;
    /* ✅ toda la anchura visible */
    display: block;
    /* ✅ mantener centrado */
    flex-direction: column;
    /* ✅ apilar formularios verticalmente */
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    overflow: hidden;
    /* ✅ prevenir scroll si se desborda */
    position: relative;
    padding: 0 10px;
    /* ✅ un poco de padding lateral */
    box-sizing: border-box;
  }

  .form {
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
  }
}
</style>
