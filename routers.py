from flask import Blueprint, request, jsonify
from models import Users, Key, KeyHistory
from flask_cors import cross_origin
from app import db
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
            "admin": user_record.admin,
            "user_id": user_record.id  #обязательно!

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


   #список ключей конкретного пользователя
@api_blueprint.route('/my-keys', methods=['GET'])
@cross_origin()
def my_keys():
    try:
        user_id_str = request.args.get('user_id')
        if not user_id_str:
            return jsonify({"status": "error", "message": "user_id is required"}), 400
       
        user_id = int(user_id_str)
        issued_keys = Key.query.filter_by(status=False).all()
        keys_list = []

        for key_obj in issued_keys:
            last_history = KeyHistory.query \
                .filter_by(key_id=key_obj.id) \
                .order_by(KeyHistory.timestamp.desc()) \
                .first()

            if last_history and last_history.user_id == user_id:
                # Значит этот ключ сейчас у данного пользователя
                user_name = last_history.user.fio if last_history.user else None
                
                keys_list.append({
                    "id": key_obj.id,
                    "cab": key_obj.cab,
                    "corpus": key_obj.corpus,
                    "status": key_obj.status,      # False = выдан
                    "available": key_obj.status,   
                    "last_user": user_name,
                    "key_name": f"{key_obj.corpus}.{key_obj.cab}"
                })

        return jsonify({
            "status": "success",
            "keys": keys_list
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@api_blueprint.route('/request-key', methods=['POST'])
@cross_origin()
def request_key():

    data = request.get_json()
    user_id = data.get("user_id")
    key_id = data.get("key_id")

    user = Users.query.get(user_id)
    key_obj = Key.query.get(key_id)
    if not user or not key_obj:
        return jsonify({"status": "error", "message": "Invalid user_id or key_id"}), 400

    if key_obj.status == False:
        return jsonify({"status":"error","message":"Ключ уже выдан"}), 400

    new_hist = KeyHistory(
        user_id=user_id,
        key_id=key_id,
        action="request"
    )
    db.session.add(new_hist)
    db.session.commit()

    return jsonify({"status":"success","message":"Запрос на получение ключа отправлен"}),200


@api_blueprint.route('/pending-requests', methods=['GET'])
@cross_origin()
def pending_requests():

    try:
        records = KeyHistory.query.filter_by(action="request").order_by(KeyHistory.timestamp.desc()).all()
        result = []
        for r in records:
            user_name = r.user.fio if r.user else "??"
            key_name = f"{r.used_key.corpus}.{r.used_key.cab}" if r.used_key else "??"
            result.append({
                "history_id": r.id,
                "user_id": r.user_id,
                "user_name": user_name,
                "key_id": r.key_id,
                "key_name": key_name,
                "timestamp": r.timestamp.strftime("%d.%m.%Y %H:%M")
            })
        return jsonify({"status":"success","requests":result}),200
    except Exception as e:
        return jsonify({"status":"error","message":str(e)}),500


@api_blueprint.route('/approve-request', methods=['POST'])
@cross_origin()
def approve_request():

    data = request.get_json()
    hist_id = data.get("history_id")

    record = KeyHistory.query.get(hist_id)
    if not record:
        return jsonify({"status":"error","message":"No such request"}),404

    if record.action != "request":
        return jsonify({"status":"error","message":"This history is not 'request'"}),400

    # Выдаём ключ
    record.action = "issue"
    if record.used_key:
        record.used_key.status = False  # ключ выдан
    db.session.commit()

    return jsonify({"status":"success","message":"Ключ выдан"}),200


@api_blueprint.route('/deny-request', methods=['POST'])
@cross_origin()
def deny_request():
    data = request.get_json()
    hist_id = data.get("history_id")

    record = KeyHistory.query.get(hist_id)
    if not record:
        return jsonify({"status":"error","message":"No such request"}),404

    if record.action != "request":
        return jsonify({"status":"error","message":"This history is not 'request'"}),400

    record.action = "denied"
    db.session.commit()

    return jsonify({"status":"success","message":"Запрос отклонён"}),200


@api_blueprint.route('/return-key', methods=['POST'])
@cross_origin()
def return_key():
    """
    Пользователь сдает ключ (action='return'), меняем key.status=True
    {
      "user_id":7,
      "key_id":15
    }
    """
    data = request.get_json()
    user_id = data.get("user_id")
    key_id = data.get("key_id")

    # Найдём последнюю запись, удостоверимся, что ключ действительно у user_id
    from sqlalchemy import desc
    last_record = KeyHistory.query \
        .filter_by(key_id=key_id) \
        .order_by(KeyHistory.timestamp.desc()) \
        .first()

    if not last_record or last_record.user_id != user_id or last_record.action != "issue":
        return jsonify({"status":"error","message":"Этот ключ сейчас не у вас"}),400

    new_hist = KeyHistory(
        user_id=user_id,
        key_id=key_id,
        action="return"
    )
    db.session.add(new_hist)
    key_obj = last_record.used_key
    if key_obj:
        key_obj.status = True

    db.session.commit()
    return jsonify({"status":"success","message":"Ключ сдан"}),200


@api_blueprint.route('/transfer-key', methods=['POST'])
@cross_origin()
def transfer_key():

    data = request.get_json()
    from_user_id = data.get("from_user_id")
    to_user_id = data.get("to_user_id")
    key_id = data.get("key_id")

    last_record = KeyHistory.query \
        .filter_by(key_id=key_id) \
        .order_by(KeyHistory.timestamp.desc()) \
        .first()

    if not last_record or last_record.user_id != from_user_id or last_record.action != "issue":
        return jsonify({"status":"error","message":"Ключ не у этого пользователя"}),400

    new_hist = KeyHistory(
        user_id=to_user_id,
        key_id=key_id,
        action="transfer"
    )
    db.session.add(new_hist)
    db.session.commit()

    return jsonify({"status":"success","message":"Ключ передан другому пользователю"}),200


