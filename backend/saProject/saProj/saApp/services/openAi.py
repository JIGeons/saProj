import openai
import time
import json

from ..models import Review
from django.conf import settings

# my settings에서 api키 가져오기
openai.api_key = settings.OPEN_API_KEY

# open ai
def classification(reviews, cnt):  # 리뷰들의 50개 묶음
    reviews += '{}에 묶여 있는 리뷰가 하나의 리뷰이고, 각각의 리뷰마다 긍정이면 Y , 부정이면 N으로 답변해 주는데 {"answer": "Y"}, {"answer": "N"}이 두 가지 형태로만 답변해 줘.'
    # 답변이 질문의 갯수와 다르게 오는 일이 있어 답변의 갯수를 정해줌.
    reviews += f'질문은 총 {cnt}개 이니깐 답변도 {cnt}개를 줘야해. sep="\n"'

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
    while(True):
        question_cnt = 50 # 질문 갯 수

        reviews = Review.objects.filter(good_or_bad__isnull=True).order_by('id')[:question_cnt]

        print(f"리뷰 갯수 : {reviews.count()}")

        # reviews에 더 이상 필터링이 되는 것이 없으면 break;
        if reviews.count() == 0:
            print("------end------")
            break

        cnt = 0
        contents = ""
        num_list = []
        gpt_result = ""
        gb_list = []

        for review in reviews:
            cnt += 1
            review_content = review.content

            review_content = '{' + str(cnt) + '.' + review_content + '}' + '\n'
            contents += review_content
            num_list.append([review.review_num, review.prd_id])

            start = time.time()
            if cnt == reviews.count():
                print("질문 시작!")
                while(True):
                    try:
                        gpt_result = classification(contents, cnt)
                        gb_list = gpt_result.split('\n')
                        gb_list = [item for item in gb_list if item != '']
                        if len(gb_list) == cnt:
                            break
                        else:
                            print("질문의 응답이 정상적이지 않습니다. 다시 질문 합니다.")
                            with open("error.txt", "a", encoding="utf-8") as file:
                                que = f"질문 : {contents} \n"
                                ans = f"답변 : {gb_list} \n"
                                error = que + ans
                                file.write(str(error))
                    except Exception as e:
                        print(f"error message : {e}")

                print('질문 완료!')

                count = 0
                countGood = 0
                countBad = 0
                review_update_saving = []

                for gb, review_review in zip(gb_list, num_list):
                    review_update = Review.objects.get(review_num=review_review[0], prd_id=review_review[1])
                    try:
                        json_gb = json.loads(gb)

                    # 답변이 NULL 값일 때 해당 질문 만 다시 질문
                    except json.JSONDecodeError as e:
                        while True:
                            json_gb = json.loads(classification("{" + review_update.content + "}", 1))
                            if json_gb["answer"] == 'Y' or json_gb["answer"] == 'N':
                                break
                        print("답변 완료")
                        count += 1
                        if json_gb["answer"] == 'Y':
                            review_update.good_or_bad=1
                            countGood += 1
                        else:
                            review_update.good_or_bad=0
                            countBad += 1
                        review_update.save()
                        review_update_saving.append(review_update.good_or_bad)
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
                        review_update_saving.append(review_update.good_or_bad)

                saving_content = '질문 번호 : \n' + str(num_list) + '\n'
                saving_content += '질문 내용 : \n' + str(contents) + '\n'
                saving_content += '질문 답변 : \n' + str(gb_list) + '\n'
                saving_content += '질문 저장 : \n' + str(review_update_saving) + '\n'

                with open("saving_log.txt", "a", encoding="utf-8") as file:
                    file.write(saving_content)

                # print(count,"개 리뷰 분류 소요시간 :", time.time() - start, sep='')
                # print("긍정 :", countGood, "개  | 부정 :", countBad, "개 분류했습니다.", sep='')