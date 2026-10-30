from flask import Flask ,render_template ,request ,jsonify 
import json 
import os 
from datetime import datetime ,date ,timedelta 
from chat_engine import get_spiritual_response 

app =Flask (__name__ )
app .secret_key ="adhyatma_manthan_student_secret_key"

DATA_DIR ="data"
CHECKINS_FILE =os .path .join (DATA_DIR ,"user_checkins.json")
GROWTH_FILE =os .path .join (DATA_DIR ,"user_growth.json")
CHALLENGE_REFL_FILE =os .path .join (DATA_DIR ,"user_reflections.json")
CHAT_HIST_FILE =os .path .join (DATA_DIR ,"user_chat_history.json")
CONTACT_MSGS_FILE =os .path .join (DATA_DIR ,"user_contact_messages.json")

def read_json (filepath ,default_value =None ):
    """Read data from a JSON file. If file does not exist, return default value."""
    if default_value is None :
        default_value =[]
    if not os .path .exists (filepath ):
        return default_value 
    try :
        with open (filepath ,"r",encoding ="utf-8")as f :
            return json .load (f )
    except Exception :
        return default_value 

def write_json (filepath ,data ):
    """Write data to a JSON file with neat indentation."""
    os .makedirs (os .path .dirname (filepath ),exist_ok =True )
    with open (filepath ,"w",encoding ="utf-8")as f :
        json .dump (data ,f ,ensure_ascii =False ,indent =2 )

def load_static_data (filename ):
    """Load reference data (shlokas, deities, scriptures, etc.) from data folder."""
    filepath =os .path .join (DATA_DIR ,filename )
    return read_json (filepath ,default_value =[])


def get_daily_shloka ():
    shlokas =load_static_data ("shlokas.json")
    if not shlokas :
        return {}
    day_of_year =datetime .now ().timetuple ().tm_yday 
    return shlokas [day_of_year %len (shlokas )]

def get_daily_challenge ():
    challenges =load_static_data ("challenges.json")
    if not challenges :
        return {}
    day_of_year =datetime .now ().timetuple ().tm_yday 
    return challenges [day_of_year %len (challenges )]

def calculate_streak ():
    """Calculate streak from user_growth.json file."""
    growth_records =read_json (GROWTH_FILE ,default_value ={})
    if not growth_records :
        return 0 

    streak =0 
    today =date .today ()
    for i in range (365 ):
        day_str =(today -timedelta (days =i )).isoformat ()
        if day_str in growth_records :
            day_acts =growth_records [day_str ]
            if any (day_acts .values ()):
                streak +=1 
            else :
                break 
        else :
            break 
    return streak 


@app .route ("/")
def home ():
    shloka =get_daily_shloka ()
    challenge =get_daily_challenge ()
    return render_template ("index.html",shloka =shloka ,challenge =challenge )

@app .route ("/chat")
def chat ():
    return render_template ("chat.html")

@app .route ("/api/chat",methods =["POST"])
def api_chat ():
    data =request .get_json ()or {}
    user_msg =data .get ("message","").strip ()
    if not user_msg :
        return jsonify ({"error":"Message cannot be empty"}),400 

    bot_reply =get_spiritual_response (user_msg )

    history =read_json (CHAT_HIST_FILE ,default_value =[])
    history .append ({
    "timestamp":datetime .now ().strftime ("%Y-%m-%d %H:%M:%S"),
    "user_message":user_msg ,
    "bot_response":bot_reply 
    })
    write_json (CHAT_HIST_FILE ,history )

    return jsonify ({"response":bot_reply })

@app .route ("/daily-shloka")
def daily_shloka_page ():
    shloka =get_daily_shloka ()
    return render_template ("daily_shloka.html",shloka =shloka )

@app .route ("/library")
def library ():
    shlokas =load_static_data ("shlokas.json")
    return render_template ("library.html",shlokas =shlokas )

@app .route ("/api/shlokas")
def api_shlokas ():
    category =request .args .get ("category","all")
    shlokas =load_static_data ("shlokas.json")
    if category !="all":
        filtered =[s for s in shlokas if s .get ("category")==category ]
        return jsonify (filtered )
    return jsonify (shlokas )

