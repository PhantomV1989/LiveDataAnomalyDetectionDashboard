from flask import Flask, jsonify, request  # simple server

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def my_response():
    post_fields = {}
    try:
        resp = ''
        with open('SensorAnomalyDetectionDashboard.html', 'rb') as f:
            resp = f.read()
        return resp
    except:
        post_fields['status'] = 'failure'
        return jsonify(post_fields)


if __name__ == "__main__":
    app.run(host=app.config.get("HOST", "localhost"), port=app.config.get("PORT", 8000))
