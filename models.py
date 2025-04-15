from services import db

class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50), nullable=False)

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    fio = db.Column(db.Text, nullable=False)
    number = db.Column(db.String(20), nullable=False)
    password = db.Column(db.Text, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    admin = db.Column(db.Boolean, default=False)
    role = db.relationship('Role', backref='users')

class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    category = db.Column(db.String(100), nullable=False)
    user = db.relationship('Users', backref='categories')

class Key(db.Model):
    __tablename__ = 'key'
    id = db.Column(db.Integer, primary_key=True)
    cab = db.Column(db.Integer, nullable=False)
    corpus = db.Column(db.String(20), nullable=False)
    status = db.Column(db.Boolean, default=True)

class KeyHistory(db.Model):
    __tablename__ = 'key_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    key_id = db.Column(db.Integer, db.ForeignKey('key.id'))
    action = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=db.func.now())
    user = db.relationship('Users', backref='key_history')
    used_key = db.relationship('Key', backref='history')