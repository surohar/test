from flask import Flask, render_template, request, redirect, flash, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import urllib.request
import os
from werkzeug.utils import secure_filename


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///arthouse_db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

UPLOAD_FOLDER = 'static/uploads/'
 
app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
 
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


#########################################
# ADMIN PANEL CLASSES####################

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(24), nullable=False)
    password = db.Column(db.String(36), nullable=False)
    name = db.Column(db.String(36), nullable=False)
    active = db.Column(db.String(10), nullable=False)

    def __repr__(self):
        return "<Users %r>" % self.id

class Promotions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(300), nullable=False)
    image_name = db.Column(db.String(200), nullable=False)
    language = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return "<Promotions %r>" % self.id


class Partners(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    image_name = db.Column(db.String(200), nullable=False)
    partner_name = db.Column(db.String(200), nullable=False)
    language = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return "<Partners %r>" % self.id


class Tests(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(300), nullable=False)
    question_number = db.Column(db.Integer, nullable=False)
    answer1 = db.Column(db.String(100), nullable=False)
    answer2 = db.Column(db.String(100), nullable=False)
    answer3 = db.Column(db.String(100), nullable=False)
    answer4 = db.Column(db.String(100), nullable=False)
    correct_answer = db.Column(db.String(100), nullable=False)
    language = db.Column(db.String(100), nullable=False)
    correct_answer_number = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return "<Tests %r>" % self.id


class Teachers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_name = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(100), nullable=False)
    website_language = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return "<Teachers %r>" % self.id


class AboutUsText(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return "<AboutUsText %r>" % self.id


class MainPageData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.Text, nullable=False)
    text = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return "<MainPageData %r>" % self.id


class Languages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    language_name = db.Column(db.String(200), nullable=False)
    main_image = db.Column(db.Text, nullable=False)
    main_text = db.Column(db.Text, nullable=False)
    image1 = db.Column(db.Text, nullable=False)
    image2 = db.Column(db.Text, nullable=False)
    image3 = db.Column(db.Text, nullable=False)
    image4 = db.Column(db.Text, nullable=False)
    image5 = db.Column(db.Text, nullable=False)
    image6 = db.Column(db.Text, nullable=False)    

    big_image = db.Column(db.Text, nullable=False)

    website_language = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return "<Languages %r>" % self.id



#########################################



def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/')
@app.route('/home')
def index():

    main_page_data = MainPageData.query.filter_by(language='armenian').first()

    return render_template('index.html', main_page_data=main_page_data)


@app.route('/english-test')
def test_page():
    return render_template('english.html')


@app.route('/home-eng')
def index_eng():

    main_page_data = MainPageData.query.filter_by(language='english').first()

    return render_template('indexeng.html', main_page_data=main_page_data)


@app.route('/about-armenian')
def about_arm():

    teachers_list = Teachers.query.filter_by(website_language='armenian').all()

    return render_template('about.html', teachers_list=teachers_list)


@app.route('/action-armenian')
def actions_arm():

    promotions = Promotions.query.filter_by(language='armenian').all()

    return render_template('action.html', promotions=promotions)



@app.route('/languages-armenian')
def languages_arm():

    language_data = Languages.query.filter_by(website_language='armenian').all()

    return render_template('languages.html', language_data=language_data)


@app.route('/languages-armenian/single/<int:id>')
def single_language_page(id):
    language_data = Languages.query.filter_by(id=id).first()

    return render_template('languages_single.html', language=language_data)


@app.route('/languages-english/single/<int:id>')
def single_language_page_eng(id):
    language_data = Languages.query.filter_by(id=id).first()

    return render_template('languages_single_eng.html', language=language_data)



@app.route('/languages-russian/single/<int:id>')
def single_language_page_rus(id):
    language_data = Languages.query.filter_by(id=id).first()

    return render_template('languages_single_rus.html', language=language_data)



@app.route('/prices-armenian')
def prices_arm():
    return render_template('prices.html')


