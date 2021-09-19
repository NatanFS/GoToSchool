from datetime import datetime
from datetime import timedelta

import locale
import re
from time import time

locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8' )
date = datetime.now() + timedelta(days=1)
for i in range (10):
    if date.weekday() < 5:
        dateText = date.strftime("%d de %B %Y")
        print(dateText)
        #dbRealtime.child(f"dados/dias/{dateText}")
    date += timedelta(days=1)
