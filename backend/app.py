from flask import Flask,jsonify,request,make_response
from flask_restful import Resource,Api
from flask_sqlalchemy import SQLAlchemy
import jwt
from functools import wraps
from passlib.hash import sha256_crypt
import datetime
import os
import json
import time
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '../frontend/public/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg'}

app = Flask(__name__)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/gward'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "thisisgwardop"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
db = SQLAlchemy(app)


class Signup(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(50),nullable=False)
    email = db.Column(db.String(100),unique=True,nullable=False)
    password = db.Column(db.String(255),nullable=False)
    registered_at = db.Column(db.DateTime,nullable=False,default=datetime.datetime.utcnow())
    last_logged_in = db.Column(db.DateTime,nullable=True)
    profile_img = db.Column(db.String(150),nullable=True)
    points = db.Column(db.Integer,nullable=False,default=0)
    garbage_imgs = db.relationship('Garbage_details', backref='garbage_details', lazy=True)

    def __repr__(self):
        return '<User %r>' % self.id

class Garbage_details(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    Images = db.Column(db.String(150),nullable=True)
    weight = db.Column(db.Float,nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('signup.id'),nullable=False)


    def __repr__(self):
        return '<Garbage_details %r>' % self.id


# db.create_all()
# db.drop_all()

#to create token
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def token_required(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({"error":"no token"})
        try:
                jwt.decode(token,"thisisgwardop", algorithms="HS256")
        except:
            return jsonify({"error":"token invalid"})

        return f(*args,**kwargs)
    return decorated

# APi declarations

class SignupDetails(Resource):
    def post(self):
        if request.method == 'POST':
            json_data = request.get_json()
            name = json_data['name']
            email = json_data['email']
            password = json_data['password']
            check_email = Signup.query.filter_by(email=email).first()
            if not check_email:
                encrypted_pass = sha256_crypt.hash(password)
                insert_user = Signup(name=name,email=email,password=encrypted_pass)
                db.session.add(insert_user)
                db.session.commit()
                return jsonify({"success": "Signup Successful"})
            else:
                return jsonify({"error":"Email already Exists"})
        else:
            return jsonify({"error":"UnAuthorized way"})

class LoginAuthentication(Resource):
    def post(self):
        if request.method == 'POST':
            json_data = request.get_json()
            email = json_data['email']
            password = json_data['password']
            check_email = Signup.query.filter_by(email=email).first()
            if check_email:
                check_pass = sha256_crypt.verify(password,check_email.password)
                if check_pass:
                    check_email.last_logged_in = datetime.datetime.utcnow()
                    db.session.commit()
                    token = jwt.encode({"email":email,"name":check_email.name,"img":check_email.profile_img,"points":check_email.points, "exp":datetime.datetime.utcnow() + datetime.timedelta(minutes=1)},"thisisgwardop",algorithm="HS256")
                    return jsonify({"token": token})
                else:
                    return jsonify({"error":"Invalid Credentials"})
            else:
                return jsonify({"error": "Invalid Credentials"})
        else:
            return jsonify({"error": "UnAuthorized way  "})

class GoogleDat(Resource):
    def post(self):
        if request.method == 'POST':
            json_data = request.get_json()
            email = json_data['email']
            image = json_data['imageUrl']
            name = json_data['name']
            check_email = Signup.query.filter_by(email=email).first()
            if check_email:
                check_email.last_logged_in = datetime.datetime.utcnow()
                db.session.commit()
                token = jwt.encode({"email":check_email.email,"name":check_email.name,"img":check_email.profile_img,"points":check_email.points,"exp":datetime.datetime.utcnow() + datetime.timedelta(minutes=1)},"thisisgwardop",algorithm="HS256")
                return jsonify({"token": token})
            else:
                ency_email = sha256_crypt.hash(email)
                add_data = Signup(name=name,email=email,password=ency_email)
                add_data.last_logged_in = datetime.datetime.utcnow()
                db.session.add(add_data)
                db.session.commit()
                token = jwt.encode({"email": email, "name": name, "img": image,"points":0,
                                    "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=1)}, "thisisgwardop",
                                   algorithm="HS256")
                return jsonify({"token":token})
        else:
            return jsonify({"error":"UnAuthorised method"})

class ImageUpdate(Resource):
    @token_required
    def post(self):
        if request.method == 'POST':
            # check if the post request has the file part
            if 'image' not in request.files:
                return jsonify({"error":"No file"})
            file = request.files['image']

            if file.filename == '':
                return jsonify({"error":"No selected file"})
            if file and allowed_file(file.filename):
                names = str(time.time_ns())+".jpg"
                filename = secure_filename(names)
                email = request.form['email']

                add_image = Signup.query.filter_by(email=email).first()
                add_image.profile_img = names
                db.session.commit()
                file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename ))
                return jsonify({"success":"Upload success"})
            else:
                return jsonify({"error":"File Format not supported"})

class ProfileUpdate(Resource):
    @token_required
    def put(self):
        if request.method == 'PUT':
            get_data = request.get_json()

            name = get_data['name']
            email = get_data['email']
            if name and email:
                update_user = Signup.query.filter_by(email=email).first()
                if update_user:
                    update_user.name  = name
                    db.session.commit()
                    return jsonify({"success":"Updated"})
                else:
                    return jsonify({"error":"Some error"})
            else:
                return jsonify({"error":"Name cannot be empty"})
        else:
            return jsonify({"error":"Unauthorised method"})

class changePassword(Resource):
    @token_required
    def put(self):
        if request.method == "PUT":
            json_data = request.get_json()
            email = json_data['email']
            oldpass = json_data['oldpassword']
            newpass = json_data['newpassword']
            renewpass = json_data['reEnterpassword']
            if newpass == renewpass:
                check_email = Signup.query.filter_by(email=email).first()
                if check_email:
                    check_pass = sha256_crypt.verify(oldpass,check_email.password)
                    if check_pass:
                        check_email.password = sha256_crypt.hash(newpass)
                        db.session.commit()
                        return jsonify({"success":"Password change Successful"})
                    else:
                        return jsonify({"error":"Incorrect Password"})
                else:
                    return jsonify({"error":"Incorrect email"})
            else:
                return jsonify({"error": "Password mismatch"})
        else:
            return jsonify({"error": "unAuthorised method"})

class Garbage(Resource):
    def post(self):
        if request.method == 'POST':
            point = 0
            if 'image' not in request.files :
                return jsonify({"error": "No file"})
            if 'weight' not in request.form:
                return jsonify({"error": "Weight cannot be empty"})
            file = request.files['image']

            if file.filename == '':
                return jsonify({"error": "No selected file"})
            if file and allowed_file(file.filename):
                names = str(time.time_ns()) + ".jpg"
                filename = secure_filename(names)
                weight = int(request.form['weight'])
                print(weight)
                email = request.form['email']
                add_image = Signup.query.filter_by(email=email).first()
                if add_image:
                    if weight <= 10:
                        point = 1
                    elif  10 < weight <= 50:
                        point = 2

                    elif 50 < weight <= 100:
                        point = 3
                    elif 100 < weight <= 200:
                        point = 4
                    elif 200 < weight <= 500:
                        point = 5
                    elif 500 < weight <= 1000:
                        point = 6
                    elif 1000 < weight <= 5000:
                        point = 10
                    elif 5000 < weight <= 10000:
                        point = 15
                    elif 10000 < weight <= 20000:
                        point = 20
                    else:
                        point = 30

                    add_image.points = add_image.points + point
                    file.save(os.path.join('../frontend/public/uploads_garbage', filename))
                    add_garbage_img = Garbage_details(Images=names,weight=weight,user_id=add_image.id)
                    db.session.add(add_garbage_img)
                    db.session.commit()
                else:
                    return jsonify({"error":"Some error occured"})
                return jsonify({"success": "Upload success"})
            else:
                return jsonify({"error": "File Format not supported"})


class GetHistory(Resource):
    def get(self):
        if request.method == 'GET':
            data = []
            email = request.args.get("email")
            getData = Signup.query.filter_by(email=email).first()
            if getData.garbage_imgs:
                for i in getData.garbage_imgs:
                    data.append({"images":i.Images,"weight":i.weight})

                return make_response(jsonify({"data":data}),200)
            else:
                return make_response(jsonify({"error":"No History"}),200)
        else:
            return make_response(jsonify({"error":"UnAuthorised Method"}),401)



api.add_resource(SignupDetails,'/login_data')
api.add_resource(LoginAuthentication,'/signin_data')
api.add_resource(ImageUpdate,"/image_update")
api.add_resource(ProfileUpdate,"/profile_update")
api.add_resource(changePassword,"/changepassword")
api.add_resource(GoogleDat,"/GoogleData")
api.add_resource(Garbage,"/garbage_img")
api.add_resource(GetHistory,"/History")


if __name__ == "__main__":
    app.run(debug=True)