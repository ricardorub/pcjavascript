from flask import Flask, jsonify, request
from datetime import date, timedelta
import pandas as pd
import numpy as np
import mysql.connector
from sklearn.ensemble import RandomForestRegressor
import os
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

DB_CONFIG = {
    'host': 'localhost', # O la IP/nombre de host de tu servidor MySQL
    'user': 'tu_usuario_mysql', # ¡CAMBIA ESTO!
    'password': 'tu_password_mysql', # ¡CAMBIA ESTO!
    'database': 'fastfood_db' # Nombre de la base de datos que creaste
}


PERU_HOLIDAYS = [
    date(2023, 1, 1),   # Año Nuevo
    date(2023, 4, 6),   # Jueves Santo
    date(2023, 4, 7),   # Viernes Santo
    date(2023, 5, 1),   # Día del Trabajo
    date(2023, 6, 24),  # Día del Campesino
    date(2023, 6, 29),  # San Pedro y San Pablo
    date(2023, 7, 28),  # Fiestas Patrias
    date(2023, 7, 29),  # Fiestas Patrias
    date(2023, 8, 30),  # Santa Rosa de Lima
    date(2023, 10, 8),  # Combate de Angamos
    date(2023, 11, 1),  # Día de Todos los Santos
    date(2023, 12, 8),  # Inmaculada Concepción
    date(2023, 12, 9),  # Batalla de Ayacucho
    date(2023, 12, 25), # Navidad

    date(2024, 1, 1),   # Año Nuevo
    date(2024, 3, 28),  # Jueves Santo
    date(2024, 3, 29),  # Viernes Santo
    date(2024, 5, 1),   # Día del Trabajo
    date(2024, 6, 24),  # Día del Campesino
    date(2024, 6, 29),  # San Pedro y San Pablo
    date(2024, 7, 28),  # Fiestas Patrias
    date(2024, 7, 29),  # Fiestas Patrias
    date(2024, 8, 30),  # Santa Rosa de Lima
    date(2024, 10, 8),  # Combate de Angamos
    date(2024, 11, 1),  # Día de Todos los Santos
    date(2024, 12, 8),  # Inmaculada Concepción
    date(2024, 12, 9),  # Batalla de Ayacucho
    date(2024, 12, 25), # Navidad

    date(2025, 1, 1),   # Año Nuevo
    date(2025, 4, 17),  # Jueves Santo
    date(2025, 4, 18),  # Viernes Santo
    date(2025, 5, 1),   # Día del Trabajo
    date(2025, 6, 24),  # Día del Campesino
    date(2025, 6, 29),  # San Pedro y San Pablo
    date(2025, 7, 28),  # Fiestas Patrias
    date(2025, 7, 29),  # Fiestas Patrias
    date(2025, 8, 30),  # Santa Rosa de Lima
    date(2025, 10, 8),  # Combate de Angamos
    date(2025, 11, 1),  # Día de Todos los Santos
    date(2025, 12, 8),  # Inmaculada Concepción
    date(2025, 12, 9),  # Batalla de Ayacucho
    date(2025, 12, 25), # Navidad
]


# --- Función para obtener datos de MySQL ---
def get_data_from_db():
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True) # Para obtener resultados como diccionarios
        cursor.execute("SELECT fecha, temperatura, es_feriado, lluvia, dia_semana, ventas FROM ventas ORDER BY fecha ASC")
        data = cursor.fetchall()
        df = pd.DataFrame(data)

        if not df.empty:
            df['fecha'] = pd.to_datetime(df['fecha'])
            df['mes'] = df['fecha'].dt.month
            df['dia_del_mes'] = df['fecha'].dt.day
            # Asegurar que dia_semana sea 0-6 (Lunes a Domingo) si no se guarda así
            df['dia_semana'] = df['fecha'].dt.weekday
        return df
    except mysql.connector.Error as err:
        print(f"Error al conectar o consultar MySQL: {err}")
        return None
    finally:
        if conn and conn.is_connected():
            conn.close()

# --- Función para entrenar y predecir el modelo ---
model = None # Declarar model globalmente
last_trained_timestamp = None # Para llevar un registro de cuándo se entrenó por última vez

def train_and_predict_model(dias_a_predecir=7):
    global model, last_trained_timestamp

    # Este chequeo es principalmente para evitar reentrenamientos excesivos si la app se reinicia.
    # El cron job debería ser el controlador principal del reentrenamiento programado.
    current_date = date.today()
    if last_trained_timestamp and last_trained_timestamp.date() == current_date:
        print("Modelo ya entrenado hoy, saltando reentrenamiento a menos que no exista.")
        if model is not None:
             return generate_future_predictions(model, dias_a_predecir)

    df_historico = get_data_from_db()
    if df_historico is None or df_historico.empty:
        print("No hay datos históricos para entrenar el modelo.")
        return None, "No hay datos históricos para entrenar."

    df_historico = df_historico.sort_values(by='fecha').reset_index(drop=True)

    features = ["temperatura", "es_feriado", "lluvia", "dia_semana", "mes", "dia_del_mes"]
    X = df_historico[features]
    y = df_historico["ventas"]

    try:
        model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
        model.fit(X, y)
        last_trained_timestamp = pd.Timestamp.now()
        print(f"Modelo reentrenado con {len(df_historico)} registros el {last_trained_timestamp}.")
    except Exception as e:
        print(f"Error al entrenar el modelo: {e}")
        return None, "Error al entrenar el modelo."

    return generate_future_predictions(model, dias_a_predecir, df_historico["fecha"].max())

