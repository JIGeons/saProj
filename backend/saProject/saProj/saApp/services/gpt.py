import asyncio
import json
import time
from openai import Classification
from ..models import Review
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

openai.api_key = settings.OPEN_API_KEY

# 비동기 뷰 데코레이터
@csrf_exempt
async def asynchronous_review_evaluation(request):
    # 이 부분에서 필요한 request 처리

    async def make_async_request(semaphore, input_text):
        async with semaphore:
            try:
                result = await Classification.create(
                    model="gpt-4-1106-preview",
                    messages=[{"role": "user", "content": input_text}],
                    temperature=0.7
                )
                return result.choices[0].message['content']
            except Exception as e:
                return f"Error: {e}"

    semaphore = asyncio.Semaphore(20)  # 최대 동시 처리량 설정
    reviews = Review.objects.filter(good_or_bad__isnull=True)

    count_total = 0
    count_good = 0
    count_bad = 0

    async def process_reviews(reviews):
        nonlocal count_total, count_good, count_bad

        # 50개의 리뷰를 모아서 질문할 때의 버퍼 리스트
        buffer_reviews = []

        for review in reviews:
            review_content = review.content
            review_num = review.review_num

            review_content = '\"' + review_content + '\"\n'
            buffer_reviews.append(review_content)

            if len(buffer_reviews) == 50 or review == reviews.last():
                # 50개의 리뷰를 모아서 질문
                async with transaction.atomic():
                    try:
                        # 50개의 리뷰를 하나의 content로 합침
                        combined_content = '\n'.join(buffer_reviews)
                        gpt_result = await make_async_request(semaphore, combined_content)
                    except Exception as e:
                        print("비동기 요청 실패:", e)
                        continue

                    gb_list = gpt_result.split('\n')
                    gb_list = [item for item in gb_list if item != '']

                    for gb, review_num in zip(gb_list, buffer_reviews):
                        try:
                            json_gb = json.loads(gb)
                            count_total += 1

                            if json_gb["answer"] == 'Y':
                                review = Review.objects.get(review_num=review_num)
                                review.good_or_bad = 1
                                count_good += 1
                            else:
                                review = Review.objects.get(review_num=review_num)
                                review.good_or_bad = 0
                                count_bad += 1

                            review.save()
                        except json.decoder.JSONDecodeError as e:
                            print(gb)
                            while True:
                                try:
                                    json_gb = json.loads(await make_async_request(semaphore, combined_content))
                                    if json_gb["answer"] == 'Y' or json_gb["answer"] == 'N':
                                        break
                                except:
                                    print("비동기 요청 실패")
                            print("답변 완료")
                            count_total += 1
                            if json_gb["answer"] == 'Y':
                                review = Review.objects.get(review_num=review_num)
                                review.good_or_bad = 1
                                count_good += 1
                            else:
                                review = Review.objects.get(review_num=review_num)
                                review.good_or_bad = 0
                                count_bad += 1
                            review.save()
                            print(f"JSONDecodeError 발생: {e}")

                # 버퍼 비우기
                buffer_reviews = []

    await asyncio.gather(process_reviews(reviews))

    return JsonResponse({
        "total_reviews": count_total,
        "good_reviews": count_good,
        "bad_reviews": count_bad,
    })
