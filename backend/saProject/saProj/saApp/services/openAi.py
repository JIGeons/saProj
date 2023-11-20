import openai
import time
import json

from ..models import Review
from django.conf import settings

# my settings에서 api키 가져오기
openai.api_key = settings.OPEN_API_KEY

# open ai
def classification(reviews):  # 리뷰들의 10개 묶음
    reviews += '위 문장들 하나하나씩 긍정이면 Y , 부정이면 N으로 답변해 주는데 {"answer": "Y"} 처럼 JSON 형태로 답변해 줘. 구분은 ","쓰지 말고 줄바꿈은 한번만 해줘.'
    # '위 문장들 하나하나씩 긍정이면 1 , 부정이면 0으로 답변해주는데, 답변은 답변만 담아서 배열 형식으로 해줘'
    #print(reviews)
    good_or_bad = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
                "role": "user",
                "content": reviews,
            }
        ],
        temperature=0,
        max_tokens=1024
    )
    # print("-----------------gpt답변--------------------")
    # print(good_or_bad['choices'][0]['message']['content'])
    # print("----------------------------------------------")
    return good_or_bad['choices'][0]['message']['content']

def review_evaluation():

    # 소요시간을 재기 위함
    start = time.time()

    reviews = Review.objects.filter(good_or_bad__isnull=True)

    #print(f"리뷰 : {reviews}")

    cnt = 0
    contents = ""
    id_list = []
    gpt_result = ""
    gb_list = []

    for review in reviews:
        cnt += 1
        review_content = review.content
        review_id = review.id

        review_content = '\"' + review_content + '\"\n'
        contents += review_content
        id_list.append(review_id)

        if ((cnt % 50) == 0) or (len(reviews) == cnt):
            gpt_result = classification(contents)
            gb_list = gpt_result.split('\n')
            gb_list = [item for item in gb_list if item != '']
            #print(gb_list)

            for gb, id in zip(gb_list, id_list):
                review_update = Review.objects.get(id=id)
                json_gb = json.loads(gb)
                #print(json_gb["answer"])
                if json_gb["answer"] == 'Y':
                    review_update.good_or_bad = 1
                else:
                    review_update.good_or_bad = 0

                review_update.save()
            print("대기중...")
            time.sleep(10)
            # 초기화
            contents = ""
            id_list.clear()

    print("------end------")
    print("소요시간 :", time.time() - start)