@app .route ("/dashboard")
def dashboard ():
    today =date .today ().isoformat ()
    challenge =get_daily_challenge ()
    shloka =get_daily_shloka ()

    checkins =read_json (CHECKINS_FILE ,default_value =[])
    todays_checkin =next ((c for c in reversed (checkins )if c .get ("date")==today ),None )
    todays_morning_checkin =next ((c for c in reversed (checkins )if c .get ("date")==today and c .get ("time_of_day")=="morning"),None )
    todays_evening_checkin =next ((c for c in reversed (checkins )if c .get ("date")==today and c .get ("time_of_day")=="evening"),None )

    growth_dict =read_json (GROWTH_FILE ,default_value ={})
    growth_data =[]
    for d ,acts in sorted (growth_dict .items (),reverse =True )[:7 ]:
        growth_data .append ([
        0 ,
        d ,
        acts .get ("meditation",0 ),
        acts .get ("shloka_read",0 ),
        acts .get ("dharma_challenge",0 ),
        acts .get ("journal",0 )
        ])

    todays_acts =growth_dict .get (today ,{})
    completed_today_count =sum (1 for v in [
    todays_acts .get ("meditation"),
    todays_acts .get ("shloka_read"),
    todays_acts .get ("dharma_challenge"),
    todays_acts .get ("journal")
    ]if v )

    total_active_days =len (growth_dict )

    reflections_list =read_json (CHALLENGE_REFL_FILE ,default_value =[])
    total_challenges_done =len (reflections_list )
    today_challenge_reflection =next ((r for r in reversed (reflections_list )if r .get ("date")==today ),None )

    reflections =[
    [0 ,r .get ("date",""),r .get ("challenge_id",0 ),r .get ("title",""),r .get ("reflection","")]
    for r in reversed (reflections_list )
    ][:5 ]

    streak =calculate_streak ()

    return render_template (
    "dashboard.html",
    today =today ,
    todays_checkin =todays_checkin ,
    todays_morning_checkin =todays_morning_checkin ,
    todays_evening_checkin =todays_evening_checkin ,
    todays_acts =todays_acts ,
    completed_today_count =completed_today_count ,
    total_challenges_done =total_challenges_done ,
    total_active_days =total_active_days ,
    today_challenge_reflection =today_challenge_reflection ,
    growth_data =growth_data ,
    reflections =reflections ,
    checkins_history =list (reversed (checkins )),
    challenge =challenge ,
    shloka =shloka ,
    streak =streak 
    )

@app .route ("/api/checkin",methods =["POST"])
def api_checkin ():
    data =request .get_json ()or {}
    today =date .today ().isoformat ()

    time_of_day =data .get ("time_of_day","morning")
    feeling =data .get ("feeling","")
    goal =data .get ("goal","")
    challenge_faced =data .get ("challenge","")
    helped =data .get ("helped_someone","")
    grateful =data .get ("grateful","")
    became_angry =data .get ("became_angry","")
    learned =data .get ("learned","")

    recommendation ="Practice mindfulness and steady effort in your Swadharma today."
    if became_angry and "yes"in became_angry .lower ():
        recommendation ="You experienced anger today. Spend 5 minutes reciting the Shanti Mantra and practicing deep breathing."
    elif feeling and any (w in feeling .lower ()for w in ["anxious","stressed","fear"]):
        recommendation ="Remember Gita 2.47: Focus purely on duty without attachment to the outcome. You are protected."
    elif grateful :
        recommendation ="Your gratitude brings positive karma and inner peace. Continue your joyful path."

    checkins =read_json (CHECKINS_FILE ,default_value =[])
    checkins .append ({
    "date":today ,
    "time_of_day":time_of_day ,
    "feeling":feeling ,
    "goal":goal ,
    "challenge":challenge_faced ,
    "helped_someone":helped ,
    "grateful":grateful ,
    "became_angry":became_angry ,
    "learned":learned ,
    "ai_recommendation":recommendation ,
    "created_at":datetime .now ().strftime ("%Y-%m-%d %H:%M:%S")
    })
    write_json (CHECKINS_FILE ,checkins )

    growth =read_json (GROWTH_FILE ,default_value ={})
    if today not in growth :
        growth [today ]={"meditation":0 ,"shloka_read":0 ,"dharma_challenge":0 ,"journal":0 }
    growth [today ]["journal"]=1 
    write_json (GROWTH_FILE ,growth )

    return jsonify ({"success":True ,"recommendation":recommendation })

