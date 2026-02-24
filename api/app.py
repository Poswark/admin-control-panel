from flask import Flask, render_template, jsonify, send_file
import json
import os
from datetime import datetime
import csv, io
import oneagent
import oneagent.sdk as onesdk  # import correcto del SDK Dynatrace
import logging

import requests
import re
from flask_cors import CORS

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)  # Habilitar CORS para que el frontend pueda llamar a la API si es necesario



# --- Inicializar Dynatrace SDK ---
try:
    sdk = oneagent.initialize()
    print("✅ Dynatrace SDK inicializado correctamente.")
except Exception as e:
    print(f"⚠️ No se pudo inicializar Dynatrace SDK: {e}")
    sdk = None  # Evita errores si no hay OneAgent

@app.route("/")
@app.route("/inventario")
def index():
    return render_template('inventario.html')

@app.route("/api/inventario")
def api_inventario():
    ruta_json = "archivo.json"
    if not os.path.exists(ruta_json):
        return jsonify({"error": f"No se encontró el archivo {ruta_json}"}), 404

    try:
        with open(ruta_json, "r", encoding="utf-8") as f:
            data = json.load(f)

        # --- Traza personalizada Dynatrace ---
        if sdk:
            tracer = sdk.trace_custom_service('api_inventario', 'FlaskService')
            tracer.add_custom_attribute("endpoint", "/api/inventario")
            tracer.add_custom_attribute("method", "GET")
            tracer.add_custom_attribute("status_code", 200)
            with tracer:
                print("📡 [Dynatrace] Llamada a /api/inventario trazada")

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

## update json file
@app.route("/api/update", methods=["POST"])
def upload():
    return jsonify({"message": "Funcionalidad de actualización no implementada aún."}), 501

@app.route("/api/descargar/csv")
def descargar_csv():
    ruta_json = "archivo.json"
    if not os.path.exists(ruta_json):
        return jsonify({"error": f"No se encontró el archivo {ruta_json}"}), 404

    try:
        with open(ruta_json, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        output = io.StringIO()
        if data:
            fieldnames = ['nombre', 'artefacto', 'repositorio', 'technology', 'TIPO', 
                         'server_host', 'server_port', 'server_protocol', 'dueño', 'comentario']
            
            writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
            writer.writeheader()
            
            for item in data:
                row = item.copy()
                if 'server' in row and row['server']:
                    row['server_host'] = row['server'].get('host', '')
                    row['server_port'] = row['server'].get('port', '')
                    row['server_protocol'] = row['server'].get('protocol', '')
                else:
                    row['server_host'] = ''
                    row['server_port'] = ''
                    row['server_protocol'] = ''
                
                if 'server' in row:
                    del row['server']
                
                writer.writerow(row)
        
        output.seek(0)

        # --- Traza personalizada Dynatrace ---
        if sdk:
            tracer = sdk.trace_custom_service('descargar_csv', 'FlaskService')
            with tracer:
                print("📡 [Dynatrace] Llamada a /api/descargar/csv trazada")

        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'inventario_{timestamp}.csv'
        )
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# --- Configuración Uptime Kuma ---
UPTIME_KUMA_URL = os.getenv("UPTIME_KUMA_URL")
UPTIME_KUMA_KEY = os.getenv("UPTIME_KUMA_KEY")

