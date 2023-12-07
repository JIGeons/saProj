import openai
import time
import json

from ..models import Review
from django.conf import settings

# my settings에서 api키 가져오기
openai.api_key = settings.OPEN_API_KEY

# open ai
def classification(reviews):  # 리뷰들의 10개 묶음
    print("질문 시작!")
    reviews += '위 문장들 하나하나씩 긍정이면 Y , 부정이면 N으로 답변해 주는데 {"answer": "Y"} 처럼 JSON 형태로 답변해 줘. sep="\n"'
    # '위 문장들 하나하나씩 긍정이면 1 , 부정이면 0으로 답변해주는데, 답변은 답변만 담아서 배열 형식으로 해줘'
    #print(reviews)
    good_or_bad = openai.ChatCompletion.create(
        model="gpt-4-1106-preview",
        messages=[
            {
                "role": "user",
                "content": reviews,
            }
        ],
        temperature=0.7
    )
    # print("-----------------gpt답변--------------------")
    # print(good_or_bad['choices'][0]['message']['content'])
    # print("----------------------------------------------")
    return good_or_bad['choices'][0]['message']['content']

def review_evaluation():
    reviews = Review.objects.filter(good_or_bad__isnull=True)

    #print(f"리뷰 : {reviews}")

    cnt = 0
    contents = ""
    num_list = []
    gpt_result = ""
    gb_list = []

    for review in reviews:
        cnt += 1
        review_content = review.content
        review_num = review.review_num

        review_content = '\"' + review_content + '\"\n'
        contents += review_content
        num_list.append(review_num)

        if ((cnt % 50) == 0) or (len(reviews) == cnt):
            start = time.time()
            for i in range(3):
                try:
                    gpt_result = classification(contents)
                    break
                except:
                    print(f"질문 재시도 {i+1} 번째")

            print('질문 완료!')
            gb_list = gpt_result.split('\n')
            gb_list = [item for item in gb_list if item != '']

            count = 0
            countGood = 0
            countBad = 0

            for gb, review_num in zip(gb_list, num_list):
                review_update = Review.objects.get(review_num=review_num)
                try:
                    json_gb = json.loads(gb)

                # 답변이 NULL 값일 때 해당 질문 만 다시 질문
                except json.decoder.JSONDecodeError as e:
                    print("gb : ", gb)
                    while True:
                        json_gb = json.loads(classification(review_update.content))
                        if json_gb["answer"] == 'Y' or json_gb["answer"] == 'N':
                            break
                    print("답변 완료")
                    count += 1
                    if json_gb["answer"] == 'Y':
                        review_update.good_or_bad = 1
                        countGood += 1
                    else:
                        review_update.good_or_bad = 0
                        countBad += 1
                    review_update.save()
                    print(f"JSONDecodeError 발생: {e}", review_update)

                else:
                    count += 1
                    if json_gb["answer"] == 'Y':
                        review_update.good_or_bad = 1
                        countGood += 1
                    else:
                        review_update.good_or_bad = 0
                        countBad += 1
                    review_update.save()

            # print(count,"개 리뷰 분류 소요시간 :", time.time() - start, sep='')
            # print("긍정 :", countGood, "개  | 부정 :", countBad, "개 분류했습니다.", sep='')
            # 초기화
            contents = ""
            num_list.clear()
            cnt = 0


    print("------end------")