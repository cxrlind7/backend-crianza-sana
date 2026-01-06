<template>
    <div class="event-card">
        <!-- Fecha grande -->
        <div class="day-container">
            <span class="date">12</span>
        </div>

        <!-- Mes y Año -->
        <div class="date-container">
            <span class="month">DIC</span>
            <span class="year">2024</span>
        </div>

        <!-- Separador vertical -->
        <div class="separator"></div>

        <!-- Detalles del evento -->
        <div class="details-container">
            <div class="time">7:00 PM</div>
            <div class="message">sintonízanos por el 95.7 fm</div>
        </div>
    </div>
</template>

<style scoped>
/* Contenedor principal */
.event-card {
    display: grid;
    grid-template-columns: .2fr .1fr 0.1fr 1fr;
    /* Columnas: día, mes/año, separador, detalles */
    align-items: start;
    /* Alinea los elementos al inicio verticalmente */
    background-color: #3d89a9;
    /* Fondo azul */
    color: white;
    /* Texto blanco */
    border: 4px solid #f6d411;
    /* Borde amarillo */
    padding: 10px;
    /* Espaciado interno */
    border-radius: 5px;
    /* Bordes redondeados */
    max-width: 600px;
    /* Ancho máximo */
    margin: 10px;
    /* Centrado horizontal */
}

/* Contenedor de la fecha */
.day-container {
    text-align: left;
    /* Alinea el texto hacia la izquierda */
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.date {
    font-size: 3rem;
    /* Tamaño del día */
    font-weight: bold;
    line-height: 1;
}

/* Contenedor de mes y año */
.date-container {
    text-align: right;
    /* Alinea el texto hacia la izquierda */
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    justify-content: center;
}

.month {
    font-size: 1.2rem;
    /* Tamaño del mes */
    font-weight: bold;
}

.year {
    font-size: 1rem;
    /* Tamaño del año */
    font-weight: normal;
}

/* Separador vertical */
.separator {
    width: 2px;
    height: 100%;
    background-color: #f6d411;
    /* Color amarillo */
    margin: 0 auto;
    /* Centra el separador */
}

/* Contenedor de detalles */
.details-container {
    text-align: left;
    /* Alinea los detalles hacia la izquierda */
    padding-left: 10px;
    /* Espaciado con el separador */
}

.time {
    font-size: 1.2rem;
    /* Tamaño de la hora */
    font-weight: bold;
}

.message {
    font-size: 1rem;
    /* Tamaño del mensaje */
    margin-top: 5px;
}
</style>
