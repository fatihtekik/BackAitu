from flask import Flask
from services import db
from routers import api_blueprint
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Aidana2007@localhost:5432/Ключи'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
app.register_blueprint(api_blueprint)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