def generate_future_predictions(trained_model, dias_a_predecir, last_historical_date=None):
    if last_historical_date is None:
        last_historical_date = pd.Timestamp.now() - timedelta(days=1)

    fechas_futuras = [last_historical_date + timedelta(days=i) for i in range(1, dias_a_predecir + 1)]

    datos_futuros = []
    for fecha_futura in fechas_futuras:
        is_holiday = 1 if fecha_futura.date() in PERU_HOLIDAYS else 0
        dia_semana_futuro = fecha_futura.weekday()

        # Simulación de datos futuros de temperatura y lluvia (¡REEMPLAZAR CON API DE CLIMA REAL!)
        temp_futura = np.random.randint(20, 30)
        lluvia_futura = np.random.choice([0, 1], p=[0.8, 0.2])

        datos_futuros.append({
            "fecha": fecha_futura.strftime("%Y-%m-%d"),
            "temperatura": temp_futura,
            "es_feriado": is_holiday,
            "lluvia": lluvia_futura,
            "dia_semana": dia_semana_futuro,
            "mes": fecha_futura.month,
            "dia_del_mes": fecha_futura.day
        })

    df_futuro = pd.DataFrame(datos_futuros)
    features = ["temperatura", "es_feriado", "lluvia", "dia_semana", "mes", "dia_del_mes"]
    X_futuro = df_futuro[features]

    try:
        predicciones_futuras = trained_model.predict(X_futuro)
        df_futuro["ventas_estimadas"] = predicciones_futuras.astype(int)
        print(f"Predicciones generadas para los próximos {dias_a_predecir} días.")
        return df_futuro[["fecha", "ventas_estimadas"]], None
    except Exception as e:
        print(f"Error al realizar predicciones: {e}")
        return None, "Error al realizar predicciones."


# --- API Endpoints ---

# Endpoint para que el personal ingrese datos de ventas diarios
@app.route('/api/add_sale', methods=['POST'])
def add_sale():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se recibieron datos JSON."}), 400

    # Validaciones básicas
    required_fields = ['fecha', 'temperatura', 'es_feriado', 'lluvia', 'dia_semana', 'ventas']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos."}), 400

    try:
        sale_date = pd.to_datetime(data['fecha']).date()
        temperature = float(data['temperatura'])
        is_holiday = bool(data['es_feriado'])
        rain = bool(data['lluvia'])
        day_of_week = int(data['dia_semana'])
        sales = int(data['ventas'])

        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Insertar. Considera añadir lógica para evitar duplicados si es necesario
        insert_query = """
            INSERT INTO ventas (fecha, temperatura, es_feriado, lluvia, dia_semana, ventas)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (sale_date, temperature, is_holiday, rain, day_of_week, sales))
        conn.commit()
        return jsonify({"message": "Venta registrada exitosamente."}), 201
    except ValueError as ve:
        return jsonify({"error": f"Error en el formato de los datos: {ve}"}), 400
    except mysql.connector.Error as err:
        print(f"Error al insertar en MySQL: {err}")
        return jsonify({"error": f"Error en la base de datos: {err}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {e}"}), 500
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()


@app.route('/api/predicciones_semanales', methods=['GET'])
def get_weekly_predictions():
    df_predicciones, error = train_and_predict_model(dias_a_predecir=7)
    if error:
        return jsonify({"error": error}), 500
    return jsonify(df_predicciones.to_dict(orient="records"))

@app.route('/api/historial_demanda', methods=['GET'])
def get_demand_history():
    df_historico = get_data_from_db()
    if df_historico is None or df_historico.empty:
        return jsonify({"error": "No se encontraron datos históricos."}), 500

    df_historico_reciente = df_historico.tail(30).copy() # Últimos 30 días
    df_historico_reciente['fecha'] = df_historico_reciente['fecha'].dt.strftime("%Y-%m-%d")

    return jsonify(df_historico_reciente[["fecha", "ventas"]].to_dict(orient="records"))

@app.route('/api/patron_demanda_horaria', methods=['GET'])
def get_hourly_demand_pattern():
    # Este endpoint sigue devolviendo datos ficticios ya que la base de datos 'ventas'
    # no tiene una columna para la hora del día. Si tuvieras una, deberías
    # obtener y procesar esos datos desde MySQL.
    data = [
        {"hora": "08:00", "demanda_esperada": 15, "demanda_real": 12},
        {"hora": "09:00", "demanda_esperada": 25, "demanda_real": 22},
        {"hora": "10:00", "demanda_esperada": 45, "demanda_real": 42},
        {"hora": "11:00", "demanda_esperada": 35, "demanda_real": 32},
        {"hora": "12:00", "demanda_esperada": 25, "demanda_real": 22},
        {"hora": "13:00", "demanda_esperada": 40, "demanda_real": 38},
        {"hora": "14:00", "demanda_esperada": 30, "demanda_real": 28},
        {"hora": "15:00", "demanda_esperada": 15, "demanda_real": 12}
    ]
    return jsonify(data)

# Ruta para forzar el reentrenamiento (para el cron job/Programador de Tareas)
@app.route('/api/reentrenar_modelo', methods=['POST'])
def force_retrain_model():
    print("Solicitud de reentrenamiento recibida.")
    df_predicciones, error = train_and_predict_model(dias_a_predecir=7)
    if error:
        return jsonify({"status": "error", "message": error}), 500
    return jsonify({"status": "success", "message": "Modelo reentrenado y predicciones actualizadas."})

if __name__ == '__main__':
    # Entrenar el modelo al iniciar la aplicación por primera vez
    # Esto asegura que haya un modelo disponible incluso antes del primer cron job.
    print("Iniciando aplicación Flask. Realizando entrenamiento inicial del modelo...")
    train_and_predict_model(dias_a_predecir=7)
    app.run(debug=True, host='0.0.0.0', port=5000)