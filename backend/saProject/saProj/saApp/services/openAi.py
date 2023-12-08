import openai
import time
import json

from ..models import Review
from django.conf import settings
from django.db.models import Min, Count

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
    reviews = Review.objects.filter(good_or_bad__isnull=True).order_by('id')

    #print(f"리뷰 : {reviews}")

    cnt = 0
    contents = ""
    num_list = []
    id_list = []
    gpt_result = ""
    gb_list = []

    for review in reviews:
        cnt += 1
        review_content = review.content
        review_num = review.review_num

        review_content = '\"' + review_content + '\"\n'
        contents += review_content
        num_list.append(review_num)

        if ((cnt % 100) == 0) or (len(reviews) == cnt):
            start = time.time()
            for i in range(3):
                try:
                    gpt_result = classification(contents)
                    break
                except:
                    print(f"질문 재시도 {i+1} 번째")

            gb_list = gpt_result.split('\n')
            gb_list = [item for item in gb_list if item != '']

            count = 0
            review_update_saving = []

            for gb, review_num in zip(gb_list, num_list):
                review_update = reviews.filter(review_num=review_num)
                print("리뷰 업데이트 : ", review_update)
                try:
                    if gb == '{':
                        print("답변이 잘못되어 질문을 다시 합니다.")
                        gb = json.loads(classification(review_update[0].content))

                    json_gb = json.loads(gb)

                # 답변이 NULL 값일 때 해당 질문 만 다시 질문
                except json.JSONDecodeError as e:
                    print("gb : ", gb)
                    while True:
                        print("답변 오류로 질문을 다시 합니다.")
                        json_gb = json.loads(classification(review_update[0].content))
                        if json_gb["answer"] == 'Y' or json_gb["answer"] == 'N':
                            break
                    print("답변 완료")
                    count += 1
                    if json_gb["answer"] == 'Y':
                        review_update.update(good_or_bad=1)
                    else:
                        review_update.update(good_or_bad=0)

                    print(f"JSONDecodeError 발생: {e}", review_update)

                else:
                    count += 1
                    if json_gb["answer"] == 'Y':
                        review_update.update(good_or_bad=1)
                    else:
                        review_update.update(good_or_bad=0)

                print("리뷰 : ", reviews.filter(good_or_bad__isnull=False))
                if (review_update.count() > 1):
                    review_update_saving.append(review_update[0].good_or_bad)
                else:
                    review_update_saving.append(review_update.good_or_bad)

            saving_content = '질문 번호 : \n' + str(num_list) + '\n'
            saving_content += '질문 답변 : \n' + str(gb_list) + '\n'
            saving_content += '질문 저장 : \n' + str(review_update_saving) + '\n'

            with open("saving_log.txt", "a", encoding="utf-8") as file:
                file.write(saving_content)

            # print(count,"개 리뷰 분류 소요시간 :", time.time() - start, sep='')
            # print("긍정 :", countGood, "개  | 부정 :", countBad, "개 분류했습니다.", sep='')
            # 초기화
            contents = ""
            num_list.clear()
            cnt = 0


    print("------end------")