@app.route('/admin/add_language', methods=['POST', 'GET'])
def add_language():
    if request.method == 'POST':
        main_image = request.files['main_image']
        main_text = request.form['text']
        image1 = request.files['image1']
        image2 = request.files['image2']
        image3 = request.files['image3']
        image4 = request.files['image4']
        image5 = request.files['image5']
        image6 = request.files['image6']
        language_name = request.form['language_name']

        big_image = request.files['big_image']
        website_language = request.form['website_language']

        if main_image and allowed_file(main_image.filename):
            main_image_filename = secure_filename(main_image.filename)
            main_image.save(os.path.join(app.config['UPLOAD_FOLDER'], main_image_filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)



        if image1 and allowed_file(image1.filename):
            image1_filename = secure_filename(image1.filename)
            image1.save(os.path.join(app.config['UPLOAD_FOLDER'], image1_filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)


        
        if image2 and allowed_file(image2.filename):
            image2_filename = secure_filename(image2.filename)
            image2.save(os.path.join(app.config['UPLOAD_FOLDER'], image2_filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)



        if image3 and allowed_file(image3.filename):
            image3_filename = secure_filename(image3.filename)
            image3.save(os.path.join(app.config['UPLOAD_FOLDER'], image3_filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)



        if image4 and allowed_file(image4.filename):
            image4_filename = secure_filename(image4.filename)
            image4.save(os.path.join(app.config['UPLOAD_FOLDER'], image4_filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)



        if image5 and allowed_file(image5.filename):
            image5_filename = secure_filename(image5.filename)
            image5.save(os.path.join(app.config['UPLOAD_FOLDER'], image5_filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)



        if image6 and allowed_file(image6.filename):
            image6_filename = secure_filename(image6.filename)
            image6.save(os.path.join(app.config['UPLOAD_FOLDER'], image6_filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)

        
        if big_image and allowed_file(big_image.filename):
            big_image_filename = secure_filename(big_image.filename)
            big_image.save(os.path.join(app.config['UPLOAD_FOLDER'], big_image_filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)


        language = Languages(main_image=main_image_filename, main_text=main_text, image1=image1_filename, image2=image2_filename, image3=image3_filename, image4=image4_filename, image5=image5_filename, image6=image6_filename, big_image=big_image_filename, website_language=website_language, language_name=language_name)


        try:
            db.session.add(language)
            db.session.commit()
            return redirect('/admin/languages')
        except:
            return "Error in db adding"

    else:
        return redirect('/admin/dashboard')


@app.route('/partners-armenian')
def partners_arm():

    partners = Partners.query.filter_by(language='armenian').all()

    return render_template('partners.html', partners=partners)


@app.route('/form-armenian')
def form_arm():
    return render_template('form.html')


@app.route('/test-armenian')
def test_arm():
    return render_template('test.html')


#Quiz Section
###################################################
@app.route('/quiz-page/<language>')
def quiz_arm(language):
    print(language)
    tests = Tests.query.filter_by(language=language).all()

    return render_template('single.html', tests=tests)


###################################################

#Russian URL's
#START

@app.route('/home-rus')
def index_rus():

    main_page_data = MainPageData.query.filter_by(language='russian').first()
    return render_template('indexrus.html', main_page_data=main_page_data)


@app.route('/quiz_results/calculate/<language>', methods=['POST', 'GET'])
def quiz_result_calculator(language):

    test_data = Tests.query.filter_by(language=language).all()

    if request.method == 'POST':
        answer1 = request.form['answer_1']
        answer2 = request.form['answer_2']
        answer3 = request.form['answer_3']
        answer4 = request.form['answer_4']
        answer5 = request.form['answer_5']
        answer6 = request.form['answer_6']
        answer7 = request.form['answer_7']
        answer8 = request.form['answer_8']
        answer9 = request.form['answer_9']
        answer10 = request.form['answer_10']
        answer11 = request.form['answer_11']
        answer12 = request.form['answer_11']

        test_data_1 = Tests.query.filter_by(question_number=1, language=language).first()
        test_data_2 = Tests.query.filter_by(question_number=2, language=language).first()
        test_data_3 = Tests.query.filter_by(question_number=3, language=language).first()
        test_data_4 = Tests.query.filter_by(question_number=4, language=language).first()
        test_data_5 = Tests.query.filter_by(question_number=5, language=language).first()
        test_data_6 = Tests.query.filter_by(question_number=6, language=language).first()
        test_data_7 = Tests.query.filter_by(question_number=7, language=language).first()
        test_data_8 = Tests.query.filter_by(question_number=8, language=language).first()
        test_data_9 = Tests.query.filter_by(question_number=9, language=language).first()
        test_data_10 = Tests.query.filter_by(question_number=10, language=language).first()
        test_data_11 = Tests.query.filter_by(question_number=11, language=language).first()
        test_data_12 = Tests.query.filter_by(question_number=12, language=language).first()

        correct_answer1 = test_data_1.correct_answer_number
        correct_answer2 = test_data_2.correct_answer_number
        correct_answer3 = test_data_3.correct_answer_number
        correct_answer4 = test_data_4.correct_answer_number
        correct_answer5 = test_data_5.correct_answer_number
        correct_answer6 = test_data_6.correct_answer_number
        correct_answer7 = test_data_7.correct_answer_number
        correct_answer8 = test_data_8.correct_answer_number
        correct_answer9 = test_data_9.correct_answer_number
        correct_answer10 = test_data_10.correct_answer_number
        correct_answer11 = test_data_11.correct_answer_number
        correct_answer12 = test_data_12.correct_answer_number

        correct_answers_counter = 0

        if int(answer1) == int(correct_answer1):
            correct_answers_counter += 1
        
        if int(answer2) == int(correct_answer2):
            correct_answers_counter += 1
        
        if int(answer3) == int(correct_answer3):
            correct_answers_counter += 1

        if int(answer4) == int(correct_answer4):
            correct_answers_counter += 1

        if int(answer5) == int(correct_answer5):
            correct_answers_counter += 1

        if int(answer6) == int(correct_answer6):
            correct_answers_counter += 1

        if int(answer7) == int(correct_answer7):
            correct_answers_counter += 1

        if int(answer8) == int(correct_answer8):
            correct_answers_counter += 1

        if int(answer9) == int(correct_answer9):
            correct_answers_counter += 1

        if int(answer10) == int(correct_answer10):
            correct_answers_counter += 1
        
        if int(answer11) == int(correct_answer11):
            correct_answers_counter += 1

        if int(answer12) == int(correct_answer12):
            correct_answers_counter += 1


        answer_per_precent = round((correct_answers_counter/12)*100)

        return render_template('quiz_answers.html', answer=answer_per_precent)

    else:
        return "????????????"



        #return render_template('quiz_answers.html')


@app.route('/form-russian')
def form_rus():
    return render_template('formrus.html')


@app.route('/about-russian')
def about_rus():

    teachers_list = Teachers.query.filter_by(website_language='russian').all()
    return render_template('aboutrus.html', teachers_list=teachers_list)


@app.route('/languages-russian')
def languages_rus():
    return render_template('languagesrus.html')


@app.route('/admin/remove-teacher/<int:id>')
def remove_teacher(id):
    teacher = Teachers.query.get_or_404(id)

    try:
        db.session.delete(teacher)
        db.session.commit()
        return render_template('/admin/about')
    except:
        return "DB REMOVING ERROR"


@app.route('/admin/update-teacher/<int:id>')
def update_teacher(id):
    teacher_data = Teachers.query.get_or_404(id)

    return render_template('/admin/templates/teacher_update.html', teacher_data=teacher_data)


@app.route('/admin/update_teacher/<int:id>', methods=['POST', 'GET'])
def update_teacher_function(id):
    teacher_data = Teachers.query.get_or_404(id)
    if request.method == 'POST':
        teacher_data.name = request.form['name']
        image = request.files['image']
        teacher_data.language = request.form['language']
        teacher_data.website_language = request.form['website_language']

        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #print('upload_image filename: ' + filename)
            teacher_data.image_name = filename
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)

        try:
            db.session.commit()
            return redirect('/admin/about')
        except:
            return "Data not added"

    else:
        return redirect('/admin/dashboard')




@app.route('/action-russian')
def actions_rus():

    promotions = Promotions.query.filter_by(language='russian').all()
    return render_template('actionrus.html', promotions=promotions)


@app.route('/price-russian')
def price_rus():
    return render_template('pricesrus.html')


@app.route('/partners-russian')
def partners_rus():

    partners = Partners.query.filter_by(language='russian').all()

    return render_template('partnersrus.html', partners=partners)



@app.route('/test-russian')
def test_rus():
    return render_template('testrus.html')





#END


#English URL's
#START

@app.route('/about-english')
def about_eng():

    teachers_list = Teachers.query.filter_by(website_language='english').all()

    return render_template('abouteng.html', teachers_list=teachers_list)


@app.route('/form-english')
def form_eng():
    return render_template('formeng.html')


@app.route('/languages-english')
def languages_eng():

    languages = Languages.query.filter_by(language_name='english').all()

    return render_template('languageseng.html', languages=languages)


@app.route('/action-english')
def action_eng():

    promotions = Promotions.query.filter_by(language='english').all()
    return render_template('actioneng.html', promotions=promotions)


@app.route('/prices-english')
def prices_eng():
    return render_template('priceseng.html')


@app.route('/partners-english')
def partners_eng():

    partners = Partners.query.filter_by(language='english').all()

    return render_template('partnerseng.html', partners=partners)



@app.route('/test-english')
def test_eng():
    return render_template('testeng.html')


#END


@app.route('/admin/delete-test/<int:id>')
def remove_test(id):
    test = Tests.query.get_or_404(id)

    try:
        db.session.delete(test)
        db.session.commit()
    except:
        return "Error"



@app.route('/admin/update-test/<int:id>')
def update_test(id):
    test = Tests.query.get_or_404(id)

    return render_template("admin/templates/test_update.html", test=test)

###########################################################
#ADMIN PANEL###############################################



@app.route('/admin/tests-update/<int:id>', methods=['POST', 'GET'])
def test_updating_function(id):
    select_test = Tests.query.filter_by(id=id).first()

    if request.method == 'POST':
        select_test.question = request.form['question']
        select_test.answer1 = request.form['answer1']
        select_test.answer2 = request.form['answer2']
        select_test.answer3 = request.form['answer3']
        select_test.answer4 = request.form['answer4']
        select_test.correct_answer = request.form['correct_answer']
        select_test.correct_answer_number = request.form['correct_answer_number']
        select_test.language = request.form['language']
        select_test.question_number = request.form['question_number']

        try:
            db.session.commit()
            return redirect('/admin/tests')
        except:
            return "Error in updating DB"


@app.route('/admin/tests-add', methods=['POST', 'GET'])
def add_test():
    if request.method == 'POST':
        question = request.form['question']
        answer1 = request.form['answer1']
        answer2 = request.form['answer2']
        answer3 = request.form['answer3']
        answer4 = request.form['answer4']
        correct_answer = request.form['correct_answer']
        language = request.form['language']
        question_number = request.form['question_number']

        test = Tests(question=question, answer1=answer1, answer2=answer2, answer3=answer3, answer4=answer4, correct_answer=correct_answer, language=language, question_number=question_number)

        try:
            db.session.add(test)
            db.session.commit()
            return redirect('/admin/tests')
        
        except:
            return "Base not added"


    else:
        return "Error"


@app.route('/admin/dashboard')
def admin_dashboard():
    users_list = Users.query.all()

    promotions = Promotions.query.all()
    promotion_len = len(promotions)

    partners = Partners.query.all()
    partners_len = len(partners)

    tests = Tests.query.all()
    tests_len = len(tests)

    for users_data in users_list:
        if users_data.active == 'online':
            return render_template('admin/templates/index.html', promotion_len=promotion_len, partners_len=partners_len, tests_len=tests_len)

        elif users_data.active == 'offline':
            return redirect('/admin-panel')
        else:
            return "Error with connection"




@app.route('/admin-panel', methods=['POST', 'GET'])
def admin_index():

    user_update = Users.query.filter_by(id=1).first()
    user_update.active = 'offline'
    db.session.commit()

    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        active = "online"

        users = Users.query.all()

        for user_data in users:
            if user_data.username == username and user_data.password == password:
                user_update = Users.query.filter_by(username=username).first()
                user_update.active = active
                try:
                    db.session.commit()
                    return redirect('/admin/dashboard')

                except:
                    return "ERROR 404"

                return redirect('/admin/dashboard')

            else:
                return "Error"
    else:
        return render_template('admin/templates/login.html')



@app.route('/admin/add_teacher', methods=['POST', 'GET'])
def add_teacher():
    if request.method == 'POST':
        name = request.form['name']
        image = request.files['image']
        language = request.form['language']
        website_language = request.form['website_language']

        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
            teacher = Teachers(name=name, image_name=filename, language=language, website_language=website_language)
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)

        try:
            db.session.add(teacher)
            db.session.commit()
            return redirect('/admin/about')
        except:
            return "Data not added"

    else:
        return redirect('/admin/dashboard')

################################
##ADMIN PANEL FUNCTIONS#########


@app.route('/event/<int:id>/logo')
def event_logo(id):
    event = Promotions.query.get_or_404(id)
    return app.response_class(event.image, mimetype='application/octet-stream')



@app.route('/admin/add_promotion', methods=['POST', 'GET'])
def add_promotion():
    if request.method == 'POST':
        add_promotion_description = request.form['description']
        add_promotion_language = request.form['language']
        add_promotion_image_name = request.form['image_name']
        add_promotion_file = request.files['image']

        if add_promotion_file and allowed_file(add_promotion_file.filename):
            filename = secure_filename(add_promotion_file.filename)
            add_promotion_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
            promotion = Promotions(description=add_promotion_description, image_name=add_promotion_image_name , language=add_promotion_language)
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)

        try:
            db.session.add(promotion)
            db.session.commit()
            return redirect('/admin/promotions')
        except:
            return "Data not added"

    else:
        return redirect('/admin/dashboard')


####################################
#ADMIN PANEL LINKS##################


@app.route('/admin/languages')
def languages_page():

    languages = Languages.query.all()

    return render_template('/admin/templates/languages.html', languages=languages)



@app.route('/admin/update-language/<int:id>')
def update_language(id):
    language_data = Languages.query.get_or_404(id)

    return render_template('/admin/templates/edit_language.html', language_data=language_data)



@app.route('/admin/delete-language/<int:id>')
def delete_language(id):
    language_remove = Languages.query.get_or_404(id)

    try:
        db.session.delete(language_remove)
        db.session.commit()
        return redirect('/admin/languages')

    except:
        return "Error in deleting"




@app.route('/admin/settings/main-page', methods=['POST', 'GET'])
def main_page_settings():
    if request.method == 'POST':
        text = request.form['main_page_text']
        image_file = request.files['image']
        language = request.form['language']

        main_page_data = MainPageData.query.filter_by(language=language).first()

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)

        main_page_data.text = text
        main_page_data.image = filename

        try:
            db.session.commit()
            return redirect('/admin/settings')
        except:
            return "Data not added"











@app.route('/admin/promotions')
def admin_promotions():

    users_list = Users.query.all()

    promotions = Promotions.query.all()

    for users_data in users_list:
        if users_data.active == 'online':
            return render_template('admin/templates/promotions.html', promotions=promotions)

        elif users_data.active == 'offline':
            return redirect('/admin-panel')
        else:
            return "Error with connection"




@app.route('/admin/remove-promotion/<int:id>', methods=['POST', 'GET'])
def remove_promotion(id):
    promotion = Promotions.query.get_or_404(id)

    try:
        db.session.delete(promotion)
        db.session.commit()
        return redirect('/admin/promotions')
    except:
        return "Error in deleting"



@app.route('/admin/update-promotion/<int:id>', methods=['POST', 'GET'])
def update_promotion(id):
    promotions = Promotions.query.get_or_404(id)
    return render_template('admin/templates/update_promotion.html', promotions=promotions)




@app.route('/admin/pricelist')
def admin_pricelist():
    return render_template('admin/templates/pricelist.html')


@app.route('/admin/co-workers')
def admin_co_workers():

    co_workers = Partners.query.all()

    return render_template('admin/templates/co-workers.html', co_workers=co_workers)






@app.route('/admin/co-workers/add', methods=['POST', 'GET'])
def add_partner():
    if request.method == 'POST':
        add_partners_description = request.form['description']
        add_partners_language = request.form['language']
        add_partners_image_name = request.form['image_name']
        add_partners_file = request.files['image']
        add_partners_name = request.form['partner_name']

        if add_partners_file and allowed_file(add_partners_file.filename):
            filename = secure_filename(add_partners_file.filename)
            add_partners_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #print('upload_image filename: ' + filename)
            flash('Image successfully uploaded and displayed below')
            partners = Partners(description=add_partners_description, partner_name=add_partners_name ,image_name=add_partners_image_name , language=add_partners_language)
        else:
            flash('Allowed image types are - png, jpg, jpeg, gif')
            return redirect(request.url)

        try:
            db.session.add(partners)
            db.session.commit()
            return redirect('/admin/co-workers')
        except:
            return "Data not added"

    else:
        return redirect('/admin/dashboard')


@app.route('/admin/portfolio')
def admin_portfolio():
    return render_template('admin/templates/portfolio.html')


@app.route('/admin/tests')
def admin_tests():

    tests = Tests.query.all()

    return render_template('admin/templates/tests.html', tests=tests)


@app.route('/admin/mail')
def admin_mail():
    return render_template('admin/templates/mail.html')


@app.route('/admin/users')
def admin_users():
    return render_template('admin/templates/users.html')


@app.route('/admin/settings')
def admin_settings():
    return render_template('admin/templates/settings.html')


@app.route('/admin/about')
def admin_about():

    teachers_list = Teachers.query.all()

    return render_template('admin/templates/about_us.html', teachers_list=teachers_list)

###########################################################



@app.route('/display/<filename>')
def display_image(filename):
    #print('display_image filename: ' + filename)
    return redirect(url_for('static', filename='uploads/' + filename), code=301)




if __name__ == '__main__':
    app.run(debug=True)