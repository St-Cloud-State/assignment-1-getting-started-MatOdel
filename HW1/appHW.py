from flask import Flask, jsonify, render_template, request
import uuid

app = Flask(__name__)

applications = {}

@app.route('/api/add_app', methods=['POST'])
def add_application():
    data = request.get_json()  # Get JSON data from request body
    if 'name' not in data or 'zipcode' not in data:
        return jsonify({"error": "Missing name or zipcode"}), 400  # Return an error if missing fields
    
    app_id = str(uuid.uuid4())[:4]  # Generate a short unique ID
    applications[app_id] = {
        "name": data['name'],
        "zipcode": data['zipcode'],
        "status": "received"
    }
    
    return jsonify({"app_id": app_id}) 

@app.route('/api/update_status', methods=['POST'])
def update_status():
    data = request.get_json()
    app_id = data.get("app_id")
    new_status = data.get("new_status")

    if app_id not in applications:
        return jsonify({"error": "Application ID not found"}), 404

    applications[app_id]["status"] = new_status
    return jsonify({"message": f"Status updated to {new_status}!"})

@app.route('/api/check_status', methods=['GET'])
def check_status():
    app_id = request.args.get("app_id")  # Get application ID from query parameters

    if app_id not in applications:
        return jsonify({"error": "Application ID not found"}), 404

    return jsonify({"status": applications[app_id]["status"]})


 
# Route to render the index.html page
@app.route('/')
def index():
    return render_template('indexHW.html')
    
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
