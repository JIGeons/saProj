import pandas as pd

from django.core.paginator import Paginator, EmptyPage
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.db.models import Q
from django.http import HttpResponse
import io

from saApp.models import Product, Review
from .serializer import ProductSerializer, ReviewSerializer, ProductViewSerializer
from users.serializer import UserSerializer


def excel_download(reviews, start, end):
    review_data = Review.objects.filter(prd_id__in=reviews)

    # review_data의 내용이 없으면 리뷰 없음을 return
    if review_data.count() == 0:
        # http 메서드 요청 거절 - 405
        return Response({"success":"failed", "message":"해당 상품의 리뷰가 없습니다."}, status=405)

    # 리뷰 데이터 가져오기
    if start == '':
        if end == '':
            review_data = review_data.values()
        else:
            review_data = review_data.filter(Q(date__lte=end)).values().all()
    else:
        if end == '':
            review_data = review_data.filter(Q(date__gte=start)).values().all()
        else:
            review_data = review_data.filter(date__range=[start, end]).values().all()

    if review_data.count() == 0:
        return 'empty data'

    count = 0
    for product in reviews:
        review = review_data.filter(prd_id=product)
        count += 1
        if review.count() == 0:
            summary_data = {'상품명': [Product.objects.get(id=product).name],
                            '전체 리뷰 갯수': [""],
                            '긍정 리뷰 갯수': [""],
                            '부정 리뷰 갯수': [""],
                            '긍정 리뷰 비율': [""],
                            '부정 리뷰 비율': [""],
                            '기타': ["리뷰가 없습니다."],
                            }
        else:
            # 리뷰 갯수 구하기
            total = review.count()
            good = review.filter(good_or_bad=1).count()
            bad = review.filter(good_or_bad=0).count()
            good_per = round(good/total * 100, 2)
            bad_per = round(bad/total * 100, 2)

            # data 생성
            summary_data = {'상품명': [Product.objects.get(id=product).name],
                            '전체 리뷰 갯수': [total],
                            '긍정 리뷰 갯수': [good],
                            '부정 리뷰 갯수': [bad],
                            '긍정 리뷰 비율': [str(good_per) + '%'],
                            '부정 리뷰 비율': [str(bad_per) + '%'],
                            '기타': [""],
                            }

        if count == 1 :
            # 데이터 프레임 만들기
            summary_df = pd.DataFrame(summary_data)
        else :
            summary_df = pd.concat([summary_df, pd.DataFrame(summary_data)], ignore_index=True)

    # 리뷰 데이터를 DataFrame으로 변환
    df = pd.DataFrame.from_records(review_data)
    df = df.drop(columns=['id'])

    # good_or_bad 열 값 변경
    df['good_or_bad'] = df['good_or_bad'].map({'1': '긍정', '0':'부정'})

    df = df.rename(columns={'review_num': '리뷰 번호', 'prd_id': '상품 번호', 'user_name': '유저 이름', 'title': '제목', 'content': '내용', 'date': '작성 날짜', 'good_or_bad': '긍정/부정'})

    # 엑셀 파일 생성
    excel_data = io.BytesIO()
    excel = pd.ExcelWriter('드시모네_리뷰_데이터.xlsx', engine='xlsxwriter')

    # 상품정보 요약 시트 생성
    summary_df.to_excel(excel, sheet_name='리뷰데이터요약', index=False)

    # 각 상품 별로 다른 워크시트에 데이터 작성
    for prd_id, group_df in df.groupby('상품 번호'):
        # utf-8-sig는 Excel에서 한글이 제대로 인식되도록 하는 인코딩
        group_df.to_excel(excel, sheet_name=f'{Product.objects.get(id=prd_id).name}', index=False)

    excel.close()
    excel_data.seek(0)

    with open('드시모네_리뷰_데이터.xlsx', 'rb') as file:
        response = HttpResponse(file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=드시모네_리뷰_데이터.xlsx'

    return response

def get_max_review(prd_id):
    from django.db.models import Max
    max_review = Review.objects.filter(prd_id=prd_id).aggregate(Max('review_num'))
    max_review_num = max_review['review_num__max']

    if max_review_num is None :
        return 0

    return max_review_num

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class productView(APIView):
    def get(self, request, *args, **kwargs):
        user = UserSerializer(request.user)
        products = Product.objects.all()

        product_data = []
        for product in products:
            max_review_num = get_max_review(product.id)

            product_data.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'src': product.src,
                'count': product.count,
                'good': product.good,
                'bad': product.bad,
                'recent_review_num': max_review_num
            })

        # recent_review_num을 기준으로 내림차순 정렬
        product_data = sorted(product_data, key=lambda x: x['recent_review_num'], reverse=True)

        product_serializer = ProductViewSerializer(product_data, many=True)

        return Response({'products': product_serializer.data, 'user': user.data}, status=status.HTTP_200_OK)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class PrdDetailView(APIView):
    def get(self, request, *arg, **kwargs):
        prd_id = self.request.GET.get('prdid')

        product_data = Product.objects.get(id=prd_id)
        product_serializer = ProductSerializer(product_data, many=False)

        product_review_data = Review.objects.filter(prd_id=prd_id).values().order_by('-review_num')

        current_page = 1

        paginator = Paginator(product_review_data, 10)

        try:
            review_page = paginator.page(current_page)
        except EmptyPage:
            return Response({'detail': 'Invalid page.'}, status=400)

        response_data = {
            'review_page': list(review_page),
            'product': product_serializer.data,
        }

        return Response(response_data, status=status.HTTP_200_OK)

