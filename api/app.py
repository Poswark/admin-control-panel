from flask import Flask, render_template, jsonify, send_file
import json
import os
from datetime import datetime
import csv, io
import oneagent
import oneagent.sdk as onesdk  # import correcto del SDK Dynatrace
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

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