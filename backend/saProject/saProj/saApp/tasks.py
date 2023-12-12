from __future__ import absolute_import, unicode_literals

import json

# @shared_task 데코레이터는 어떤 구체화된 app 인스턴스 없이도 task를 만들 수 있게 해준다.
from celery import shared_task

from .models import Review
from .services.openAi import review_evaluation
from .services.prdReviewCnt import reviewCount
from .services.scrapping_service import scrapping

@shared_task
def scrapping_review():
    scrapping()
    print("scrapping is done gpt question start~!!")
    review_evaluation()
    print("GPT 질문 완료. 종합하겠습니다.")
    reviewCount()
    print("종합이 완료되었습니다. task 끝")