class DetailPaging(APIView):
    def get(self, request):
        prd_id = self.request.GET.get('prdid')
        current_page = self.request.GET.get('page')
        state = self.request.GET.get('state')
        start = self.request.GET.get('start')
        end = self.request.GET.get('end')
        search = self.request.GET.get('search')

        if state == 'all':
            if search == 'true':
                review_data = Review.objects.filter(prd_id=prd_id, date__range=[start, end]).values().order_by('-review_num')
            else:
                review_data = Review.objects.filter(prd_id=prd_id).values().order_by('-review_num')

            count = review_data.count()
            good = review_data.filter(good_or_bad=1).count()
            bad = review_data.filter(good_or_bad=0).count()

        elif state == 'good':
            if search == 'true':
                review_data = (Review.objects.filter(prd_id=prd_id, date__range=[start, end]))
                count = review_data.count()
                bad = review_data.filter(good_or_bad=0).count()
                review_data = review_data.filter(good_or_bad=1).values().order_by('-review_num')
                good = review_data.count()

            else:
                review_data = Review.objects.filter(prd_id=prd_id)
                count = review_data.count()
                good = review_data.filter(good_or_bad=1).count()
                bad = review_data.filter(good_or_bad=0).count()
                review_data = review_data.filter(good_or_bad=1).values().order_by('-review_num')

        elif state == 'bad':
            if search == 'true':
                review_data = (Review.objects.filter(prd_id=prd_id, date__range=[start, end]))
                count = review_data.count()
                bad = review_data.filter(good_or_bad=1).count()
                review_data = review_data.filter(good_or_bad=0).values().order_by('-review_num')
                good = review_data.count()

            else:
                review_data = Review.objects.filter(prd_id=prd_id)
                count = review_data.count()
                good = review_data.filter(good_or_bad=1).count()
                bad = review_data.filter(good_or_bad=0).count()
                review_data = review_data.filter(good_or_bad=0).values().order_by('-review_num')

        else:
            return Response({'detail': 'Invalid state.'}, status=400)

        paginator = Paginator(review_data, 10)


        try:
            review_page = paginator.page(current_page)
        except EmptyPage:
            return Response({'detail': 'Invalid page.'}, status=400)


        return Response({
            "reviews": list(review_page),
            "total": review_data.count(),
            "count": count,
            "good": good,
            "bad": bad,
        }, status=200)


class ExcelDownload(APIView):
    def post(self, request):
        start = request.data.get('start')
        end = request.data.get('end')
        download = request.data.get('download')

        response = excel_download(download, start, end)

        return response

@method_decorator(csrf_exempt, name='dispatch')
class EditReviewGoodToBadView(APIView):
    def post(self, request):
        update_GB = request.data.get('selectedReviews')
        prd_id = request.data.get('productId')

        reviews = Review.objects.filter(prd_id=prd_id)
        try:
            # update_GB 리스트의 길이 만큼 반복
            for review_num in update_GB:
                # 해당 리뷰를 찾고
                review = reviews.get(review_num=review_num)
                # good_or_bad 값 수정
                if review.good_or_bad == '1':
                    review.good_or_bad = '0'
                elif review.good_or_bad == '0':
                    review.good_or_bad = '1'
                review.save()

            update_reviews = Review.objects.filter(prd_id=prd_id)
            reviews_data = ReviewSerializer(update_reviews, many=True)
            response_data = {
                'reviews': reviews_data.data,
                'message': '결과: 성공!! 리뷰를 수정하였습니다.'
            }
            return Response(response_data)

        except Review.DoesNotExist:
            response_data = {'message': '결과: 실패,, 선택한 리뷰 중 일부를 찾을 수 없습니다.'}
            return Response(response_data, status=404)
        # return Response({}, status=200)


# Create your views here.