@app.route("/healthcheck")
def api_healthcheck():
    logging.info("=== /healthcheck called ===")
    logging.info(f"UPTIME_KUMA_URL: {UPTIME_KUMA_URL}")
    logging.info(f"UPTIME_KUMA_KEY presente: {bool(UPTIME_KUMA_KEY)}")
    logging.info(f"UPTIME_KUMA_KEY valor: [{UPTIME_KUMA_KEY}]")  # corchetes para ver espacios/chars raros

    if not UPTIME_KUMA_KEY:
        return jsonify({"error": "No se encontró el API key de Uptime Kuma (variable 'control')"}), 500

    try:
        logging.info(f"Haciendo request a: {UPTIME_KUMA_URL}")
        logging.info(f"Auth: user='' password=[{UPTIME_KUMA_KEY}]")
        
        response = requests.get(UPTIME_KUMA_URL, auth=('', UPTIME_KUMA_KEY), timeout=5)
        
        logging.info(f"Status code: {response.status_code}")
        logging.info(f"Response headers: {dict(response.headers)}")
        logging.info(f"Response body (primeros 500 chars): {response.text[:500]}")
        
        response.raise_for_status()
        
        metrics = response.text
        pattern = r'monitor_status\{[^}]*monitor_name="([^"]+)"[^}]*monitor_url="([^"]+)"[^}]*\}\s+(\d+\.?\d*)'
        matches = re.findall(pattern, metrics)
        
        logging.info(f"Matches encontrados: {len(matches)}")
        logging.info(f"Matches: {matches}")
        
        healthchecks = []
        for name, url, status_val in matches[:5]:
            status = 'ok'
            if status_val == '0':
                status = 'error'
            elif status_val in ['2', '3']:
                status = 'warning'
                
            healthchecks.append({
                "name": name,
                "url": url,
                "status": status
            })
        
        logging.info(f"Healthchecks resultado: {healthchecks}")
        return jsonify(healthchecks)

    except requests.exceptions.ConnectionError as e:
        logging.error(f"Error de conexión (no se pudo conectar a {UPTIME_KUMA_URL}): {e}")
        return jsonify({"error": f"ConnectionError: {str(e)}"}), 500
    
    except requests.exceptions.Timeout as e:
        logging.error(f"Timeout conectando a {UPTIME_KUMA_URL}: {e}")
        return jsonify({"error": f"Timeout: {str(e)}"}), 500
    
    except requests.exceptions.HTTPError as e:
        logging.error(f"HTTP Error {response.status_code}: {e}")
        logging.error(f"Response body: {response.text}")
        return jsonify({"error": f"HTTPError {response.status_code}: {str(e)}", "body": response.text}), 500

    except Exception as e:
        logging.error(f"Error inesperado: {type(e).__name__}: {e}")
        return jsonify({"error": f"{type(e).__name__}: {str(e)}"}), 500
    
    
    """
import requests
import re
import os

UPTIME_KUMA_URL = os.getenv("UPTIME_KUMA_URL", "http://192.168.1.2:3001/metrics")
UPTIME_KUMA_KEY = os.getenv("UPTIME_KUMA_KEY", "-si_ax8o")

print("=== DEBUG UPTIME KUMA ===")
print(f"URL: {UPTIME_KUMA_URL}")
print(f"KEY: [{UPTIME_KUMA_KEY}]")
print()

try:
    print(f"Haciendo request...")
    response = requests.get(UPTIME_KUMA_URL, auth=('', UPTIME_KUMA_KEY), timeout=5)
    
    print(f"Status code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Body (primeros 500 chars):\n{response.text[:500]}")
    print()

    response.raise_for_status()

    metrics = response.text
    pattern = r'monitor_status\{[^}]*monitor_name="([^"]+)"[^}]*monitor_url="([^"]+)"[^}]*\}\s+(\d+\.?\d*)'
    matches = re.findall(pattern, metrics)

    print(f"Matches encontrados: {len(matches)}")
    for name, url, status_val in matches:
        status = 'ok'
        if status_val == '0':
            status = 'error'
        elif status_val in ['2', '3']:
            status = 'warning'
        print(f"  - {name} | {url} | {status}")

except requests.exceptions.ConnectionError as e:
    print(f"ERROR de conexión: {e}")
except requests.exceptions.Timeout:
    print(f"ERROR: Timeout conectando a {UPTIME_KUMA_URL}")
except requests.exceptions.HTTPError as e:
    print(f"ERROR HTTP {response.status_code}: {e}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"ERROR inesperado {type(e).__name__}: {e}")
    """

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 Sistema de Inventario iniciado")
    print("="*50)
    print(f"📊 Servidor: http://localhost:5050")
    print(f"📁 Interfaz: http://localhost:5050/inventario")
    print(f"🔌 API: http://localhost:5050/api/inventario")
    print(f"📊 Descargar CSV: http://localhost:5050/api/descargar/csv")
    print("="*50 + "\n")
    
    app.run(host="0.0.0.0", port=5050, debug=True)