@app .route ("/api/activity",methods =["POST"])
def api_activity ():
    data =request .get_json ()or {}
    today =date .today ().isoformat ()
    activity =data .get ("activity","")

    valid_activities =["meditation","shloka_read","dharma_challenge","journal"]
    if activity not in valid_activities :
        return jsonify ({"error":"Invalid activity name"}),400 

    growth =read_json (GROWTH_FILE ,default_value ={})
    if today not in growth :
        growth [today ]={"meditation":0 ,"shloka_read":0 ,"dharma_challenge":0 ,"journal":0 }
    growth [today ][activity ]=1 
    write_json (GROWTH_FILE ,growth )

    return jsonify ({"success":True })

@app .route ("/api/challenge_reflection",methods =["POST"])
def api_challenge_reflection ():
    data =request .get_json ()or {}
    today =date .today ().isoformat ()
    c_id =data .get ("challenge_id",0 )
    title =data .get ("title","")
    reflection =data .get ("reflection","").strip ()

    if not reflection :
        return jsonify ({"error":"Reflection cannot be empty"}),400 

    reflections =read_json (CHALLENGE_REFL_FILE ,default_value =[])
    reflections .append ({
    "date":today ,
    "challenge_id":c_id ,
    "title":title ,
    "reflection":reflection ,
    "created_at":datetime .now ().strftime ("%Y-%m-%d %H:%M:%S")
    })
    write_json (CHALLENGE_REFL_FILE ,reflections )

    growth =read_json (GROWTH_FILE ,default_value ={})
    if today not in growth :
        growth [today ]={"meditation":0 ,"shloka_read":0 ,"dharma_challenge":0 ,"journal":0 }
    growth [today ]["dharma_challenge"]=1 
    write_json (GROWTH_FILE ,growth )

    return jsonify ({"success":True })

@app .route ("/deities")
def deities ():
    deities_list =load_static_data ("deities.json")
    return render_template ("deities.html",deities =deities_list )

@app .route ("/scriptures")
def scriptures ():
    scripture_data =load_static_data ("scriptures.json")
    return render_template ("scriptures.html",data =scripture_data )

@app .route ("/youth")
def youth ():
    qa_list =load_static_data ("youth.json")
    return render_template ("youth.html",qa_list =qa_list )

@app .route ("/festivals")
def festivals ():
    festivals_list =load_static_data ("festivals.json")
    return render_template ("festivals.html",festivals =festivals_list )

@app .route ("/audio")
def audio_meditation ():
    audio_list =load_static_data ("audio_meditation.json")
    return render_template ("audio.html",audio_list =audio_list )

@app .route ("/about")
def about ():
    return render_template ("about.html")

@app .route ("/contact")
def contact ():
    return render_template ("contact.html")

@app .route ("/api/contact",methods =["POST"])
def api_contact ():
    data =request .get_json ()or {}
    name =data .get ("name","").strip ()
    email =data .get ("email","").strip ()
    subject =data .get ("subject","").strip ()
    message =data .get ("message","").strip ()

    if not name or not email or not message :
        return jsonify ({"error":"Required fields are missing"}),400 

    messages =read_json (CONTACT_MSGS_FILE ,default_value =[])
    messages .append ({
    "timestamp":datetime .now ().strftime ("%Y-%m-%d %H:%M:%S"),
    "name":name ,
    "email":email ,
    "subject":subject ,
    "message":message 
    })
    write_json (CONTACT_MSGS_FILE ,messages )

    return jsonify ({"success":True })


if __name__ =="__main__":
    print ("✅ Adhyatma Manthan starting with clean white theme & JSON file storage...")
    print ("📖 Visit http://localhost:5000 in your browser")
    app .run (debug =True ,port =5000 )