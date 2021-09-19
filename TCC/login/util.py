import pyrebase
import random
import time
import numpy
import datetime

def initialize_firebase():
    credentials_google = {
    "type": "service_account",
    "project_id": "projetointegrador-7141d",
    "private_key_id": "2e6950a3102c5fcf453302f0168a4cee43f67f13",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCk5+cA22QXOMyu\nvaTiS6i6RpTRJAe2OxXuZkjIsHI0Nhm39u7YxW5xbuL/lQ6cdRTEht7rTHTwlALb\n1rRXHWPrYZ8Tr3t18svX6PkyHU3/cOlKiW7d3E9xjk6p461otvZpm9axovduW/PU\nQt+3+wiT8NiKJ85jz2Tng/GwGyNZ18fmewVrxnqvu91y4s7LE0xu9/TtY+37nx6u\nh58o6OBMfml44fbYSh4qWGiyHHpDPZ+cgFDdVQYmZcGodVQtxO48Cg0oyi/sMpkO\nbJXJYhijBxgHMc3kas22p2cYPd679Z12n4mR6z0Cp4MsFqEDBcAC0jH1vLm2h4yc\nlQIb62nhAgMBAAECggEADr85UoOMICKBdWf6uIz9Dgl1Uf2nneWLSMpHXIEg+WfU\nJXY09lgzj/vTW3lUOOwkew23njG0bHZECi5ZasfzUU+l1vAUuZ/ImGqabF+gA8Ww\nayy+qCMFTLml8b3tWkWwZBHeYXzaJTmeZL9FO/H8WqSJbNNx+s2Hb8fGI5JNt0E2\ndxgCEttgy1g7m+AWmMQCkjUPVSldLx22BJKOxzpL6VyZefViSHDSkTrL5SsibXEz\nbdwgrnNTXApesV4vW0uQPhEYR7Zer0XsBBQFwC49dB4UJ2ZOZF5Pt2qqZri6+MRY\n4dG7M6qxylZ/j/jtDnKpSyzdNpgvCaci69zcOii+pQKBgQDoDGrn7JsNDD3TV9ZI\nSbtkN9+kwapCZHH01voD9KBCOO1xyROF5qfiPPZum7Oq2BRULVJYpPOmUA7aWF/C\nBsbVHRVoR3FndRVZYW/CeDHu9evMP7NvZQjprOiD6ofCFvkaFyWDRtayzzTkl+LY\np9/B2DzdWhI5+dOm7kl5jshS/QKBgQC17VPCCS4WD4NIfMwN6PWntiqf2yXtkhec\nux/z/nofhwCRMCgQFxiTLTd4bHr6Int+8+Oc4Y3nZ8Ch+0uEcAIETTADLww3PlYC\nfYm+9tBSdUVOAgbx7uaImBVcWluhYOK2n+lHFjLd6b8K7fG2+gxaUTvNKvbQVan3\nsvTg4hjBtQKBgAQcXDR5m5GSmvHIh5JGRByVZM/dYm/EqcQlns49Ii2qJoKyhjcE\nDAtU+ySge4FWTJ3lI6VQXsSefHTfxeqBBjq2Ri/PvDGSAGvR7xHp4TCTiLbYlgwu\nJQdGuePEXt1QXN9ac56svZbzVsOJ8UnXR35+ny1osBP42ggGBqUxo1jdAoGAHghu\n0lJ3pDatYpMPkKBLpYMiKD+iVETQ1xPhI4N4H6pGwrEje/yEFw/Y321xI8f7gSq8\nAZMOvQvYtiTpA5UGEDW53lyu9JO62TBmQ/s0ytgHN+iHwvrAXf5VUGiuRcbbxnBB\nr3WPsii7XA+J3r4KugI9EBKuqhfqNjT5zgIlOh0CgYEAxso+UrM6d5lzSq9ia7El\nhSfmdUJxEhrf1igansgpmvfYx8cRybdJcWaxb/Ox6O/GP0YLc+Icwk/De1HR8Vjk\nL7ub/wajmX/lRDrGRClczf3wdEjl1PJCR8s6Pzm9pj52PNk10VftEYhyj8kZMRqT\naaLgHJNiag7a8tiv45qPj9w=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-6vsr7@projetointegrador-7141d.iam.gserviceaccount.com",
    "client_id": "108262067636559201753",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6vsr7%40projetointegrador-7141d.iam.gserviceaccount.com"
    }

    config = {
        "apiKey": "AIzaSyCN-I4MtBOmEZh-UA0-wUaEaGb9aSfEqcA",
        "authDomain": "projetointegrador-7141d.firebaseapp.com",
        "databaseURL": "https://projetointegrador-7141d.firebaseio.com",
        "projectId": "projetointegrador-7141d",
        "storageBucket": "projetointegrador-7141d.appspot.com",
        "messagingSenderId": "173544521842",
        "appId": "1:173544521842:web:1f85ddf0d5dd23334182eb",
        "serviceAccount": credentials_google
    }
    firebase = pyrebase.initialize_app(config)
    return firebase

def filtrar_req_pendentes(req):
    if(req["statusRequisicão"] == 0):
        return req
    
def recuperarOnibus(req, db):
    bus = db.child("dados").child("dias").child(req["dataViagem"]) \
        .child("turnos").child(req["turnoViagem"]) \
        .child("onibusLista").child(req["onibusNome"]).get().val()
    return bus




class PushID(object):
    # Modeled after base64 web-safe chars, but ordered by ASCII.
    PUSH_CHARS = ('-0123456789'
                  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                  '_abcdefghijklmnopqrstuvwxyz')

    def __init__(self):

        # Timestamp of last push, used to prevent local collisions if you
        # pushtwice in one ms.
        self.lastPushTime = 0

        # We generate 72-bits of randomness which get turned into 12
        # characters and appended to the timestamp to prevent
        # collisions with other clients.  We store the last characters
        # we generated because in the event of a collision, we'll use
        # those same characters except "incremented" by one.
        self.lastRandChars = numpy.empty(12, dtype=int)

    def next_id(self):
        now = int(time.time() * 1000)
        duplicateTime = (now == self.lastPushTime)
        self.lastPushTime = now
        timeStampChars = numpy.empty(8, dtype=str)

        for i in range(7, -1, -1):
            timeStampChars[i] = self.PUSH_CHARS[now % 64]
            now = int(now / 64)

        if (now != 0):
            raise ValueError('We should have converted the entire timestamp.')

        uid = ''.join(timeStampChars)

        if not duplicateTime:
            for i in range(12):
                self.lastRandChars[i] = int(random.random() * 64)
        else:
            # If the timestamp hasn't changed since last push, use the
            # same random number, except incremented by 1.
            for i in range(11, -1, -1):
                if self.lastRandChars[i] == 63:
                    self.lastRandChars[i] = 0
                else:
                    break
            self.lastRandChars[i] += 1

        for i in range(12):
            uid += self.PUSH_CHARS[self.lastRandChars[i]]

        if len(uid) != 20:
            raise ValueError('Length should be 20.')
        return uid
    
def time_until_end_of_day(dt=None):
    if dt is None:
        dt = datetime.datetime.now()
    return 3
    #return ((24 - dt.hour - 1) * 60 * 60) + ((60 - dt.minute - 1) * 60) + (60 - dt.second)