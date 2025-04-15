from flask import Blueprint, request, jsonify
from models import Users, Key, KeyHistory
from flask_cors import cross_origin

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/')
def index():
    return 'привет'

@api_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_input = data.get('user')
    password_input = data.get('password')

    user_record = Users.query.filter_by(number=user_input).first()
    if user_record and user_record.password == password_input:
        return jsonify({
            "status": "success",
            "message": "Добро пожаловать!",
            "code": 200,
            "admin": user_record.admin
        })
    else:
        return jsonify({"status": "error", "message": "Неверный логин или пароль"}), 401


@api_blueprint.route('/key-stats', methods=['GET'])
@cross_origin()
def key_stats():
    try:
        total_keys = Key.query.count()
        available_keys = Key.query.filter_by(status=True).count()       
        issued_keys = Key.query.filter_by(status=False).count()
        
        return jsonify({
            "status": "success",
            "total": total_keys,
            "available": available_keys,
            "issued": issued_keys
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Эндпоинт для получения списка всех ключей с их статусом
@api_blueprint.route('/keys', methods=['GET'])
@cross_origin()
def all_keys():
    try:
        keys = Key.query.all()
        keys_list = []
        
        for key in keys:
            # Для каждого ключа находим последнюю запись в истории
            last_history = KeyHistory.query.filter_by(key_id=key.id).order_by(KeyHistory.timestamp.desc()).first()
            
            user_name = None
            if last_history and last_history.user:
                user_name = last_history.user.fio
                
            keys_list.append({
                "id": key.id,
                "cab": key.cab,
                "corpus": key.corpus,
                "status": key.status,
                "available": key.status,  # True = доступен, False = выдан
                "last_user": user_name,
                "key_name": f"{key.corpus}.{key.cab}"  # Форматированное имя ключа
            })
            
        return jsonify({
            "status": "success",
            "keys": keys_list
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Новый эндпоинт для получения истории ключей
@api_blueprint.route('/key-history', methods=['GET'])
@cross_origin()
def get_key_history():
    try:
        # Получаем историю ключей
        history_records = KeyHistory.query.order_by(KeyHistory.timestamp.desc()).all()
        
        history_list = []
        
        for record in history_records:
            # Получаем объект ключа и пользователя отдельно
            key = Key.query.filter_by(id=record.key_id).first()
            user = Users.query.filter_by(id=record.user_id).first()
            
            if key and user:
                history_list.append({
                    "id": record.id,
                    "key_name": f"{key.corpus}.{key.cab}",
                    "user_name": user.fio if user else "Неизвестно",
                    "action": record.action,
                    "timestamp": record.timestamp.strftime("%d.%m.%Y %H:%M")  # Исправлена русская буква М на английскую M
                })
            
        return jsonify({
            "status": "success",
            "history": history_list
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
