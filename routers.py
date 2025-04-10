from flask import Blueprint, request, jsonify

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/')
def index():
    return 'привет'

@api_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = data.get('user')
    password = data.get('password')

    if user == "admin" and password == "123":
        return jsonify({"status": "success", "message": "Добро пожаловать!","code":200})
    else:
        return jsonify({"status": "error", "message": "Неверный логин или пароль"}), 401
@api_blueprint.route('/key' , methods=['GET'])
def keys():
    return '4242WSW'
